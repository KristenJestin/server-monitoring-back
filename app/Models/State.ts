import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'

export default class State extends BaseModel {
    @column({ isPrimary: true, prepare: (value: string) => (value ? value : uuid()) })
    public id: string

    @column()
    public name: string

    @column()
    public color: string

    @column()
    public textColor: string

    @column()
    public borderColor: string

    @column()
    @slugify({
        strategy: 'dbIncrement',
        fields: ['name'],
        allowUpdates: true,
    })
    public slug: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
