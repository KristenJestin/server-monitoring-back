import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { STATUS } from 'App/Models/DeviceStatus'

export default class DeviceStatuses extends BaseSchema {
    protected tableName = 'device_status'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()

            table.string('device')
            table.enum('status', Object.values(STATUS))

            table.timestamp('created_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
