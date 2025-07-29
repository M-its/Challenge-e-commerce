import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function getAllProducts() {
  return knex('products').select('*')
}

export async function getActiveProducts() {
  return knex('products').where({ active: true })
}

export async function getInactiveProducts() {
  return knex('products').where({ active: false })
}

export async function getProductById(id: string) {
  return knex('products').where({ id }).first()
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
