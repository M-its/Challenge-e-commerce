import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary()
    table.text('model').notNullable()
    table.text('brand').notNullable()
    table.text('type').notNullable()
    table.text('focalLength').notNullable()
    table.text('maxAperture').notNullable()
    table.text('mount').notNullable()
    table.integer('weight').notNullable()
    table.boolean('hasStabilization').notNullable()
    table.boolean('active').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products')
}
