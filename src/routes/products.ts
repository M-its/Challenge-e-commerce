import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import id from 'zod/v4/locales/id.cjs'

export async function productsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const products = await knex('products').select('*')

    return { products }
  })

  app.get('/active', async () => {
    const products = await knex('products').where({ active: true })

    return { products }
  })

  app.get('/inative', async () => {
    const products = await knex('products').where({ active: false })

    return { products }
  })

  app.get('/:id', async (request) => {
    const getProductParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getProductParamsSchema.parse(request.params)

    const product = await knex('products').where({ id }).first()

    return { product }
  })

  app.post('/', async (request, reply) => {
    const createProductBodySchema = z.object({
      model: z.string(),
      brand: z.string(),
      type: z.string(),
      focalLength: z.string(),
      maxAperture: z.string(),
      mount: z.string(),
      weight: z.number().int(),
      hasStabilization: z.boolean(),
      active: z.boolean(),
    })

    const {
      model,
      brand,
      type,
      focalLength,
      maxAperture,
      mount,
      weight,
      hasStabilization,
      active,
    } = createProductBodySchema.parse(request.body)

    await knex('products').insert({
      id: randomUUID(),
      model,
      brand,
      type,
      focalLength,
      maxAperture,
      mount,
      weight,
      hasStabilization,
      active,
    })

    return reply.status(201).send({
      message: 'Product created successfully',
    })
  })
}
