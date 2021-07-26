import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Documents extends BaseSchema {
    protected tableName = 'documents'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.uuid('folder_id').references('id').inTable('folders').nullable()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('folder_id')
        })
    }
}
