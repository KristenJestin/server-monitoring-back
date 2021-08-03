// imports
import { getDiskInfoSync, getDiskInfo } from 'node-disk-info'

import Drive from 'App/Models/Drive'
import DriveInfo from 'App/Models/DriveInfo'

// main
const getDisks = async () => {
    const isWin = process.platform === 'win32'

    let disks = await getDiskInfo()
    if (!isWin) disks = disks.filter((d) => d.filesystem.startsWith('/dev/'))

    return disks
}

const getMounteds = async () => {
    const isWin = process.platform === 'win32'
    let disks = await getDiskInfo()

    if (!isWin) disks = disks.filter((d) => d.filesystem.startsWith('/dev/'))

    return disks.map((d) => d.mounted)
}

const getMountedsSync = () => {
    const isWin = process.platform === 'win32'
    let disks = getDiskInfoSync()

    if (!isWin) disks = disks.filter((d) => d.filesystem.startsWith('/dev/'))

    return disks.map((d) => d.mounted)
}

const getDriveInfoOrFail = async (drive: Drive): Promise<DriveInfo> => {
    const disks = await getDisks()
    const disk = disks.find((d) => d.mounted === drive.mounted)

    if (!disk) throw new Error(`DriveInfo : the drive '${drive.mounted}' doesn't not exists.`)

    return new DriveInfo(disk, drive)
}

const getDrivesInfo = async (drives: Drive[]): Promise<DriveInfo[]> => {
    const disks = await getDisks()
    return disks.map((disk) => {
        const drive = drives.find((drive) => drive.mounted === disk.mounted)
        if (drive) drives = drives.filter((d) => d.mounted !== disk.mounted)

        return new DriveInfo(disk, drive)
    })
}

// exports
export { getMounteds, getMountedsSync, getDrivesInfo, getDriveInfoOrFail }
