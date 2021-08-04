import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditApplicationValidator {
    constructor(protected ctx: HttpContextContract) {}

    public refs = schema.refs({
        slug: this.ctx.params.id,
    })

    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(1)]),
        port: schema.number([
            rules.unsigned(),
            rules.unique({
                column: 'port',
                table: 'applications',
                whereNot: { slug: this.refs.slug },
            }),
            rules.range(1023, 65535),
        ]),
        imageFile: schema.file.optional({
            size: '20mb',
            extnames: ['jpg', 'gif', 'png'],
        }),
        service: schema.string.optional({ trim: true }, [
            rules.minLength(1),
            rules.alpha({
                allow: ['underscore', 'dash'],
            }),
        ]),
        url: schema.string.optional({ trim: true }, [rules.minLength(1)]),
        website: schema.string.optional({ trim: true }, [rules.minLength(1), rules.url()]),
        description: schema.string.optional({ trim: true }, [rules.minLength(1)]),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
        unique: 'This {{ field }} already exists.',
        unsigned: 'The {{ field }} must be greater than 0.',
        range: 'The {{ field }} is not valid.',
    }
}
