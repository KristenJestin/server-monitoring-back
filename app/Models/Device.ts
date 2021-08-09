import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
    beforeCreate,
    BelongsTo,
    belongsTo,
    HasMany,
    hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { v4 as uuid } from 'uuid'

import DeviceModel from './DeviceModel'
import DeviceAlive from './DeviceAlive'

export enum STATUS {
    UP = 'up',
    DOWN = 'down',
}
export default class Device extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async defineId(model: Device) {
        model.id = uuid()
    }

    @column()
    public device: string

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
    public displayName?: string | null

    @column()
    public modelId?: string | null

    @belongsTo(() => DeviceModel, { foreignKey: 'modelId' })
    public model: BelongsTo<typeof DeviceModel>

    @column()
    public os?: string

    @column()
    public osVersion?: string

    @hasMany(() => DeviceAlive, { foreignKey: 'device' })
    public alives: HasMany<typeof DeviceAlive>

    @column()
    public status: STATUS

    @column.dateTime()
    public connectionUpdatedAt?: DateTime

    @column.dateTime()
    public deactivatedAt?: DateTime | null
}
