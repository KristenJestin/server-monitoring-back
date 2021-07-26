import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'

export default class Folder extends BaseModel {
    @column({ isPrimary: true })
    public id: string

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
    public color?: string

    @column()
    public parentId?: string

    @belongsTo(() => Folder, { foreignKey: 'parentId' })
    public parent: BelongsTo<typeof Folder>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async defineId(model: Folder) {
        model.id = uuid()
    }
}
