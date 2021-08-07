/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of documents, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { STATUS } from 'App/Models/Device'

Route.where('id', /^[a-z0-9_-]+$/)

//#region routes
// home
Route.any('', 'HomeController.index').as('home')

// drives
Route.resource('drives', 'DrivesController')

// applications
Route.resource('applications', 'ApplicationsController')
Route.get('applications/:id/image/:type', 'ApplicationsController.image')
    .where('type', /^[a-z]+$/)
    .as('applications.image')
Route.get('applications/:id/status', 'ApplicationsController.status').as('applications.status')

// device models
Route.resource('devices/models', 'DeviceModelsController').except(['show'])

// devices
Route.resource('devices', 'DevicesController')
//#endregion

//#region api
Route.group(() =>
    Route.group(() => {
        Route.post('alive', 'DevicesApiController.alive')
        Route.post('status/:status', 'DevicesApiController.status').where(
            'status',
            new RegExp(`^(${Object.values(STATUS).join('|')})$`)
        )
    }).prefix('devices')
)
    .prefix('api')
    .namespace('App/Controllers/Http/Api')
//#endregion
