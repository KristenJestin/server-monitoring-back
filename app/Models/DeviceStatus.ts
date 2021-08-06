import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export enum STATUS {
    UP = 'up',
    DOWN = 'down',
}

export default class DeviceStatus extends BaseModel {
    public static table = 'device_status'

    @column({ isPrimary: true })
    public id: string

    @column()
    public device: string

    @column()
    public status: STATUS

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @beforeCreate()
    public static async defineId(model: DeviceStatus) {
        model.id = uuid()
    }
}
