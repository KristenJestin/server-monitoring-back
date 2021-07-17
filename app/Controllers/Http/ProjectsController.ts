import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Project from 'App/Models/Project'
import State from 'App/Models/State'
import CreateProjectValidator from 'App/Validators/CreateProjectValidator'

export default class ProjectsController {
    public async index({ inertia }: HttpContextContract) {
        const projects = await Project.all()

        return inertia.render('Projects/Index', { projects })
    }

    public async create({ inertia }: HttpContextContract) {
        const states = await State.all()
        return inertia.render('Projects/Create', { states })
    }

    public async store({ request, session, response }: HttpContextContract) {
        const payload = await request.validate(CreateProjectValidator)

        const project = await Project.create(payload)
        session.flash('alert', {
            type: 'success',
            message: `Nice! The new project '${project.name}' has been added.`,
        })
        return response.redirect().toRoute('projects.index')
    }

    public async show({ params, inertia }: HttpContextContract) {
        const slug = params.id
        const project = await Project.query().where('slug', slug).preload('state').firstOrFail()

        return inertia.render('Projects/Show', { project })
    }

    public async edit({}: HttpContextContract) {}

    public async update({}: HttpContextContract) {}

    public async destroy({}: HttpContextContract) {}
}
