const fs = require('fs');
const path = require('path');
const request = require('supertest');
const {
  it,
  expect,
  beforeEach,
  beforeAll,
  describe,
} = require('@jest/globals');
const app = require('../app');

let token;
let imageBuffer;
beforeAll(async () => {
  const user = { email: 'admin2@gmail.com', password: 'admin1234' };
  const login = await request(app).post('/api/v1/auth/login').send(user);
  const filePath = path.join(__dirname, '../public/img/persia.jpg');
  imageBuffer = fs.readFileSync(filePath);
  token = login.body.data.token;
});

describe('API create category', () => {
  it('should return 201 Category created successfully', async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('should return 400 Name is required', async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 Image is required', async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe('API update category', () => {
  let id;
  beforeEach(async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    id = response.body.data.newCat.id;
  }, 10000);

  it('should return 200 Category updated successfully', async () => {
    const response = await request(app)
      .patch(`/api/v1/category/${id}`)
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 400 Name is required', async () => {
    const response = await request(app)
      .patch(`/api/v1/category/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 404 Category not found!', async () => {
    const response = await request(app)
      .patch('/api/v1/category/1000')
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API delete category', () => {
  let id;
  beforeEach(async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    id = response.body.data.newCat.id;
  }, 10000);

  it('should return 200 Category deleted successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/category/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Category not found!', async () => {
    const response = await request(app)
      .delete('/api/v1/category/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API get category by id', () => {
  let id;
  beforeEach(async () => {
    const response = await request(app)
      .post('/api/v1/category')
      .field('name', `category ${new Date().getTime()}`)
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    id = response.body.data.newCat.id;
  }, 10000);

  it('should return 200 Category found', async () => {
    const response = await request(app)
      .get(`/api/v1/category/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Category not found!', async () => {
    const response = await request(app)
      .get('/api/v1/category/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API get all category', () => {
  it('should return 200 All categories fetched successfully', async () => {
    const response = await request(app)
      .get('/api/v1/category')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);
});
