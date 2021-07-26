import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FolderRepository from 'App/Repositories/FolderRepository'
import Folder from 'App/Models/Folder'
import CreateFolderValidator from 'App/Validators/CreateFolderValidator'

export default class FoldersController {
    public async index({ inertia }: HttpContextContract) {
        const folders = await Folder.all()
        return inertia.render('Folders/Index', { folders })
    }

    public async create({ inertia }: HttpContextContract) {
        const folders = await Folder.all()
        return inertia.render('Folders/Create', { folders })
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateFolderValidator)

        const folder = await Folder.create(payload)
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new folder '${folder.name}' has been added.`,
        })
        return response.redirect().toRoute('folders.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const folder = await Folder.findByOrFail('slug', slug)

        return inertia.render('Folders/Show', { folder })
    }

    public async edit({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const folder = await Folder.query().where('slug', slug).preload('parent').firstOrFail()
        const folders = await FolderRepository.getOnlyAvailableParents(folder.id)

        return inertia.render('Folders/Edit', { folder, folders })
    }

    public async update({ session, params, request, response }: HttpContextContract) {
        response.status(303) // force status to work with inertia for redirection in succes case BUT in fail case too

        const slug = params.id // get slug in url
        const folder = await Folder.findByOrFail('slug', slug) // find element with slug

        const payload = await request.validate(CreateFolderValidator) // validate sended data

        // update data
        folder.merge({ color: null, parentId: null, ...payload })
        await folder.save()

        session.flash('alert', {
            type: 'success',
            message: `The folder '${folder.name}' has been updated.`,
        })
        return response.redirect().status(303).toRoute('folders.index')
    }

    public async destroy({ session, params, response }: HttpContextContract) {
        const slug = params.id // get slug in url
        const folder = await Folder.findByOrFail('slug', slug) // find element with slug

        // delete data
        await folder.delete()

        session.flash('alert', {
            type: 'success',
            message: `The folder '${folder.name}' has been deleted.`,
        })
        return response.redirect().status(303).toRoute('folders.index')
    }
}
