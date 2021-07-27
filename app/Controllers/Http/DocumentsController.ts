import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import Document from 'App/Models/Document'
import Tag from 'App/Models/Tag'
import File from 'App/Models/File'
import CreateDocumentValidator from 'App/Validators/CreateDocumentValidator'
import EditDocumentValidator from 'App/Validators/EditDocumentValidator'
import Folder from 'App/Models/Folder'

export default class DocumentsController {
    public async index({ inertia, request }: HttpContextContract) {
        const { search, tags } = request.qs()

        // filters
        let query = Document.query().select('documents.*')
        if (search)
            query = query.where((q) => {
                q.where('documents.name', 'LIKE', `%${search}%`).orWhere(
                    'documents. notes',
                    'LIKE',
                    `%${search}%`
                )
            })
        if (tags && tags.length) {
            query = query
                .innerJoin('document_tag', 'documents.id', '=', 'document_tag.document_id')
                .innerJoin('tags', 'document_tag.tag_id', '=', 'tags.id')
            for (const tag of tags) {
                query = query.andWhere('tags.slug', tag)
            }
        }

        // data
        const documents = await query

        return inertia.render('Documents/Index', {
            documents,
            filters: { search, tags },
            tags: await Tag.all(),
        })
    }

    public async create({ inertia }: HttpContextContract) {
        const tags = await Tag.all()
        const folders = await Folder.all()

        return inertia.render('Documents/Create', { tags, folders })
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateDocumentValidator)

        const document = await Database.transaction(async (trx) => {
            // file
            const uploadedFile = payload.file
            const fileName = `${cuid()}.${uploadedFile.extname}`
            await uploadedFile.move(Application.tmpPath('uploads'), {
                name: fileName,
            })
            const file = await File.create(
                {
                    name: uploadedFile.clientName,
                    ext: uploadedFile.extname,
                    path: fileName,
                    mimeType: uploadedFile.type,
                    size: uploadedFile.size,
                },
                { client: trx }
            )

            // tags
            let tags: Tag[] = []
            if (payload.tags && payload.tags.length)
                tags = await Tag.fetchOrCreateMany(
                    'name',
                    payload.tags.map((tag) => ({
                        name: tag,
                        color: '#f97316',
                        textColor: '#ffffff',
                    })),
                    { client: trx }
                )

            // document with tags
            const document = await Document.create({ ...payload, fileId: file.id }, { client: trx })
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
        const document = await Document.query()
            .where('slug', slug)
            .preload('tags')
            .preload('folder')
            .firstOrFail()
        const tags = await Tag.all()
        const folders = await Folder.all()

        return inertia.render('Documents/Edit', { document, tags, folders })
    }

    public async update({ request, session, response, params }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id
        const document = await Document.findByOrFail('slug', slug)
        const payload = await request.validate(EditDocumentValidator)

        const newDocument = await Database.transaction(async (trx) => {
            let tags: Tag[] = []
            if (payload.tags && payload.tags.length)
                tags = await Tag.fetchOrCreateMany(
                    'name',
                    payload.tags.map((tag) => ({
                        name: tag,
                        color: '#f97316',
                        textColor: '#ffffff',
                    })),
                    { client: trx }
                )

            document.merge({
                folderId: null,
                notes: null,
                receivedAt: null,
                amount: null,
                duration: null,
                ...payload,
            })
            document.useTransaction(trx)
            await document.save()

            await document.related('tags').sync(tags.map((tag) => tag.id))

            return document
        })

        session.flash('alert', {
            type: 'success',
            message: `Nice! The new document '${newDocument.name}' has been added.`,
        })
        return response.redirect().toRoute('documents.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const document = await Document.findByOrFail('slug', slug) // find element with slug

        // delete data
        await document.softDelete()

        session.flash('alert', {
            type: 'success',
            message: `The document '${document.name}' has been deleted.`,
        })
        return response.redirect().status(303).toRoute('documents.index')
    }

    public async download({ params, response }: HttpContextContract) {
        const slug = params.id
        const document = await Document.query().where('slug', slug).preload('file').firstOrFail()

        return response.attachment(
            Application.tmpPath('uploads', document.file.path),
            document.file.name
        )
    }
}
