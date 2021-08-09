import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DeviceDrives extends BaseSchema {
    protected tableName = 'device_drives'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()

            table.string('device').index()
            table.timestamp('created_at', { useTz: true }).index()
            table.string('name').index().notNullable()
            table.bigInteger('available_free_space').notNullable()
            table.string('drive_format').notNullable()
            table.string('drive_type').notNullable()
            table.boolean('is_ready').notNullable()
            table.bigInteger('total_free_space').notNullable()
            table.bigInteger('total_size').notNullable()
            table.string('volume_label').nullable()

            table.unique(['device', 'name', 'created_at'])
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
