import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getMountedsSync } from 'App/Services/Filesystem'

export default class CreateDriveValidator {
    constructor(protected ctx: HttpContextContract) {}

    public refs = schema.refs({
        mounteds: getMountedsSync(),
    })

    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(1)]),
        mounted: schema.enum(this.refs.mounteds),
    })

    public messages = {}
}
