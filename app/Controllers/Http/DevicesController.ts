import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Device from 'App/Models/Device'
import DeviceModel from 'App/Models/DeviceModel'
import EditDeviceValidator from 'App/Validators/EditDeviceValidator'

export default class DevicesController {
    public async index({ inertia }: HttpContextContract) {
        const devices = await Device.query().preload('model')
        return inertia.render('Devices/Index', { devices })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('Devices/Create')
    }

    public async store({}: HttpContextContract) {}

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const device = await Device.findByOrFail('slug', slug)
        const models = await DeviceModel.all()

        return inertia.render('Devices/Edit', { device, models })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const device = await Device.findByOrFail('slug', slug) // find element with slug

        const { name, model } = await request.validate(EditDeviceValidator) // validate sended data

        // update data
        device.merge({ displayName: name || null, modelId: model || null })
        await device.save()

        session.flash('alert', {
            type: 'success',
            message: `The device '${device.name}' has been updated.`,
        })
        return response.redirect().status(303).toRoute('devices.index')
    }

    public async destroy({}: HttpContextContract) {}
}
