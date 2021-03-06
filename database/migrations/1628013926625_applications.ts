import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Applications extends BaseSchema {
    protected tableName = 'applications'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').index().primary()

            table.string('name').notNullable()
            table.string('slug').notNullable()
            table.string('service').nullable()
            table.integer('port').unsigned().notNullable()
            table.string('url').nullable()
            table.string('image').notNullable()
            table.string('website').nullable()
            table.string('description', 2000).nullable()

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
