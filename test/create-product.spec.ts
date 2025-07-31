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
    expect(400)
  })

  test('Should be able to list active products', async () => {
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

    const response = await request(app.server)
      .get('/products/active')
      .expect(200)
    expect(response.body.products)
  })

  test('Should be able to list inactive products', async () => {
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
        active: false,
      })
      .expect(201)

    const response = await request(app.server)
      .get('/products/inactive')
      .expect(200)
    expect(response.body.products)
  })

  test('Should be able to update a product', async () => {
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

    const listProductsResponse = await request(app.server)
      .get('/products')
      .expect(200)

    const { products } = listProductsResponse.body.products
    const product = products[0]

    const updatedProductResponse = await request(app.server)
      .put(`/products/${product.id}`)
      .send({
        type: 'Prime',
      })
      .expect(200)

    expect(updatedProductResponse.body.product.type).toBe('Prime')
  })

  test('Should be able to change the active status of a product', async () => {
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

    const listProductsResponse = await request(app.server)
      .get('/products')
      .expect(200)

    const { products } = listProductsResponse.body.products
    const product = products[0]

    const newStatus = !product.active

    const updateResponse = await request(app.server)
      .patch(`/products/${product.id}`)
      .send({
        active: newStatus,
      })
      .expect(200)

    expect(updateResponse.body.product.active).toBe(newStatus)
  })

  test('Shuld be able to remove a product', async () => {
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

    const listProductsResponse = await request(app.server)
      .get('/products')
      .expect(200)

    const { products } = listProductsResponse.body.products
    const productId = products[0].id

    await request(app.server).delete(`/products/${productId}`).expect(204)

    await request(app.server).get(`/products/${productId}`).expect(404)
  })
})
