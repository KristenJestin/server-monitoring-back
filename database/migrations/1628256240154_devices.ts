import BaseSchema from '@ioc:Adonis/Lucid/Schema'

import { STATUS } from 'App/Models/Device'

export default class Devices extends BaseSchema {
    protected tableName = 'devices'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').index().primary()

            table.string('device').notNullable()
            table.string('name').notNullable()
            table.string('slug').notNullable()
            table.enum('status', Object.values(STATUS)).notNullable()
            table.string('display_name').nullable()
            table.string('os').nullable()
            table.string('os_version').nullable()
            table.timestamp('connection_updated_at', { useTz: true }).nullable()
            table.timestamp('deactivated_at', { useTz: true }).nullable()

            table.uuid('model_id').references('id').inTable('device_models')

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
