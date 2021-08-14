import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDeviceModelValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.minLength(1),
            rules.unique({ column: 'name', table: 'device_models' }),
        ]),
        icon: schema.string({ trim: true }, [rules.minLength(1)]),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
    }
}
