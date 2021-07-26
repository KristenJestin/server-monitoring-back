import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Folders extends BaseSchema {
    protected tableName = 'folders'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').index().primary()
            table.string('name').notNullable()
            table.string('slug').notNullable()
            table.string('color').nullable()

            table.uuid('parent_id').references('id')

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
