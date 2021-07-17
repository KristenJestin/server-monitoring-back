import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import State from 'App/Models/State'
import CreateStateValidator from 'App/Validators/CreateStateValidator'

export default class StatesController {
    public async index({ inertia }: HttpContextContract) {
        const states = await State.all()
        return inertia.render('States/Index', { states })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('States/Create')
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateStateValidator)

        const state = await State.create(payload)
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new state '${state.name}' has been added.`,
        })
        return response.redirect().toRoute('states.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const state = await State.findByOrFail('slug', slug)

        return inertia.render('States/Show', { state })
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const state = await State.findByOrFail('slug', slug)

        return inertia.render('States/Edit', { state })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const state = await State.findByOrFail('slug', slug) // find element with slug

        const payload = await request.validate(CreateStateValidator) // validate sended data

        // update data
        state.merge(payload)
        await state.save()

        session.flash('alert', {
            type: 'success',
            message: `The state '${state.name}' has been updated.`,
        })
        return response.redirect().status(303).toRoute('states.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const state = await State.findByOrFail('slug', slug) // find element with slug

        // update data
        await state.delete()

        session.flash('alert', {
            type: 'success',
            message: `The state '${state.name}' has been deleted.`,
        })
        return response.redirect().status(303).toRoute('states.index')
    }
}
