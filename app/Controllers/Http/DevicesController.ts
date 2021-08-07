import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Device from 'App/Models/Device'

export default class DevicesController {
    public async index({ inertia }: HttpContextContract) {
        const devices = await Device.all()
        return inertia.render('Devices/Index', { devices })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('Devices/Create')
    }

    public async store({}: HttpContextContract) {}

    public async show({}: HttpContextContract) {}

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
