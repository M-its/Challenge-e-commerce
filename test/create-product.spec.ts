import { test, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Products Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('Should be able to create a new product', async () => {
    await request(app.server)
      .post('/products')
      .send({
        model: 'Canon EF 50mm f/1.8 STM',
        brand: 'Canon',
        type: 'Prime Lens',
        focalLength: '50mm',
        maxAperture: 'f/1.8',
        mount: 'EF',
        weight: 160,
        hasStabilization: false,
        active: true,
      })
      .expect(201)
  })

  test('Should be able to list all products', async () => {
    await request(app.server).get('/products').expect(200)
  })

  test('Should be able to list a specific product', async () => {
    await request(app.server)
      .post('/products')
      .send({
        model: 'Canon EF 50mm f/1.8 STM',
        brand: 'Canon',
        type: 'prime',
        focalLength: '50mm',
        maxAperture: 'f/1.8',
        mount: 'EF',
        weight: 160,
        hasStabilization: false,
        active: true,
      })
      .expect(201)

    const listProductsResponse = await request(app.server)
      .get('/products')
      .expect(200)

    const { products } = listProductsResponse.body.products
    const productId = products[0].id

    const getProductResponse = await request(app.server)
      .get(`/products/${productId}`)
      .expect(200)

    expect(getProductResponse.body.product).toEqual(
      expect.objectContaining({
        id: productId,
        model: 'Canon EF 50mm f/1.8 STM',
        brand: 'Canon',
        type: 'prime',
        focalLength: '50mm',
        maxAperture: 'f/1.8',
        mount: 'EF',
        weight: 160,
        hasStabilization: false,
        active: true,
      })
    )
  })

  test('User Should not be able to create a product with invalid data', async () => {
    const response = await request(app.server).post('/products').send({
      model: 'Canon EF 50mm f/1.8 STM',
      brand: 'Canon',
      type: 'Prime Lens',
      focalLength: '50mm',
      maxAperture: 'f/1.8',
      mount: 'EF',
      weight: 160,
      hasStabilization: false,
    })
    // .catch((err) => console.error(err.response?.body || err))
    expect(400)
  })
})
