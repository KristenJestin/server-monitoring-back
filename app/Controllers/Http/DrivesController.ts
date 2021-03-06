import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Drive from 'App/Models/Drive'
import CreateDriveValidator from 'App/Validators/CreateDriveValidator'
import { getDrivesInfo, getMounteds, getDriveInfoOrFail } from 'App/Services/Filesystem'

export default class DrivesController {
    public async index({ inertia }: HttpContextContract) {
        const drivesData = await Drive.all()
        const drives = await getDrivesInfo(drivesData)

        return inertia.render('Drives/Index', { drives })
    }

    public async create({ inertia }: HttpContextContract) {
        const mounteds = await getMounteds()
        return inertia.render('Drives/Create', { mounteds })
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateDriveValidator)

        const drive = await Drive.create(payload)
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new drive '${drive.name}' has been added.`,
        })
        return response.redirect().toRoute('drives.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const driveData = await Drive.findByOrFail('slug', slug)
        const drive = await getDriveInfoOrFail(driveData)

        return inertia.render('Drives/Show', { drive })
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const drive = await Drive.findByOrFail('slug', slug)
        const mounteds = await getMounteds()

        return inertia.render('Drives/Edit', { drive, mounteds })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const drive = await Drive.findByOrFail('slug', slug) // find element with slug

        const payload = await request.validate(CreateDriveValidator) // validate sended data

        // update data
        drive.merge(payload)
        await drive.save()

        session.flash('alert', {
            type: 'success',
            message: `The drive '${drive.name}' has been updated.`,
        })
        return response.redirect().status(303).toRoute('drives.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const drive = await Drive.findByOrFail('slug', slug) // find element with slug

        // delete data
        await drive.delete()

        session.flash('alert', {
            type: 'success',
            message: `The drive '${drive.name}' has been deleted.`,
        })
        return response.redirect().status(303).toRoute('drives.index')
    }
}
