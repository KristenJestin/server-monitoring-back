import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Devices extends BaseSchema {
    protected tableName = 'devices'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.timestamp('alive_updated_at', { useTz: true }).nullable()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('alive_updated_at')
        })
    }
}
