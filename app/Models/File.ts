import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class File extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column()
    public name: string

    @column()
    public ext: string

    @column()
    public path: string

    @column()
    public mimeType: string

    @column()
    public size: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async defineId(model: File) {
        model.id = uuid()
    }
}
