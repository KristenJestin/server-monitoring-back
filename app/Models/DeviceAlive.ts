import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class DeviceAlive extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column()
    public device: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @beforeCreate()
    public static async defineId(model: DeviceAlive) {
        model.id = uuid()
    }
}
