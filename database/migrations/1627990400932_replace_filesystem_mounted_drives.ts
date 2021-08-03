import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Drives extends BaseSchema {
    protected tableName = 'drives'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.string('mounted').notNullable()
            table.dropColumn('filesystem')
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('mounted')
            table.bigInteger('filesystem').notNullable()
        })
    }
}
