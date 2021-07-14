import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Models/State'

export default class StatesController {
    public async index({ inertia }: HttpContextContract) {
        const states = await State.all()
        return inertia.render('States/Index', { states })
    }

    public async create({}: HttpContextContract) {}

    public async store({}: HttpContextContract) {}

    public async show({}: HttpContextContract) {}

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
