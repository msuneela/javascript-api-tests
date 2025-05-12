// tests/transactions.test.js
const request = require('supertest');
const { getAuthToken } = require('../support/authHelper');
require('dotenv').config();


let token;
let productId;

beforeAll(async () => {
  token = await getAuthToken();

  const productResponse = await request(process.env.BASE_URL)
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Transaction Test Product',
      quantity: 50,
      price: 19.99,
    });

  productId = productResponse.body.productId;
});

afterAll(async () => {
  await request(process.env.BASE_URL)
    .delete(`/products/${productId}`)
    .set('Authorization', `Bearer ${token}`);
});


  describe('Tests for api db status end point',() => {

  test('verify dbstatus call ', async () => {
    const response = await request(process.env.BASE_URL)
      .get('/status')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.dbStatus).toBe('Connected'); 
  });
});

