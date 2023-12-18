const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { it, expect, beforeAll, describe } = require('@jest/globals');
const app = require('../app');
const { Course } = require('../models');

let token;
let imageBuffer;
let imageBuffer2;

beforeAll(async () => {
  const user = { email: 'admin2@gmail.com', password: 'admin1234' };
  const login = await request(app).post('/api/v1/auth/login').send(user);
  const filePath = path.join(__dirname, '../public/img/persia.jpg');
  const filePath2 = path.join(__dirname, '../public/img/testImage.jpg');
  imageBuffer = fs.readFileSync(filePath);
  imageBuffer2 = fs.readFileSync(filePath2);
  token = login.body.data.token;
});

describe('API create course', () => {
  let nameCourse;
  it('should return 201 Course created successfully', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', `test_${new Date().getTime()}`)
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'test123')
      .field('type', 'Premium')
      .field('price', 100000)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    nameCourse = response.body.data.newCourse.name;
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('should return 400 File size exceeds the limit (5MB)', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', `test_${new Date().getTime()}`)
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'test123')
      .field('type', 'Premium')
      .field('price', 100000)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer2, 'testImage.jpg');
    expect(response.statusCode).toBe(400);
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
      .field('type', 'Premium')
      .field('price', 100000)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 Course name already exist', async () => {
    const response = await request(app)
      .post('/api/v1/course')
      .field('name', nameCourse)
      .field('level', 'Beginner')
      .field('categoryId', 1)
      .field('description', 'Test description')
      .field('benefits', 'Test benefits')
      .field('classCode', 'testing123456')
      .field('type', 'Premium')
      .field('price', 100000)
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
      .field('benefits', 'health,retirement,insurance')
      .field('classCode', 'tessss123')
      .field('type', 'Premium')
      .field('price', 100000)
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
      .field('type', 'Premium')
      .field('price', 100000)
      .field('courseBy', 'test')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', imageBuffer, 'persia.jpg');
    courseId = createCourseResponse.body.data.newCourse.id;
  }, 10000);

  it('should return 200 Course updated successfully', async () => {
    const response = await request(app)
      .patch(`/api/v1/course/${courseId}`)
      .field('benefits', 'health,retirement,insurance')
      .attach('image', imageBuffer, 'persia.jpg')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 400 File size exceeds the limit (5MB)', async () => {
    const response = await request(app)
      .patch(`/api/v1/course/${courseId}`)
      .attach('image', imageBuffer2, 'testImage.jpg')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

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
      .field('type', 'Premium')
      .field('price', 100000)
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

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get(
      '/api/v1/course?level=Intermediate'
    );
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course?type=Premium');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course?categoryName=UI');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course?createdAt=false');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course?createdAt=true');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course?promo=true');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 200 All courses fetched successfully', async () => {
    const response = await request(app).get('/api/v1/course?search=test');
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should call next with error when an error occurs', async () => {
    const mockedError = new Error('An example error');
    jest.spyOn(Course, 'findAll').mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app).get('/api/v1/course');
    expect(response.statusCode).toBe(500);
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
      .field('type', 'Premium')
      .field('price', 100000)
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
