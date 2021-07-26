// imports
import Folder from 'App/Models/Folder'

// main
class FolderRepository {
    public async getOnlyAvailableParents(id: string) {
        return await Folder.query().whereNotIn('id', (query) => {
            query
                .withRecursive('tree', (subquery) => {
                    subquery
                        .select('id')
                        .from('folders')
                        .where('id', id)
                        .unionAll((recursivequery) => {
                            recursivequery
                                .from('folders')
                                .select('folders.id')
                                .join('tree', 'tree.id', 'folders.parent_id')
                        })
                })
                .select('id')
                .from('tree')
        })
    }
}

// exports
export default new FolderRepository()
