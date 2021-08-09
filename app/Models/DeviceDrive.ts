import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, computed } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'

export default class DeviceDrive extends BaseModel {
    @column({ isPrimary: true })
    public id: string

    @column()
    public device: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @beforeCreate()
    public static async defineId(model: DeviceDrive) {
        model.id = uuid()
    }

    @column()
    public driveFormat: string

    @column()
    public driveType: string

    @column()
    public isReady: boolean

    @column()
    public name: string

    @column()
    public availableFreeSpace: number

    @column()
    public totalFreeSpace: number

    @column()
    public totalSize: number

    @column()
    public volumeLabel?: string

    @computed({ serializeAs: 'total_used_space' })
    public get totalUsedSpace() {
        return this.totalSize - this.totalFreeSpace
    }

    @computed({ serializeAs: 'total_used_percentage' })
    public get totalUsedPercentage() {
        return 100 - (this.totalFreeSpace * 100) / this.totalSize
    }
}
