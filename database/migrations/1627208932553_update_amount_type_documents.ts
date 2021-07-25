import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Documents extends BaseSchema {
    protected tableName = 'documents'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.decimal('amount', 14, 2).nullable().alter()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.integer('amount').nullable().alter()
        })
    }
}
