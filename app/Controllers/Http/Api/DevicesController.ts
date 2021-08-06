import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import DeviceAlive from 'App/Models/DeviceAlive'
import DeviceStatus from 'App/Models/DeviceStatus'

export default class DevicesController {
    public async status({ params, request, response }: HttpContextContract) {
        // data
        const status = params.status

        // definition
        const newStatusSchema = schema.create({
            device: schema.string({ trim: true }, [rules.minLength(10)]),
        })
        const payload = await request.validate({ schema: newStatusSchema })

        // database
        await DeviceStatus.create({ ...payload, status })

        // return
        return response.status(201)
    }

    public async alive({ request, response }: HttpContextContract) {
        // definition
        const newAliveSchema = schema.create({
            device: schema.string({ trim: true }, [rules.minLength(10)]),
        })
        const payload = await request.validate({ schema: newAliveSchema })

        // TODO: check if mac address exists in device table

        // database
        await DeviceAlive.create(payload)

        // return
        return response.status(201)
    }
}
