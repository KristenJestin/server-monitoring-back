import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFolderValidator {
    constructor(protected ctx: HttpContextContract) {}

    // public refs = schema.refs({
    //     tenantId: this.ctx.auth.user!.tenantId,
    // })

    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(3)]),
        color: schema.string.optional({ trim: true }, [rules.regex(/#(?:[0-9a-fA-F]{3}){1,2}$/)]),
        // TODO: check if is not a descendant
        parentId: schema.string.optional({}, [rules.exists({ table: 'folders', column: 'id' })]),
    })

    public messages = {
        required: '{{ field }} is required.',
        regex: '{{ field }} must have a valid hexa color.',
    }
}
