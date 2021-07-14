import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class States extends BaseSchema {
    protected tableName = 'states'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name').notNullable()
            table.string('color').notNullable()
            table.string('border_color').notNullable()
            table.string('text_color').notNullable()
            table.string('slug').notNullable()

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
