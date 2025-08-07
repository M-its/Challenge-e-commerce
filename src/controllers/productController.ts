import * as service from '../services/productService'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export const requiredString = (fieldName: string) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? `The field ${fieldName} is required`
          : `${fieldName} must be a string`,
    })
    .min(1, { error: `This field ${fieldName} cannot be empty.` })

export const requiredNumber = (fieldName: string) =>
  z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? `The field ${fieldName} is required`
          : `${fieldName} must be a number`,
    })
    .int()
    .min(1, { error: `The field ${fieldName} must be at least 1.` })

export const requiredSelectType = (fieldName: string) =>
  z.string().refine((val) => val !== '', {
    message: 'Please select a valid lens type.',
  })

export const requiredBoolean = (fieldName: string) => {
  return z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? `The field ${fieldName} is required`
        : `${fieldName} must be a boolean`,
  })
}

export const createProductBodySchema = z
  .object({
    model: requiredString('model'),
    brand: requiredString('brand'),
    type: requiredSelectType('type'),
    focalLength: requiredString('focalLength'),
    maxAperture: requiredString('maxAperture'),
    mount: requiredString('mount'),
    weight: requiredNumber('weight'),
    hasStabilization: requiredBoolean('hasStabilization'),
    active: requiredBoolean('active'),
  })
  .strict()

export const updateProductBodySchema = z.object({
  model: requiredString('model').optional(),
  brand: requiredString('brand').optional(),
  type: requiredString('type').optional(),
  focalLength: requiredString('focalLength').optional(),
  maxAperture: requiredString('maxAperture').optional(),
  mount: requiredString('maxAperture').optional(),
  weight: requiredNumber('weight').optional(),
  hasStabilization: requiredBoolean('hasStabilization').optional(),
  active: requiredBoolean('active').optional(),
})

export const productIdParamSchema = z.object({
  id: z.uuid(),
})

export const productQuerySchema = z.object({
  model: z.string().optional(),
  brand: z.string().optional(),
})

const paginationQuerySchema = z.object({
  page: z.string().optional().transform(Number).default(1),
  limit: z.string().optional().transform(Number).default(9),
})

export async function listAll(request: FastifyRequest, reply: FastifyReply) {
  const { page, limit } = paginationQuerySchema.parse(request.query)

  const products = await service.getAllProducts(page, limit)
  return reply.send({ products })
}

export async function listActive(request: FastifyRequest, reply: FastifyReply) {
  const products = await service.getActiveProducts()
  return reply.send({ products })
}

export async function listInactive(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const products = await service.getInactiveProducts()
  return reply.send({ products })
}

export async function getByQuery(
  request: FastifyRequest<{ Querystring: { model?: string; brand?: string } }>,
  reply: FastifyReply
) {
  const query = productQuerySchema.parse(request.query)

  const products = await service.getProductsByQuery(query)

  if (products.length === 0) {
    return reply.status(404).send({ message: 'No products found' })
  }

  return reply.send({ products })
}

export async function getProductById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = productIdParamSchema.parse(request.params)
  const product = await service.getProductById(id)
  if (!product) return reply.status(404).send({ message: 'Product not found' })

  return { product }
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  let data
  try {
    data = createProductBodySchema.parse(request.body)
  } catch (err) {
    console.error('Erro de validação Zod:', err)
    return reply.status(400).send({ error: 'Dados inválidos', details: err })
  }
  await service.createProduct(data)
  return reply.status(201).send({ message: 'Product created successfully' })
}

export async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = productIdParamSchema.parse(request.params)
  const data = updateProductBodySchema.parse(request.body)
  const product = await service.getProductById(id)
  if (!product) return reply.status(404).send({ message: 'Product not found' })
  await service.updateProduct(id, data)
  const updatedProduct = await service.getProductById(id)
  return reply.status(200).send({ product: updatedProduct })
}

export async function toggleActive(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = productIdParamSchema.parse(request.params)
  const product = await service.getProductById(id)

  if (!product) return reply.status(404).send({ message: 'Product not found' })

  await service.toggleProductActive(id, !product.active)

  const updatedProduct = await service.getProductById(id)
  return reply.status(200).send({ product: updatedProduct })
}

export async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = productIdParamSchema.parse(request.params)
  const product = await service.getProductById(id)
  if (!product) return reply.status(404).send({ message: 'Product not found' })
  await service.deleteProduct(id)
  return reply.status(204).send()
}
