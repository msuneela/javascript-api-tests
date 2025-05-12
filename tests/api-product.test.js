const request = require('supertest');
const { getAuthToken } = require('../support/authHelper');
require('dotenv').config();
jest.setTimeout(15000);
let token;
let productId;

beforeAll(async () => {
  token = await getAuthToken();
});

describe('Tests for Products Endpoints', () => {
  test('Verify can Create a new product successfully', async () => {
    console.log(token);
    const response = await request(process.env.BASE_URL)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product automation',
        quantity: 100,
        price: 9.99,
      });
    console.log('Status:', response.statusCode);
    console.log('Body:', response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('productId');
    productId = response.body.productId;
  });



  test('Verify Get call to Fetch all products and validate just created productid', async () => {
    const response = await request(process.env.BASE_URL)
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    const productIds = response.body.map(product => product.productId);
  expect(productIds).toContain(productId);
  });
  test('Verify Get product details with productid', async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Test Product automation');
    expect(response.body.productId).toBe(productId);
  });

  test('Verify Can see error message when attempt to create product with 0 price', async () => {

    const response = await request(process.env.BASE_URL)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product automation1',
        quantity: 100,
        price: 0,
      });


    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Price must be greater than 0');
  });

  test('Verify Update a product', async () => {
    const response = await request(process.env.BASE_URL)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Product',
        quantity: 150,
        price: 14.99,
      });
    console.log(response.body)
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Product');
  });

  test('Verify can see error for invalid productId when attempt Update a product', async () => {
    const response = await request(process.env.BASE_URL)
      .put('/products/khjkrt08c-hjf')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Product',
        quantity: 150,
        price: 14.99,
      });
    console.log(response.body)
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Product not found');
  });

  test('Verify Delete a product with product id', async () => {
    const response = await request(process.env.BASE_URL)
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test('Verify Delete a product with invalid product id throws error', async () => {
    const response = await request(process.env.BASE_URL)
      .delete('/products/khjkrt08c-hjf')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Product not found');
  });


});
