import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateDocumentValidator {
    constructor(protected ctx: HttpContextContract) {}

    // public refs = schema.refs({
    //     tenantId: this.ctx.auth.user!.tenantId,
    // })

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.minLength(3),
            rules.unique({ table: 'documents', column: 'name', caseInsensitive: true }),
        ]),
        tags: schema.array.optional().members(schema.string({ trim: true })),
        file: schema.file({
            size: '50mb',
            extnames: ['jpg', 'gif', 'png', 'pdf'],
        }),
        notes: schema.string.optional({ trim: true }, [rules.maxLength(500)]),
        receivedAt: schema.date.optional(
            {
                format: 'iso',
            },
            [rules.before(-1, 'days')]
        ),
        amount: schema.number.optional(),
        duration: schema.number.optional([rules.unsigned()]),
    })

    public messages = {
        required: '{{ field }} is required.',
        exists: 'This {{ field }} no longer exists.',
    }
}
