
const request = require('supertest');
require('dotenv').config(); 

const baseUrl = process.env.BASE_URL;

describe('Tests for API Login', () => {
  it('should able to login  with valid crentials and return a token', async () => {
    console.log('Using user:', process.env.USERNAME);

    const response = await request(baseUrl)
      .post('/auth/login')
      .send({
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      });


    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  test('Should not able to login with invalid credentials', async () => {
        const response = await request(process.env.BASE_URL)
          .post('/auth/login')
          .send({
            username: 'invalidUser',
            password: 'wrongPassword',
          });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid credentials');
      });
    });
