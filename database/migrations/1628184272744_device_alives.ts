import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Devicealives extends BaseSchema {
    protected tableName = 'device_alives'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary()

            table.string('device').index()
            table.timestamp('created_at', { useTz: true }).index()

            table.unique(['device', 'created_at'])
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
