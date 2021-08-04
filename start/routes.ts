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
Route.where('id', /^[a-z0-9_-]+$/)

// routes
Route.any('', 'HomeController.index').as('home')

Route.resource('drives', 'DrivesController')

Route.resource('applications', 'ApplicationsController')
Route.get('applications/:id/image/:type', 'ApplicationsController.image')
    .where('type', /^[a-z]+$/)
    .as('applications.image')
