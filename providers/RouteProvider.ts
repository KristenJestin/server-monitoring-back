import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ViewContract } from '@ioc:Adonis/Core/View'

export default class RouteProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {
        const Router = this.app.container.use('Adonis/Core/Route')
        this.app.container.withBindings(['Adonis/Core/View'], (view: ViewContract) => {
            view.global('routes', () => {
                return `<script>const APP_ROUTES = ${JSON.stringify(
                    this.getRoutes(Router)
                )};window.APP_ROUTES = APP_ROUTES;</script>`
            })
        })
    }

    private getRoutes(router: any) {
        const routes = router.toJSON()
        return routes['root'].map((route) => {
            // let handler = 'Closure'
            if (route.meta.resolvedHandler && !route.pattern.startsWith('/api'))
                // if (route.meta.resolvedHandler.type !== 'function' && route.meta.namespace) {
                //     handler = `${route.meta.resolvedHandler['namespace']}.${route.meta.resolvedHandler['method']}`
                // } else if (route.meta.resolvedHandler.type !== 'function') {
                //     const method = route.meta.resolvedHandler['method']
                //     const routeHandler = route.handler
                //     handler = `${(routeHandler as string).replace(
                //         new RegExp(`.${method}$`),
                //         ''
                //     )}.${method}`
                // }

                return {
                    methods: route.methods,
                    name: route.name || '',
                    pattern: route.pattern,
                }
        })
    }
}
