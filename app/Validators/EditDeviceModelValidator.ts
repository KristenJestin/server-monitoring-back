import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditDeviceModelValidator {
    constructor(protected ctx: HttpContextContract) {}

    public refs = schema.refs({
        slug: this.ctx.params.id,
    })

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.minLength(1),
            rules.unique({
                column: 'name',
                table: 'device_models',
                whereNot: { slug: this.refs.slug },
            }),
        ]),
        icon: schema.string({ trim: true }, [rules.minLength(1)]),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
        unique: 'This {{ field }} already exists.',
        unsigned: 'The {{ field }} must be greater than 0.',
        range: 'The {{ field }} is not valid.',
    }
}
