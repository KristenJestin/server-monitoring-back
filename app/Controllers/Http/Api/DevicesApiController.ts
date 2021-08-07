import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'

import Device from 'App/Models/Device'
import DeviceAlive from 'App/Models/DeviceAlive'

export default class DevicesApiController {
    public async status({ params, request, response }: HttpContextContract) {
        // data
        const status = params.status

        // definition
        const newStatusSchema = schema.create({
            device: schema.string({ trim: true }, [rules.minLength(10)]),
            name: schema.string({ trim: true }, [rules.minLength(1)]),
            os: schema.string.optional({ trim: true }, [rules.minLength(1)]),
            osVersion: schema.string.optional({ trim: true }, [rules.minLength(1)]),
        })
        const payload = await request.validate({ schema: newStatusSchema })

        // database
        if (Env.get('APP_AUTO_CREATE_DEVICE')) {
            await Device.updateOrCreate(
                { device: payload.device },
                { ...payload, status, connectionUpdatedAt: DateTime.local() }
            )
        }

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
