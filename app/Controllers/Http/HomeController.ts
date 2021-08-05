import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Drive from 'App/Models/Drive'
import { getDrivesInfo } from 'App/Services/Filesystem'
import Application from 'App/Models/Application'

export default class HomeController {
    public async index({ inertia }: HttpContextContract) {
        const drivesData = await Drive.all()
        const drives = await getDrivesInfo(drivesData)
        const applications = await Application.all()

        return inertia.render('Home', { drives, applications })
    }
}
