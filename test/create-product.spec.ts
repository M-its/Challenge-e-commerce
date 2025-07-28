import { test } from 'vitest'

test('User can create a new product', async ({ request, expect }) => {
  const response = await request.post('/hello', {
    data: {
      model: 'Nikon NIKKOR Z 24-70mm f/2.8 S',
      brand: 'Nikon',
      type: 'Zoom',
      focalLength: '24-70mm',
      maxAperture: 'f/2.8',
      mount: 'Nikon Z Mount',
      weight: 805,
      hasStabilization: true,
      active: true,
    },
  })
})
