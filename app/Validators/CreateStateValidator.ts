import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateStateValidator {
    constructor(protected ctx: HttpContextContract) {}

    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(3)]),
        color: schema.string({ trim: true }, [rules.regex(/#(?:[0-9a-fA-F]{3}){1,2}$/)]),
        borderColor: schema.string({ trim: true }, [rules.regex(/#(?:[0-9a-fA-F]{3}){1,2}$/)]),
        textColor: schema.string({ trim: true }, [rules.regex(/#(?:[0-9a-fA-F]{3}){1,2}$/)]),
    })

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages = {
        required: '{{ field }} is required.',
        regex: '{{ field }} must have a valid hexa color.',
    }
}
