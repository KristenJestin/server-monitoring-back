import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'

import Document from 'App/Models/Document'

export default class Tag extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @column()
    public name: string

    @column()
    public color: string

    @column()
    public textColor: string

    @column()
    public icon: string

    @column()
    @slugify({
        strategy: 'simple',
        fields: ['name'],
        allowUpdates: true,
    })
    public slug: string

    @manyToMany(() => Document, {
        pivotTimestamps: true,
    })
    public documents: ManyToMany<typeof Document>

    @beforeCreate()
    public static async defineId(model: Tag) {
        model.id = uuid()
    }
}
