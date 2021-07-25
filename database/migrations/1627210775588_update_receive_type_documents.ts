import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Documents extends BaseSchema {
    protected tableName = 'documents'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.date('received_at').nullable().alter()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.timestamp('received_at', { useTz: true }).nullable().alter()
        })
    }
}
