import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'

export default class Application extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @column()
    public name: string

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['name'],
        allowUpdates: true,
    })
    public slug: string

    @column()
    public servive?: string

    @column()
    public port: number

    @column()
    public url?: string

    @column()
    public image: string

    @column()
    public website?: string

    @column()
    public description?: string

    @beforeCreate()
    public static async defineId(model: Application) {
        model.id = uuid()
    }
}
