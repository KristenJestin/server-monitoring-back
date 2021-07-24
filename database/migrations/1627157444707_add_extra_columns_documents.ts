import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Documents extends BaseSchema {
    protected tableName = 'documents'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.timestamp('received_at', { useTz: true }).nullable()
            table.integer('amount').nullable()
            table.integer('duration').unsigned().nullable()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('received_at')
            table.dropColumn('amount')
            table.dropColumn('duration')
        })
    }
}
