import { knex } from '../database'
import { randomUUID } from 'node:crypto'

type Product = {
  id: string
  model: string
  brand: string
  type: string
  focalLength: string
  maxAperture: string
  mount: string
  weight: number
  hasStabilization: boolean
  active: boolean
}

function normalizeProduct(product: Product) {
  return {
    ...product,
    active: Boolean(product.active),
    hasStabilization: Boolean(product.hasStabilization),
  }
}

export async function getAllProducts(page = 1, limit = 10) {
  const offset = (page - 1) * limit

  const products = await knex('products')
    .select('*')
    .limit(limit)
    .offset(offset)

  const countResult = await knex('products').count<{ count: string }[]>(
    '* as count'
  )
  const total = Number(countResult[0]?.count ?? '0')

  return {
    products: products.map(normalizeProduct),
    total,
    page,
    limit,
  }
}

export async function getActiveProducts(page = 1, limit = 10) {
  const offset = (page - 1) * limit

  const products = await knex('products')
    .where({ active: true })
    .limit(limit)
    .offset(offset)

  const countResult = await knex('products').count<{ count: string }[]>(
    '* as count'
  )
  const total = Number(countResult[0]?.count ?? '0')

  return {
    products: products.map(normalizeProduct),
    total,
    page,
    limit,
  }
}

export async function getInactiveProducts(page = 1, limit = 10) {
  const offset = (page - 1) * limit

  const products = await knex('products')
    .where({ active: false })
    .limit(limit)
    .offset(offset)

  const countResult = await knex('products').count<{ count: string }[]>(
    '* as count'
  )
  const total = Number(countResult[0]?.count ?? '0')

  return {
    products: products.map(normalizeProduct),
    total,
    page,
    limit,
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await knex('products').where({ id }).first()
  return product ? normalizeProduct(product) : null
}

export async function getProductsByQuery({
  model,
  brand,
}: {
  model?: string
  brand?: string
}) {
  const query = knex('products')

  if (model) query.whereRaw('LOWER(model) LIKE ?', [`%${model.toLowerCase()}%`])
  if (brand) query.whereRaw('LOWER(brand) LIKE ?', [`%${brand.toLowerCase()}%`])

  return await query.select('*')
}

export async function createProduct(data: any) {
  await knex('products').insert({
    id: randomUUID(),
    ...data,
  })
}

export async function updateProduct(id: string, data: any) {
  await knex('products').where({ id }).update(data)
}

export async function toggleProductActive(id: string, active: boolean) {
  await knex('products').where({ id }).update({ active })
}

export async function deleteProduct(id: string) {
  await knex('products').where({ id }).delete()
}
