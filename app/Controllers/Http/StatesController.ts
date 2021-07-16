import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import State from 'App/Models/State'

export default class StatesController {
    public async index({ inertia }: HttpContextContract) {
        const states = await State.all()
        return inertia.render('States/Index', { states })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('States/Create')
    }

    public async store({ request, session, response }: HttpContextContract) {
        const postSchema = schema.create({
            name: schema.string({ trim: true }, [rules.minLength(3)]),
        })

        await request.validate({ schema: postSchema })

        session.flash('alert', { type: 'success', message: 'Nice! A new state has been added.' })
        return response.redirect('/states')
    }

    public async show({}: HttpContextContract) {}

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
