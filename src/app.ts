import fastify from 'fastify'
import { productsRoutes } from './routes/products'

export const app = fastify()

app.register(productsRoutes, {
  prefix: 'products',
})
