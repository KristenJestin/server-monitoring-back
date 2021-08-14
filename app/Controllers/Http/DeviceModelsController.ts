import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import DeviceModel from 'App/Models/DeviceModel'
import CreateDeviceModelValidator from 'App/Validators/CreateDeviceModelValidator'
import EditDeviceModelValidator from 'App/Validators/EditDeviceModelValidator'

export default class DeviceModelsController {
    public async index({ inertia }: HttpContextContract) {
        const models = await DeviceModel.all()
        return inertia.render('DeviceModels/Index', { models })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('DeviceModels/Create')
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateDeviceModelValidator)
        const model = await DeviceModel.create(payload)

        session.flash('alert', {
            type: 'success',
            message: `Nice! The new model '${model.name}' has been added.`,
        })
        return response.redirect().toRoute('devices_models.index')
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const model = await DeviceModel.findByOrFail('slug', slug)

        return inertia.render('DeviceModels/Edit', { model })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const model = await DeviceModel.findByOrFail('slug', slug) // find element with slug

        const payload = await request.validate(EditDeviceModelValidator) // validate sended data

        // update data
        model.merge(payload)
        await model.save()

        session.flash('alert', {
            type: 'success',
            message: `The model '${model.name}' has been updated.`,
        })
        return response.redirect().status(303).toRoute('devices_models.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const model = await DeviceModel.findByOrFail('slug', slug) // find element with slug

        // delete data
        await model.delete()

        session.flash('alert', {
            type: 'success',
            message: `The model '${model.name}' has been deleted.`,
        })
        return response.redirect().toRoute('devices_models.index')
    }
}
