import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

import Device from 'App/Models/Device'
import DeviceDrive from 'App/Models/DeviceDrive'
import DeviceModel from 'App/Models/DeviceModel'
import EditDeviceValidator from 'App/Validators/EditDeviceValidator'

export default class DevicesController {
    public async index({ inertia }: HttpContextContract) {
        const devices = await Device.query().preload('model')
        return inertia.render('Devices/Index', { devices })
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const device = await Device.findByOrFail('slug', slug)

        return inertia.render('Devices/Show', { device })
    }

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

    public async destroy({ session, params, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const device = await Device.findByOrFail('slug', slug) // find element with slug

        // delete data
        await device.delete()

        session.flash('alert', {
            type: 'success',
            message: `The device '${device.name}' has been deleted.`,
        })
        return response.redirect().toRoute('devices.index')
    }

    //#region extras
    public async uptime({ params, request, response }: HttpContextContract) {
        // data
        const now = DateTime.now().toISODate()
        const interval = 10
        const dateFormat = 'yyyy-MM-dd'

        // request
        const slug = params.id // get slug in url
        const start = request.input('start', now)
        const end = request.input('end', now)

        try {
            await request.validate({
                schema: schema.create({
                    start: schema.date.optional({ format: dateFormat }),
                    end: schema.date.optional({ format: dateFormat }),
                }),
            })
        } catch (error) {
            return response.badRequest(error.messages)
        }

        // sql
        const device = await Device.findByOrFail('slug', slug) // find
        const sql = `
            SELECT
                COUNT(*) cnt,
                to_timestamp(floor((extract('epoch' from created_at) / (60*${interval}) )) * (60*${interval})) as interval
            FROM device_alives
            WHERE
                date(created_at) >= date(:start)
                AND date(created_at) <= date(:end)
                AND device = :device
            GROUP BY interval
            ORDER BY interval
        `
        const result = await Database.rawQuery<{
            rows: {
                count: number
                date: DateTime
            }[]
        }>(sql, {
            start,
            end,
            device: device.device,
        })

        return response.json(result.rows)
    }
    public async deactivate({ session, params, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const device = await Device.findByOrFail('slug', slug) // find element with slug

        // delete data
        device.merge({ deactivatedAt: !device.deactivatedAt ? DateTime.now() : null })
        await device.save()

        session.flash('alert', {
            type: 'success',
            message: `The device '${device.name}' has been deactivated.`,
        })
        return response.redirect().toRoute('devices.index')
    }

    public async drives({ params, inertia }: HttpContextContract) {
        const slug = params.id

        const device = await Device.findByOrFail('slug', slug)
        const drives = await DeviceDrive.query()
            .where('device', device.device)
            .orderBy('created_at')

        return inertia.render('Devices/Drives', { device, drives })
    }
    //#endregion
}
