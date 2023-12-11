const request = require('supertest');
const {
  it, expect, beforeAll, describe,
} = require('@jest/globals');
const app = require('../app');

let token;

beforeAll(async () => {
  const user = { email: 'admin2@gmail.com', password: 'admin1234' };
  const login = await request(app).post('/api/v1/auth/login').send(user);
  token = login.body.data.token;
});

describe('API create notification', () => {
  it('should return 201 Notification created successfully', async () => {
    const data = {
      category: 'Notifikasi',
      title: `title ${new Date().getTime()}`,
      description: `description ${new Date().getTime()}`,
    };
    const response = await request(app)
      .post('/api/v1/notification')
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('should return 400 All value fields are require', async () => {
    const response = await request(app)
      .post('/api/v1/notification')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe('API get all notification', () => {
  it('should return 200 All notification fetched successfully', async () => {
    const response = await request(app)
      .get('/api/v1/notification')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);
});

describe('API get notification by id', () => {
  let id;
  beforeAll(async () => {
    const data = {
      category: 'Notifikasi',
      title: `title ${new Date().getTime()}`,
      description: `description ${new Date().getTime()}`,
    };
    const response = await request(app)
      .post('/api/v1/notification')
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    id = response.body.data.newNotif.id;
  }, 10000);

  it('should return 200 Notification fetched successfully', async () => {
    const response = await request(app)
      .get(`/api/v1/notification/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Notification not found', async () => {
    const response = await request(app)
      .get('/api/v1/notification/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API update notification', () => {
  let id;
  beforeAll(async () => {
    const data = {
      category: 'Notifikasi',
      title: `title ${new Date().getTime()}`,
      description: `description ${new Date().getTime()}`,
    };
    const response = await request(app)
      .post('/api/v1/notification')
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    id = response.body.data.newNotif.id;
  }, 10000);

  it('should return 200 Notification updated successfully', async () => {
    const data = {
      category: 'Notifikasi',
      title: `Update title ${new Date().getTime()}`,
      description: `Update description ${new Date().getTime()}`,
    };
    const response = await request(app)
      .patch(`/api/v1/notification/${id}`)
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Notification not found', async () => {
    const data = {
      category: 'Notifikasi',
      title: `Update title ${new Date().getTime()}`,
      description: `Update description ${new Date().getTime()}`,
    };
    const response = await request(app)
      .patch('/api/v1/notification/1000')
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API delete notification', () => {
  let id;
  beforeAll(async () => {
    const data = {
      category: 'Notifikasi',
      title: `Update title ${new Date().getTime()}`,
      description: `Update description ${new Date().getTime()}`,
    };
    const response = await request(app)
      .post('/api/v1/notification')
      .send(data)
      .set('Authorization', `Bearer ${token}`);
    id = response.body.data.newNotif.id;
  }, 10000);

  it('should return 200 Notification deleted successfully', async () => {
    const response = await request(app)
      .delete(`/api/v1/notification/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 404 Notification not found', async () => {
    const response = await request(app)
      .delete('/api/v1/notification/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});
