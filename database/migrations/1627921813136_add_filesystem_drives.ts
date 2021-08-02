import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Drives extends BaseSchema {
    protected tableName = 'drives'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.string('filesystem').notNullable()
            table.dropColumn('size')
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('filesystem')
            table.bigInteger('size').notNullable()
        })
    }
}
