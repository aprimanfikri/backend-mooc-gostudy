require('dotenv').config();
const request = require('supertest');
const { it, expect, describe } = require('@jest/globals');
const app = require('../app');

describe('should return 404', () => {
  it('should return 404', async () => {
    const res = await request(app).get('/api/v1/other');
    expect(res.statusCode).toEqual(404);
  });
});
