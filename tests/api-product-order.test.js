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

describe('Tests for Product orders endpoints', () => {
  test('Verify Order products for buy with product id', async () => {
    const response = await request(process.env.BASE_URL)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderType: 'buy',
        productId: productId,
        quantity: 4
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.quantity).toBe(4); 
  });
  test('Verify Order products for sell with product id', async () => {
    const response = await request(process.env.BASE_URL)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderType: 'sell',
        productId: productId,
        quantity: 2
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.quantity).toBe(2); 
  });

  test('Verify orders endpoint throws error for invalid orderType', async () => {
    const response = await request(process.env.BASE_URL)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        orderType: 'keep',
        productId: productId,
        quantity: 4
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid order type. Must be \"buy\" or \"sell\""); 
  });


  test('Get orders of productid', async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/orders/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.totalBuys).toBe(4);
  });
  test('Verify invalid product id throws error as no orders found', async () => {
    const response = await request(process.env.BASE_URL)
      .get(`/orders/product/kjhfsakfhksa`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No orders found for this product');
  });
});

  