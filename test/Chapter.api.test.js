const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { it, expect, beforeAll, describe } = require('@jest/globals');
const app = require('../app');

let token;
let courseId;
let imageBuffer;

beforeAll(async () => {
  const user = { email: 'admin2@gmail.com', password: 'admin1234' };
  const login = await request(app).post('/api/v1/auth/login').send(user);
  token = login.body.data.token;
  const filePath = path.join(__dirname, '../public/img/persia.jpg');
  imageBuffer = fs.readFileSync(filePath);
  const createCourse = await request(app)
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
  courseId = createCourse.body.data.newCourse.id;
}, 15000);

describe('API create chapter', () => {
  it('should return 201 Chapter created successfully', async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId,
    };
    const response = await request(app)
      .post('/api/v1/chapter')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('should return 400 All value fields are required', async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
    };
    const response = await request(app)
      .post('/api/v1/chapter')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 404 Course ID not found!', async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId: 1000,
    };
    const response = await request(app)
      .post('/api/v1/chapter')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API update chapter', () => {
  let chapterId;
  beforeAll(async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId,
    };
    const createChapter = await request(app)
      .post('/api/v1/chapter')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    chapterId = createChapter.body.data.newChapter.id;
  }, 10000);

  it('should return 400 All value fields are required', async () => {
    const response = await request(app)
      .patch(`/api/v1/chapter/${chapterId}`)
      .send()
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 404 Chapter not found', async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId,
    };
    const response = await request(app)
      .patch('/api/v1/chapter/1000')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);

  it('should return 200 Chapter updated successfully', async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId,
    };
    const response = await request(app)
      .patch(`/api/v1/chapter/${chapterId}`)
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);
});

describe('API get chapter by id', () => {
  let chapterId;
  beforeAll(async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId,
    };
    const createChapter = await request(app)
      .post('/api/v1/chapter')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    chapterId = createChapter.body.data.newChapter.id;
  }, 10000);

  it('should return 200 Chapter found', async () => {
    const response = await request(app)
      .get(`/api/v1/chapter/${chapterId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Chapter not found', async () => {
    const response = await request(app)
      .get('/api/v1/chapter/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API get all chapter', () => {
  it('should return 200 All chapters fetched successfully', async () => {
    const response = await request(app)
      .get('/api/v1/chapter')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);
});

describe('API delete chapter', () => {
  let chapterId;
  beforeAll(async () => {
    const chapter = {
      noChapter: 1,
      name: 'Chapter 1',
      courseId,
    };
    const createChapter = await request(app)
      .post('/api/v1/chapter')
      .send(chapter)
      .set('Authorization', `Bearer ${token}`);
    chapterId = createChapter.body.data.newChapter.id;
  }, 10000);

  it('should return 200 Chapter deleted successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/chapter/${chapterId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Chapter not found', async () => {
    const response = await request(app)
      .delete('/api/v1/chapter/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});
