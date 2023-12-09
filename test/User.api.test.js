require('dotenv').config();
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const {
  it,
  expect,
  beforeAll,
  describe,
  beforeEach,
} = require('@jest/globals');
const app = require('../app');

describe('API Login', () => {
  it('should return 200 Your account has been logged in successfully', async () => {
    const user = {
      email: 'admin1@gmail.com',
      password: 'admin1234',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.statusCode).toBe(200);
  });
  it('should return 400 Email is required', async () => {
    const user = {
      password: 'admin1234',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.statusCode).toBe(400);
  });
  it('should return 400 Password is required', async () => {
    const user = {
      email: 'admin1@gmail.com',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.statusCode).toBe(400);
  });
  it('should return 400 Email does not exist', async () => {
    const user = {
      email: 'example@example.com',
      password: 'admin1234',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.statusCode).toBe(400);
  });
  it('should return 400 Email not verified', async () => {
    const user = {
      email: 'user2@gmail.com',
      password: 'admin1234',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.statusCode).toBe(400);
  });
  it('should return 400 Password is incorrect', async () => {
    const user = {
      email: 'admin1@gmail.com',
      password: 'admin123',
    };
    const response = await request(app).post('/api/v1/auth/login').send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe('API Register', () => {
  it('should return 200 Register successfully', async () => {
    const user = {
      name: 'admin',
      phoneNumber: '1234567890',
      email: `user${new Date().getTime()}@gmail.com`,
      password: 'test12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('should return 400 Name is required', async () => {
    const user = {
      phoneNumber: '1234567890',
      email: 'test10@gmail.com',
      password: 'test12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Name must be at least 3 characters', async () => {
    const user = {
      name: 'jo',
      phoneNumber: '1234567890',
      email: 'test10@gmail.com',
      password: 'test12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Email is required', async () => {
    const user = {
      name: 'Test',
      phoneNumber: '1234567890',
      password: 'test12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Password is required', async () => {
    const user = {
      name: 'Test',
      email: 'test10@gmail.com',
      phoneNumber: '1234567890',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Password must be at least 8 characters', async () => {
    const user = {
      name: 'Test',
      email: 'test10@gmail.com',
      phoneNumber: '1234567890',
      password: 'test',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Phone number is required', async () => {
    const user = {
      name: 'Test',
      email: 'test10@gmail.com',
      password: 'test123456',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Phone number must be at least 10 numbers', async () => {
    const user = {
      name: 'Test',
      email: 'test10@gmail.com',
      phoneNumber: '12345',
      password: 'test12345678',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Email already exists', async () => {
    const user = {
      name: 'Test',
      email: 'admin1@gmail.com',
      phoneNumber: '12345123123123213',
      password: 'test123456789',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe('API Verify', () => {
  let registerData;
  let loginData;
  beforeEach(async () => {
    const userRegister = {
      name: 'admin',
      phoneNumber: '1234567890',
      email: `user${new Date().getTime()}@gmail.com`,
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userRegister);
    registerData = response.body.data;

    const userLogin = {
      email: 'admin1@gmail.com',
      password: 'admin1234',
    };
    const login = await request(app).post('/api/v1/auth/login').send(userLogin);
    loginData = login.body.data;
  }, 10000);

  it('should return 200 Email verification successful', async () => {
    const otp = {
      otp: registerData.otp,
    };
    const response = await request(app)
      .post('/api/v1/auth/verify')
      .send(otp)
      .set('Authorization', `Bearer ${registerData.token}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it('should return 400 OTP is required', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify')
      .send()
      .set('Authorization', `Bearer ${registerData.token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 User is already verified', async () => {
    const response = await request(app)
      .post('/api/v1/auth/verify')
      .send()
      .set('Authorization', `Bearer ${loginData.token}`);
    expect(response.statusCode).toBe(400);
  });
});

describe('API Resend', () => {
  it('should return 200 OTP has been resent to your email', async () => {
    const user = {
      name: 'admin',
      phoneNumber: '1234567890',
      email: 'test4@gmail.com',
      password: 'admin1234',
    };
    const register = await request(app)
      .post('/api/v1/auth/register')
      .send(user);
    const { token } = register.body.data;
    const response = await request(app)
      .post('/api/v1/auth/resend')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it('should return 400 User is already verified', async () => {
    const user = {
      email: 'admin1@gmail.com',
      password: 'admin1234',
    };
    const login = await request(app).post('/api/v1/auth/login').send(user);
    const { token } = login.body.data;
    const response = await request(app)
      .post('/api/v1/auth/resend')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe('API Forgot Password', () => {
  it('should return 200 Please check your email', async () => {
    const user = {
      email: 'admin1@gmail.com',
    };
    const response = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send(user);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 400 Email is required', async () => {
    const user = {};
    const response = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send(user);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 User not found', async () => {
    const user = {
      email: 'user@example.com',
    };
    const response = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send(user);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe('API Reset Password', () => {
  let token;
  beforeEach(async () => {
    const user = {
      email: 'admin1@gmail.com',
    };
    const forgot = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send(user);
    token = forgot.body.data.token;
  });

  it('should return 200 Password successfully reset', async () => {
    const newPassword = {
      password: 'admin12345',
      confirmPassword: 'admin12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('should return 400 Password is required', async () => {
    const newPassword = {
      confirmPassword: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 Password must be at least 8 characters', async () => {
    const newPassword = {
      password: 'admin',
      confirmPassword: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Confirm password is required', async () => {
    const newPassword = {
      password: 'admin12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Passwords do not match', async () => {
    const newPassword = {
      password: 'admin123456',
      confirmPassword: 'admin123467',
    };
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it('should return 400 New password cannot be the same as old password', async () => {
    const newPassword = {
      password: 'admin12345',
      confirmPassword: 'admin12345',
    };
    const response = await request(app)
      .post('/api/v1/auth/reset-password')
      .send(newPassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe('API Update', () => {
  let token;
  let imageBuffer;
  beforeAll(async () => {
    const filePath = path.join(__dirname, '../public/img/persia.jpg');
    imageBuffer = fs.readFileSync(filePath);
    const user = {
      email: 'user3@gmail.com',
      password: 'admin1234',
    };
    const login = await request(app).post('/api/v1/auth/login').send(user);
    token = login.body.data.token;
  });
  it('should return 200 Profile updated successfully', async () => {
    const response = await request(app)
      .put('/api/v1/user/update')
      .field('name', 'name habis update')
      .attach('image', imageBuffer, 'persia.jpg')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe('API Update Password', () => {
  let token;
  beforeAll(async () => {
    const user = {
      email: 'user4@gmail.com',
      password: 'admin1234',
    };
    const login = await request(app).post('/api/v1/auth/login').send(user);
    token = login.body.data.token;
  });

  it('should return 400 Old password is required', async () => {
    const updatePassword = {
      newPassword: 'admin12345678',
      confirmPassword: 'admin12345678',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 New password is required', async () => {
    const updatePassword = {
      oldPassword: 'admin1234',
      confirmPassword: 'admin12345',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 New password must be at least 8 characters', async () => {
    const updatePassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin',
      confirmPassword: 'admin12345',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Confirm password is required', async () => {
    const updatePassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin123456',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Passwords do not match', async () => {
    const updatePassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin123456',
      confirmPassword: 'admin123457',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Old password is incorrect', async () => {
    const updatePassword = {
      oldPassword: 'admin12345123123123',
      newPassword: 'admin123457',
      confirmPassword: 'admin123457',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 New password cannot be the same as old password', async () => {
    const updatePassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin1234',
      confirmPassword: 'admin1234',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it('should return 200 Profile updated successfully', async () => {
    const updatePassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin12345',
      confirmPassword: 'admin12345',
    };
    const response = await request(app)
      .put('/api/v1/user/update-password')
      .send(updatePassword)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe('API Get All User', () => {
  let tokenAdmin;
  let tokenUser;
  beforeAll(async () => {
    const admin = {
      email: 'admin2@gmail.com',
      password: 'admin1234',
    };
    const loginAdmin = await request(app)
      .post('/api/v1/auth/login')
      .send(admin);
    tokenAdmin = loginAdmin.body.data.token;

    const user = {
      email: 'user1@gmail.com',
      password: 'admin1234',
    };
    const loginUser = await request(app).post('/api/v1/auth/login').send(user);
    tokenUser = loginUser.body.data.token;
  });

  it('should return 200 OK for successful get All user', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 403 You don't have permission to access", async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set('Authorization', `Bearer ${tokenUser}`);
    expect(response.statusCode).toBe(403);
  });

  it('should return 401 Missing authorization token', async () => {
    const response = await request(app).get('/api/v1/user');
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Invalid authorization token format', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set('Authorization', tokenAdmin);
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Token has expired', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6bnVsbCwiZW1haWwiOiJhcHJtbmZrckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwMDk5NTY0OCwiZXhwIjoxNzAwOTk1NzA4fQ.gpSMb1sLAZ83BTsYfhZLrm6ofLL97qQ2SD6I4geaeho',
      );
    expect(response.statusCode).toBe(401);
  });

  it('should return 401 Token has Invalid token', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set('Authorization', 'Bearer invalid');
    expect(response.statusCode).toBe(401);
  });
});

describe('API Get User', () => {
  it('should return 200 User fetched successfully', async () => {
    const user = {
      email: 'admin2@gmail.com',
      password: 'admin1234',
    };
    const login = await request(app).post('/api/v1/auth/login').send(user);
    const { token } = login.body.data;
    const response = await request(app)
      .get('/api/v1/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe('API login admin', () => {
  it('should return 200 Your account has been logged in successfully', async () => {
    const user = {
      email: 'admin2@gmail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/login/admin')
      .send(user);
    expect(response.statusCode).toBe(200);
  });

  it('should return 400 Email is required', async () => {
    const user = {
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/login/admin')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Password is required', async () => {
    const user = {
      email: 'admin2@gmail.com',
    };
    const response = await request(app)
      .post('/api/v1/auth/login/admin')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Email does not exist', async () => {
    const user = {
      email: 'email@example.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/login/admin')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 Password is incorrect', async () => {
    const user = {
      email: 'admin2@gmail.com',
      password: 'admin123123',
    };
    const response = await request(app)
      .post('/api/v1/auth/login/admin')
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 You are not admin', async () => {
    const user = {
      email: 'user1@gmail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/login/admin')
      .send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe('API get user by id', () => {
  let token;
  let id;
  beforeAll(async () => {
    const admin = {
      email: 'admin2@gmail.com',
      password: 'admin1234',
    };
    const loginAdmin = await request(app)
      .post('/api/v1/auth/login')
      .send(admin);
    token = loginAdmin.body.data.token;
    id = loginAdmin.body.data.user.id;
  });

  it('should return 200 User fetched successfully', async () => {
    const response = await request(app)
      .get(`/api/v1/user/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 User not found', async () => {
    const response = await request(app)
      .get('/api/v1/user/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('API delete user', () => {
  let token;
  beforeAll(async () => {
    const admin = {
      email: 'admin2@gmail.com',
      password: 'admin1234',
    };
    const loginAdmin = await request(app)
      .post('/api/v1/auth/login')
      .send(admin);
    token = loginAdmin.body.data.token;
  });

  it('should return 200 User deleted successfully', async () => {
    const user = {
      email: 'user1@gmail.com',
      password: 'admin1234',
    };
    const loginUser = await request(app).post('/api/v1/auth/login').send(user);
    const { id } = loginUser.body.data.user;
    const response = await request(app)
      .delete(`/api/v1/user/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 User not found', async () => {
    const response = await request(app)
      .delete('/api/v1/user/1000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('Forgot Password View', () => {
  it('should render the forgotPassword template', async () => {
    const response = await request(app).get('/forgot-password');
    expect(response.statusCode).toBe(200);
  });
});

describe('Reset Password View', () => {
  it('should render the resetPassword template with a valid token', async () => {
    const user = {
      email: 'admin1@gmail.com',
    };
    const resetPassword = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send(user);
    const { token } = resetPassword.body.data;
    const res = await request(app).get(`/reset-password?token=${token}`);
    expect(res.status).toBe(200);
  });

  it('should redirect to /404 with an invalid token', async () => {
    const res = await request(app).get('/reset-password');
    expect(res.status).toBe(302);
  });
});
