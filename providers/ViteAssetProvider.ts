import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ViewContract } from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'

/**
 * Shape of manifest file
 */
export type Manifest = {
    name: string
    file: string
    src?: string
    isEntry?: boolean
    imports?: string[]
    css?: string[]
    assets?: string[]
}

/**
 * Provider to load vite asset in template
 */
export default class ViteAssetProvider {
    public static needsApplication = true
    constructor(protected application: ApplicationContract) {}

    public async boot() {
        this.application.container.withBindings(['Adonis/Core/View'], (view: ViewContract) => {
            const manifestPath = this.application.publicPath('manifest.json')
            view.global('vite_asset', (entry: string) => {
                if (!entry) return

                // asset in dev
                if (!this.application.inProduction) return this.assetDev(entry)

                return this.assetProd(entry, manifestPath)
            })
        })
    }

    // privates
    private assetDev = (entry: string) => `
        <script type="module" src="http://localhost:${Env.get('UI_PORT')}/@vite/client"></script>
        <script type="module" src="http://localhost:${Env.get('UI_PORT')}/${entry}" defer></script>
    `

    private assetProd = (entry: string, path: string) => {
        // check empty
        if (!path) return undefined

        // manifest file
        const manifests = require(path)

        // check exist
        if (!manifests[entry]) throw new Error(`Unable to locate asset file: ${entry}.`)

        const manifest = {
            ...manifests[entry],
            name: entry,
        }

        // result
        let html = ''

        if (manifest.file) html += `\n<script type="module" src="/${manifest.file}" defer></script>`

        if (manifest.css && manifest.css.length)
            for (const css of manifest.css) {
                html += `\n<link rel="stylesheet" media="screen"  href="/${css}" />`
            }

        if (manifest.imports && manifest.imports.length)
            for (const manifestImport of manifest.imports) {
                if (!manifests[manifestImport])
                    throw new Error(`Unable to find import file: ${manifestImport}.`)
                html += `\n<link rel="modulepreload" href="/${manifestImport}" />`
            }

        return html
    }
}
