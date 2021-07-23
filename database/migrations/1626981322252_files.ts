import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Files extends BaseSchema {
    protected tableName = 'files'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').index().primary()

            table.string('name').notNullable()
            table.string('ext').notNullable()
            table.string('path').notNullable()
            table.string('mime_type').notNullable()
            table.integer('size').unsigned().notNullable()

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