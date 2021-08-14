// imports
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import Env from '@ioc:Adonis/Core/Env'

import Device from 'App/Models/Device'

// main
const checkApiKey = async (
    device: Device | null | undefined,
    deviceId: string,
    request: HttpContextContract['request']
): Promise<void> => {
    if (Env.get('APP_DEVICE_USE_KEY')) {
        const authorizationHeader = request.header('Authorization')

        if (!device) device = await Device.findByOrFail('device', deviceId)
        const key =
            authorizationHeader && authorizationHeader.startsWith('Bearer ')
                ? authorizationHeader.substring(7, authorizationHeader.length)
                : undefined

        if (!key || device.apiKey !== key)
            throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS')
    }
}

// exports
export { checkApiKey }
