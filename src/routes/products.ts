import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function productsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const products = await knex('products').select('*')

    return products
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
