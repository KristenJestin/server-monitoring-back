import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DocumentTag extends BaseSchema {
    protected tableName = 'document_tag'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.uuid('document_id').references('documents.id')
            table.uuid('tag_id').references('tags.id')
            table.unique(['document_id', 'tag_id'])

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
