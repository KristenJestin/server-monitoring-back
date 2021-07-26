import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
    computed,
    manyToMany,
    ManyToMany,
    beforeCreate,
    beforeFind,
    beforeFetch,
    belongsTo,
    BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'
import { softDelete, softDeleteQuery } from 'App/Services/SoftDelete'

import Tag from 'App/Models/Tag'
import File from 'App/Models/File'
import Folder from 'App/Models/Folder'

export default class Document extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @column.dateTime()
    public deletedAt?: DateTime

    @column()
    public name: string

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['name'],
        allowUpdates: true,
    })
    public slug: string

    @manyToMany(() => Tag, {
        pivotTimestamps: true,
    })
    public tags: ManyToMany<typeof Tag>

    @column()
    public fileId: string

    @belongsTo(() => File)
    public file: BelongsTo<typeof File>

    @column()
    public notes?: string

    @column.date()
    public receivedAt?: DateTime

    @column()
    public amount?: number

    @column()
    public duration?: number

    @column()
    public folderId?: string

    @belongsTo(() => Folder)
    public folder: BelongsTo<typeof Folder>

    @computed()
    public get endAt() {
        if (!this.duration || this.duration <= 0) return undefined
        return (this.receivedAt || this.createdAt).plus({ month: this.duration })
    }

    @beforeCreate()
    public static async defineId(model: Document) {
        model.id = uuid()
    }

    @beforeFind()
    public static softDeletesFind = softDeleteQuery
    @beforeFetch()
    public static softDeletesFetch = softDeleteQuery

    public async softDelete(column?: string) {
        await softDelete(this, column)
    }
}
