import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Tag from 'App/Models/Tag'

export default class TagSeeder extends BaseSeeder {
    public async run() {
        await Tag.createMany([
            {
                name: 'Work',
                color: '#fed330',
                textColor: '#000000',
            },
            {
                name: 'Entertainment',
                color: '#a65eea',
                textColor: '#ffffff',
            },
            {
                name: 'Home',
                color: '#26de81',
                textColor: '#ffffff',
            },
        ])
    }
}
