import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'

import Tag from 'App/Models/Tag'

export default class Document extends BaseModel {
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
    public description?: string

    @manyToMany(() => Tag, {
        pivotTimestamps: true,
    })
    public tags: ManyToMany<typeof Tag>

    @beforeCreate()
    public static async defineId(model: Document) {
        model.id = uuid()
    }
}
