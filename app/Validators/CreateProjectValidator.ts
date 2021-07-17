import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProjectValidator {
    constructor(protected ctx: HttpContextContract) {}
    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(3)]),
        state: schema.string({}, [rules.exists({ table: 'states', column: 'slug' })]),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
    }
}
