import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { productsRoutes } from './routes/products'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
})

app.register(fastifySwagger, {
  transform: jsonSchemaTransform,
  openapi: {
    info: {
      title: 'API E-commerce',
      description: 'API documentation for a e-commerce challenge.',
      version: '1.0.0',
    },
    tags: [{ name: 'products', description: 'products related oparations' }],
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  staticCSP: true,
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
})

app.register(productsRoutes, {
  prefix: 'products',
})
