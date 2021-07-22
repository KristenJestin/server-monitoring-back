import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Tag from 'App/Models/Tag'
import CreateTagValidator from 'App/Validators/CreateTagValidator'

export default class TagsController {
    public async index({ inertia }: HttpContextContract) {
        const tags = await Tag.all()
        return inertia.render('Tags/Index', { tags })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('Tags/Create')
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateTagValidator)

        const tag = await Tag.create(payload)
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new tag '${tag.name}' has been added.`,
        })
        return response.redirect().toRoute('tags.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const tag = await Tag.findByOrFail('slug', slug)

        return inertia.render('Tags/Show', { tag })
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const tag = await Tag.findByOrFail('slug', slug)

        return inertia.render('Tags/Edit', { tag })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const tag = await Tag.findByOrFail('slug', slug) // find element with slug

        const payload = await request.validate(CreateTagValidator) // validate sended data

        // update data
        tag.merge(payload)
        await tag.save()

        session.flash('alert', {
            type: 'success',
            message: `The tag '${tag.name}' has been updated.`,
        })
        return response.redirect().status(303).toRoute('tags.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const tag = await Tag.findByOrFail('slug', slug) // find element with slug

        // delete data
        await tag.delete()

        session.flash('alert', {
            type: 'success',
            message: `The tag '${tag.name}' has been deleted.`,
        })
        return response.redirect().status(303).toRoute('tags.index')
    }
}
