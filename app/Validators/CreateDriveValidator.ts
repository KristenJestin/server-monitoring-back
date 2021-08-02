import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { getFilesystemsSync } from 'App/Services/Filesystem'

export default class CreateDriveValidator {
    constructor(protected ctx: HttpContextContract) {}

    public refs = schema.refs({
        filesystems: getFilesystemsSync(),
    })

    public schema = schema.create({
        name: schema.string({ trim: true }, [rules.minLength(1)]),
        filesystem: schema.enum(this.refs.filesystems),
    })

    public messages = {}
}
