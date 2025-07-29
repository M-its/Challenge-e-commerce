import { FastifyInstance } from 'fastify'
import * as controller from '../controllers/productController'

export async function productsRoutes(app: FastifyInstance) {
  app.get('/', controller.listAll)
  app.get('/active', controller.listActive)
  app.get('/inactive', controller.listInactive)
  app.get('/:id', controller.getById)
  app.post('/', controller.create)
  app.put('/:id', controller.update)
  app.patch('/:id', controller.toggleActive)
  app.delete('/:id', controller.remove)
}
