import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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

        const document = await Document.create(payload)
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new document '${document.name}' has been added.`,
        })
        return response.redirect().toRoute('documents.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const document = await Document.query().where('slug', slug).preload('tag').firstOrFail()

        return inertia.render('Documents/Show', { document })
    }

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
