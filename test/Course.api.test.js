const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { it, expect, beforeAll, describe } = require('@jest/globals');
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

describe('API create course', () => {
  it('should return 201 Course created successfully', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', 'test test')
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'test123')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('should return 400 All value fields are required', async () => {
    const data = { name: 'huhuhuhu' };
    const response = await request(app)
      .post('/api/v1/course')
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 Class code must be at least 5 characters', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', 'test test')
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'tes')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 Course name already exist', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', 'Demo Course')
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'tes')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 Image is required', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', 'Demo Courseasd')
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'tessss123')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe('API update course', () => {
  let courseId;
  beforeAll(async () => {
    const createCourseResponse = await request(app)
      .post('/api/v1/course')
      .field('name', `test_${new Date().getTime()}`)
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'test123')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    courseId = createCourseResponse.body.data.newCourse.id;
  }, 10000);

  it('should return 200 Course updated successfully', async () => {
    const response = await request(app)
      .patch(`/api/v1/course/${courseId}`)
      .field('name', 'testing testsung')
      .attach('image', imageBuffer, 'persia.jpg')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Course not found', async () => {
    const response = await request(app)
      .patch('/api/v1/course/1000')
      .field('name', 'testing tests')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API delete course', () => {
  let courseId;
  beforeAll(async () => {
    const createCourseResponse = await request(app)
      .post('/api/v1/course')
      .field('name', `test_${new Date().getTime()}`)
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'test123')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    courseId = createCourseResponse.body.data.newCourse.id;
  }, 10000);

  it('should return 200 Course deleted', async () => {
    const response = await request(app)
      .delete(`/api/v1/course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Course not found', async () => {
    const response = await request(app)
      .delete('/api/v1/course/999')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API get all course', () => {
  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course');
    expect(response.statusCode).toBe(200);
  }, 10000);
});

describe('API get course by id', () => {
  let courseId;
  beforeAll(async () => {
    const createCourseResponse = await request(app)
      .post('/api/v1/course')
      .field('name', `test_${new Date().getTime()}`)
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'test123')
      .field('totalModule', 1)
      .field('type', 'Online')
      .field('price', 100000)
      .field('totalDuration', 1)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    courseId = createCourseResponse.body.data.newCourse.id;
  }, 10000);

  it('should return 200 Course found!', async () => {
    const response = await request(app).get(`/api/v1/course/${courseId}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Course not found', async () => {
    const response = await request(app).get('/api/v1/course/999');
    expect(response.statusCode).toBe(404);
  }, 10000);
});
