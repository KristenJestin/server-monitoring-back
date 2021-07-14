import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import State from 'App/Models/State'

export default class StateSeeder extends BaseSeeder {
    public async run() {
        await State.createMany([
            {
                name: 'New',
                color: '#778ca3',
                borderColor: '#4b6584',
                textColor: '#000000',
            },
            {
                name: 'In Progress',
                color: '#a65eea',
                borderColor: '#8854d0',
                textColor: '#ffffff',
            },
            {
                name: 'Idea',
                color: '#fed330',
                borderColor: '#f7b731',
                textColor: '#000000',
            },
            {
                name: 'Online',
                color: '#26de81',
                borderColor: '#20bf6b',
                textColor: '#000000',
            },
            {
                name: 'Export or Upload',
                color: '#2bcbba',
                borderColor: '#10b9b1',
                textColor: '#ffffff',
            },
            {
                name: 'Canceled',
                color: '#fc5c65',
                borderColor: '#eb3b5a',
                textColor: '#ffffff',
            },
        ])
    }
}
