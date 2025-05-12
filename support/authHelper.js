
const request = require('supertest');
require('dotenv').config();

const baseUrl = process.env.BASE_URL;

async function getAuthToken() {
  const res = await request(baseUrl)
    .post('/auth/login')
    .send({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    });

  if (res.status !== 200) {
    throw new Error(`Auth failed: ${res.status} - ${JSON.stringify(res.body)}`);
  }

  return res.body.token; 
}

module.exports = { getAuthToken };
