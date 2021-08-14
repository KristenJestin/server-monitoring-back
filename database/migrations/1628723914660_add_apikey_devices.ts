import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Devices extends BaseSchema {
    protected tableName = 'devices'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.uuid('api_key').notNullable()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('api_key')
        })
    }
}
