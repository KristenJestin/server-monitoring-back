// imports
import { getDiskInfoSync, getDiskInfo } from 'node-disk-info'

// main
const getFilesystems = async () => {
    const isWin = process.platform === 'win32'
    let disks = await getDiskInfo()

    if (!isWin) disks = disks.filter((d) => d.filesystem.startsWith('/dev/'))

    return disks.map((d) => d.filesystem)
}

const getFilesystemsSync = () => {
    const isWin = process.platform === 'win32'
    let disks = getDiskInfoSync()

    if (!isWin) disks = disks.filter((d) => d.filesystem.startsWith('/dev/'))

    return disks.map((d) => d.filesystem)
}

// exports
export { getFilesystemsSync, getFilesystems }
