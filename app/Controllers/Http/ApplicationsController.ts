import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { exec } from 'shelljs'

import ApplicationModel from 'App/Models/Application'
import CreateApplicationValidator from 'App/Validators/CreateApplicationValidator'
import EditApplicationValidator from 'App/Validators/EditApplicationValidator'
import { resizeImage } from 'App/Services/ApplicationFile'
import Service from 'App/Models/extra/Service'

export const IMAGE_FILE_PATHS = ['uploads', 'applications']

export default class ApplicationsController {
    public async index({ inertia }: HttpContextContract) {
        const applications = await ApplicationModel.all()
        return inertia.render('Applications/Index', { applications })
    }

    public async create({ inertia }: HttpContextContract) {
        return inertia.render('Applications/Create')
    }

    public async store({ request, session, response }: HttpContextContract) {
        const { imageFile: uploadedFile, ...payload } = await request.validate(
            CreateApplicationValidator
        )
        const fileName = await resizeImage(IMAGE_FILE_PATHS, uploadedFile)

        const application = await ApplicationModel.create({
            ...payload,
            image: fileName,
        })
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new application '${application.name}' has been added.`,
        })
        return response.redirect().toRoute('applications.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const application = await ApplicationModel.findByOrFail('slug', slug)

        return inertia.render('Applications/Show', { application })
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const application = await ApplicationModel.findByOrFail('slug', slug)

        return inertia.render('Applications/Edit', { application })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const application = await ApplicationModel.findByOrFail('slug', slug) // find element with slug

        const { imageFile: uploadedFile, ...payload } = await request.validate(
            EditApplicationValidator
        ) // validate sended data
        const fileName = await resizeImage(IMAGE_FILE_PATHS, uploadedFile)

        // update data
        application.merge({
            ...payload,
            image: fileName,
        })
        await application.save()

        session.flash('alert', {
            type: 'success',
            message: `The application '${application.name}' has been updated.`,
        })
        return response.redirect().toRoute('applications.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const application = await ApplicationModel.findByOrFail('slug', slug) // find element with slug

        // delete data
        await application.delete()

        session.flash('alert', {
            type: 'success',
            message: `The application '${application.name}' has been deleted.`,
        })
        return response.redirect().status(303).toRoute('applications.index')
    }

    //#region extra
    public async image({ params, response }: HttpContextContract) {
        const slug = params.id
        const type = params.type

        const application = await ApplicationModel.findByOrFail('slug', slug)
        const ext = 'jpg'
        let name: string

        switch (type) {
            case 'sm':
                name = '.sm.' + ext
                break
            case 'md':
                name = '.md.' + ext
                break
            case 'original':
                name = '.' + ext
                break
            default:
                name = '.md.' + ext
                break
        }

        return response.attachment(
            Application.tmpPath(...IMAGE_FILE_PATHS, application.image + name),
            application.slug + ext
        )
    }

    public async status({ params, response }: HttpContextContract) {
        // data
        // const isWin = process.platform === 'win32'

        // request
        const slug = params.id
        const application = await ApplicationModel.findByOrFail('slug', slug)

        if (!application.service) return undefined

        const service = new Service()
        service.service = application.service
        service.active = exec(`systemctl is-active ${application.service}`, {
            silent: true,
        }).stdout?.startsWith('active')

        // result
        return response.json(service)
    }
    //#endregion
}
