import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import DeviceModel from 'App/Models/DeviceModel'

export default class DeviceModelSeeder extends BaseSeeder {
    public async run() {
        await DeviceModel.createMany([
            { name: 'Desktop Computer', icon: 'DesktopComputer' },
            { name: 'Laptop Computer', icon: 'DesktopComputer' },
            { name: 'Server', icon: 'Server' },
            { name: 'Mobile', icon: 'DeviceMobile' },
            { name: 'Tablet', icon: 'DeviceTablet' },
        ])
    }
}
