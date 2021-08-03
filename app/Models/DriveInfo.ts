import Drive from 'App/Models/Drive'
import Disk from 'node-disk-info/dist/classes/drive'

export default class DriveInfo {
    public id?: string
    public name?: string
    public slug?: string

    public filesystem: string
    public blocks: number
    public used: number
    public available: number
    public capacity: string
    public mounted: string

    constructor(disk: Disk, drive: Drive | undefined = undefined) {
        this.id = drive?.id
        this.name = drive?.name
        this.slug = drive?.slug

        this.filesystem = disk.filesystem
        this.blocks = disk.blocks
        this.used = disk.used
        this.available = disk.available
        this.capacity = disk.capacity
        this.mounted = disk.mounted
    }
}
