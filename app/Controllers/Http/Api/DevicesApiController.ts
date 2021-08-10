import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'
import { cuid } from '@ioc:Adonis/Core/Helpers'

import Device from 'App/Models/Device'
import DeviceAlive from 'App/Models/DeviceAlive'
import DeviceDrive from 'App/Models/DeviceDrive'

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

        // check if exist in database
        if (!Env.get('APP_AUTO_CREATE_DEVICE')) {
            await Device.findByOrFail('device', payload.device)
        }

        // database
        await DeviceAlive.create(payload)

        // return
        return response.status(201)
    }

    public async drives({ request, response }: HttpContextContract) {
        // definition
        const newDrivesSchema = schema.create({
            device: schema.string({ trim: true }, [rules.minLength(10)]),
            drives: schema.array().members(
                schema.object().members({
                    name: schema.string({ trim: true }, [rules.minLength(1)]),
                    isReady: schema.boolean(),
                    driveFormat: schema.string({ trim: true }, [rules.minLength(1)]),
                    driveType: schema.string({ trim: true }, [rules.minLength(1)]),
                    volumeLabel: schema.string.optional({ trim: true }),
                    availableFreeSpace: schema.number([rules.unsigned()]),
                    totalFreeSpace: schema.number([rules.unsigned()]),
                    totalSize: schema.number([rules.unsigned()]),
                })
            ),
        })
        const payload = await request.validate({ schema: newDrivesSchema })

        // check if exist in database
        if (!Env.get('APP_AUTO_CREATE_DEVICE')) {
            await Device.findByOrFail('device', payload.device)
        }

        // database
        const group = cuid()
        await DeviceDrive.createMany(
            payload.drives.map((d) => ({ ...d, device: payload.device, group }))
        )

        // return
        return response.status(201)
    }
}
