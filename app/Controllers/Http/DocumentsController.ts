import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import Document from 'App/Models/Document'
import Tag from 'App/Models/Tag'
import CreateDocumentValidator from 'App/Validators/CreateDocumentValidator'

export default class DocumentsController {
    public async index({ inertia }: HttpContextContract) {
        const documents = await Document.all()

        return inertia.render('Documents/Index', { documents })
    }

    public async create({ inertia }: HttpContextContract) {
        const tags = await Tag.all()
        return inertia.render('Documents/Create', { tags })
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateDocumentValidator)

        const document = await Database.transaction(async (trx) => {
            const tags = await Tag.fetchOrCreateMany(
                'name',
                payload.tags.map((tag) => ({
                    name: tag,
                    color: '#f97316',
                    textColor: '#ffffff',
                })),
                { client: trx }
            )
            const document = await Document.create(payload, { client: trx })
            await document.related('tags').saveMany(tags, true)

            return document
        })

        session.flash('alert', {
            type: 'success',
            message: `Nice! The new document '${document.name}' has been added.`,
        })
        return response.redirect().toRoute('documents.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const document = await Document.query().where('slug', slug).preload('tags').firstOrFail()

        return inertia.render('Documents/Show', { document })
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const document = await Document.query().where('slug', slug).preload('tags').firstOrFail()
        const tags = await Tag.all()

        return inertia.render('Documents/Edit', { document, tags })
    }

    public async update({ request, session, response, params }: HttpContextContract) {
        const slug = params.id
        const payload = await request.validate(CreateDocumentValidator)

        const newDocument = await Database.transaction(async (trx) => {
            const document = await Document.findByOrFail('slug', slug)
            const tags = await Tag.fetchOrCreateMany(
                'name',
                payload.tags.map((tag) => ({
                    name: tag,
                    color: '#f97316',
                    textColor: '#ffffff',
                })),
                { client: trx }
            )

            document.merge(payload)
            document.useTransaction(trx)
            await document.save()

            await document.related('tags').sync(tags.map((tag) => tag.id))

            return document
        })

        session.flash('alert', {
            type: 'success',
            message: `Nice! The new document '${newDocument.name}' has been added.`,
        })
        return response.redirect().status(303).toRoute('documents.index')
    }

    public async destroy({}: HttpContextContract) {}
}
