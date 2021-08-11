import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    public async index({ inertia, request }: HttpContextContract) {
        const redirect = request.input('redirect')
        return inertia.render('Auth/Login', { redirect })
    }

    public async login({ auth, session, request, response }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        const rememberMe = request.input('rememberMe', false)
        const redirect = request.input('redirect')

        try {
            await auth.use('web').attempt(email, password, rememberMe)

            if (redirect) response.redirect(redirect)
            else response.redirect().toRoute('home')
        } catch (ex) {
            session.flash('errors', {
                global: ['Invalid credentials'],
            })
            response.redirect('back', true)
        }
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.use('web').logout()
        response.redirect().toRoute('auth.index')
    }
}
