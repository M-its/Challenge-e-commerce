import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function productsRoutes(app: FastifyInstance) {
  // Read prducts
  app.get('/', async () => {
    const products = await knex('products').select('*')

    return { products }
  })

  app.get('/active', async () => {
    const products = await knex('products').where({ active: true })

    return { products }
  })

  app.get('/inactive', async () => {
    const products = await knex('products').where({ active: false })

    return { products }
  })

  app.get('/:id', async (request, reply) => {
    const getProductParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = getProductParamsSchema.parse(request.params)

    const product = await knex('products').where({ id }).first()

    if (!product) {
      return reply.status(404).send({ message: 'Product not found' })
    }

    return { product }
  })

  // Create products
  app.post('/', async (request, reply) => {
    const requiredString = (fieldName: string) =>
      z
        .string({
          error: (issue) =>
            issue.input === undefined
              ? `The field ${fieldName} is required`
              : `${fieldName} must be a string`,
        })
        .min(1, { error: `This field ${fieldName} cannot be empty.` })

    const createProductBodySchema = z
      .object({
        model: requiredString('model'),
        brand: requiredString('brand'),
        type: requiredString('type'),
        focalLength: requiredString('focalLength'),
        maxAperture: requiredString('maxAperture'),
        mount: requiredString('mount'),
        weight: z.number().int(),
        hasStabilization: z.boolean(),
        active: z.boolean(),
      })
      .strict()

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

  // Update products

  // Revome products from the view
  app.patch('/:id', async (request, reply) => {
    const updateProductParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = updateProductParamsSchema.parse(request.params)

    const product = await knex('products').where({ id }).first()

    if (!product) {
      return reply.status(404).send({ message: 'Product not found' })
    }

    await knex('products').where({ id }).update({
      active: !product.active,
    })

    return reply.status(204).send('Product created successfully')
  })

  // Delete products
  app.delete('/:id', async (request, reply) => {
    const deleteProductParamsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = deleteProductParamsSchema.parse(request.params)

    const product = await knex('products').where({ id }).first()

    if (!product) {
      return reply.status(404).send({ message: 'Product not found' })
    }

    await knex('products').where({ id }).delete()

    return reply.status(204).send()
  })
}
