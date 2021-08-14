import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DeviceDrives extends BaseSchema {
    protected tableName = 'device_drives'

    public async up() {
        this.schema.table(this.tableName, (table) => {
            table.string('group').index().notNullable()
        })
    }

    public async down() {
        this.schema.table(this.tableName, (table) => {
            table.dropColumn('group')
        })
    }
}
