import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateApplicationValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(1)]),
        port: schema.number([
            rules.unsigned(),
            rules.unique({ column: 'port', table: 'applications' }),
        ]),
        imageFile: schema.file({
            size: '20mb',
            extnames: ['jpg', 'gif', 'png'],
        }),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
        unique: 'This {{ field }} already exists.',
        unsigned: 'The {{ field }} must be greater than 0.',
    }
}
