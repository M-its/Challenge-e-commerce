import { FastifyInstance } from 'fastify'
import * as controller from '../controllers/productController'
import {
  createProductBodySchema,
  productIdParamSchema,
  productQuerySchema,
  productSchema,
  updateProductBodySchema,
} from '../controllers/productController'
import { z } from 'zod'

export async function productsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      schema: {
        summary: 'List all products',
        tags: ['products'],
        querystring: z.object({
          page: z.string().optional().default('1').transform(Number),
          limit: z.string().optional().default('9').transform(Number),
        }),
        response: {
          200: z.object({
            products: z.object({
              products: z.array(productSchema),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
            }),
          }),
        },
      },
    },
    controller.listAll
  )
  app.get(
    '/active',
    {
      schema: {
        summary: 'List all active products',
        tags: ['products'],
        querystring: z.object({
          page: z.string().optional().default('1').transform(Number),
          limit: z.string().optional().default('9').transform(Number),
        }),
        response: {
          200: z.object({
            products: z.object({
              products: z.array(productSchema),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
            }),
          }),
        },
      },
    },
    controller.listActive
  )
  app.get(
    '/inactive',
    {
      schema: {
        summary: 'List all inactive products',
        tags: ['products'],
        querystring: z.object({
          page: z.string().optional().default('1').transform(Number),
          limit: z.string().optional().default('9').transform(Number),
        }),
        response: {
          200: z.object({
            products: z.object({
              products: z.array(productSchema),
              total: z.number(),
              page: z.number(),
              limit: z.number(),
            }),
          }),
        },
      },
    },
    controller.listInactive
  )
  app.get(
    '/search',
    {
      schema: {
        summary: 'Search product by model or brand',
        tags: ['products'],
        querystring: productQuerySchema,
        response: {
          200: z.object({
            products: z.array(productSchema),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getByQuery
  )
  app.get(
    '/:id',
    {
      schema: {
        summary: 'Search product by ID',
        tags: ['products'],
        params: productIdParamSchema,
        response: {
          200: z.object({ product: productSchema }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getProductById
  )
  app.post(
    '/',
    {
      schema: {
        summary: 'Create a new product',
        tags: ['products'],
        body: createProductBodySchema,
        response: {
          201: z.object({ message: z.string() }),
          409: z.object({ err: z.string() }),
        },
      },
    },
    controller.create
  )
  app.put(
    '/:id',
    {
      schema: {
        summary: 'Update an existing product',
        tags: ['products'],
        params: productIdParamSchema,
        body: updateProductBodySchema,
        response: {
          200: z.object({ product: productSchema }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.update
  )
  app.patch(
    '/:id',
    {
      schema: {
        summary: 'Toggle a product active status',
        tags: ['products'],
        params: productIdParamSchema,
        response: {
          200: z.object({ product: productSchema }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.toggleActive
  )
  app.delete(
    '/:id',
    {
      schema: {
        summary: 'Remove a product',
        tags: ['products'],
        params: productIdParamSchema,
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.remove
  )
}
