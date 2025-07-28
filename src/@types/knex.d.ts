import { knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    products: {
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
  }
}
