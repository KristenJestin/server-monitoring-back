// imports
import { BaseModel, LucidRow, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon' // Optional null check query

// main
const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
    query.whereNull('deleted_at')
}

const softDelete = async (row: LucidRow, column: string = 'deletedAt') => {
    const attributes = row.$attributes
    if (column in attributes) {
        attributes[column] = DateTime.local()
        await row.save()
    }
}

// exports
export { softDeleteQuery, softDelete }
