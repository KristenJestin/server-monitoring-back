import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EditDocumentValidator {
    constructor(protected ctx: HttpContextContract) {}
    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(3)]),
        tags: schema.array.optional().members(schema.string({ trim: true })),
        notes: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
    }
}
