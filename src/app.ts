import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { productsRoutes } from './routes/products'

export const app = fastify()

app.register(productsRoutes, {
  prefix: 'products',
})

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
})
