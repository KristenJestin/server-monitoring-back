import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
    /**
     * The URL to redirect to when request is Unauthorized
     */
    protected redirectTo = '/auth'

    /**
     * Authenticates the current HTTP request against a custom set of defined
     * guards.
     *
     * The authentication loop stops as soon as the user is authenticated using any
     * of the mentioned guards and that guard will be used by the rest of the code
     * during the current request.
     */
    protected async authenticate(
        { auth, request, response }: HttpContextContract,
        guards: (keyof GuardsList)[]
    ) {
        for (let guard of guards) {
            if (await auth.use(guard).check()) {
                /**
                 * Instruct auth to use the given guard as the default guard for
                 * the rest of the request, since the user authenticated
                 * succeeded here
                 */
                auth.defaultGuard = guard
                return true
            }
        }

        /**
         * Unable to authenticate using any guard
         */
        response.redirect().toRoute('auth.index', { qs: { redirect: request.parsedUrl.pathname } })
        return false
    }

    /**
     * Handle request
     */
    public async handle(
        contract: HttpContextContract,
        next: () => Promise<void>,
        customGuards: (keyof GuardsList)[]
    ) {
        /**
         * Uses the user defined guards or the default guard mentioned in
         * the config file
         */
        const guards = customGuards.length ? customGuards : [contract.auth.name]
        await this.authenticate(contract, guards)
        await next()
    }
}
