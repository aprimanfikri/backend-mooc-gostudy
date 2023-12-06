require("dotenv").config();
const request = require("supertest");
const app = require("../app");

describe("API Login", () => {
  it("should return 200 Your account has been logged in successfully", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(200);
  });
  it("should return 400 Email is required", async () => {
    const user = {
      password: "admin1234",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });
  it("should return 400 Password is required", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });
  it("should return 400 Email does not exist", async () => {
    const user = {
      email: "example@example.com",
      password: "admin1234",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });
  it("should return 400 Email not verified", async () => {
    const user = {
      email: "user2@gmail.com",
      password: "admin1234",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });
  it("should return 400 Password is incorrect", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin123",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe("API Register", () => {
  it("should return 200 Register successfully", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email: "test1@gmail.com",
      password: "test12345",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
  }, 10000);

  it("should return 400 Name is required", async () => {
    const user = {
      phoneNumber: "1234567890",
      email: "test10@gmail.com",
      password: "test12345",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Name must be at least 3 characters", async () => {
    const user = {
      name: "jo",
      phoneNumber: "1234567890",
      email: "test10@gmail.com",
      password: "test12345",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Email is required", async () => {
    const user = {
      name: "Test",
      phoneNumber: "1234567890",
      password: "test12345",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Password is required", async () => {
    const user = {
      name: "Test",
      email: "test10@gmail.com",
      phoneNumber: "1234567890",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Password must be at least 8 characters", async () => {
    const user = {
      name: "Test",
      email: "test10@gmail.com",
      phoneNumber: "1234567890",
      password: "test",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Phone number is required", async () => {
    const user = {
      name: "Test",
      email: "test10@gmail.com",
      password: "test123456",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Phone number must be at least 10 numbers", async () => {
    const user = {
      name: "Test",
      email: "test10@gmail.com",
      phoneNumber: "12345",
      password: "test12345678",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Email already exists", async () => {
    const user = {
      name: "Test",
      email: "admin1@gmail.com",
      phoneNumber: "12345123123123213",
      password: "test123456789",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe("API Verify", () => {
  it("should return 200 Email verification successful", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email: "test2@gmail.com",
      password: "admin1234",
    };
    const register = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    const token = register.body.data.token;
    const otp = register.body.data.otp;
    const otpV = {
      otp: otp,
    };
    const response = await request(app)
      .post("/api/v1/auth/verify")
      .send(otpV)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it("should return 400 OTP is required", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email: "test3@gmail.com",
      password: "admin1234",
    };
    const register = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    const token = register.body.data.token;
    const otp = register.body.data.otp;
    const otpV = {
      // otp: otp,
    };
    const response = await request(app)
      .post("/api/v1/auth/verify")
      .send(otpV)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 User is already verified", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const otpV = {
      otp: "1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/verify")
      .send(otpV)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });
});

describe("API Resend", () => {
  it("should return 200 OTP has been resent to your email", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email: "test4@gmail.com",
      password: "admin1234",
    };
    const register = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    const token = register.body.data.token;
    const response = await request(app)
      .post("/api/v1/auth/resend")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it("should return 400 User is already verified", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .post("/api/v1/auth/resend")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe("API Forgot Password", () => {
  it("should return 200 Please check your email", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should return 400 Email is required", async () => {
    const user = {};
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 User not found", async () => {
    const user = {
      email: "user@example.com",
    };
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API Reset Password", () => {
  it("should return 200 Password successfully reset", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const forgot = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = forgot.body.data.token;
    const newPassword = {
      password: "admin12345",
      confirmPassword: "admin12345",
    };
    const response = await request(app)
      .post(`/api/v1/auth/reset-password`)
      .send(newPassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should return 400 Password is required", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const forgot = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = forgot.body.data.token;
    const newPassword = {
      confirmPassword: "admin1234",
    };
    const response = await request(app)
      .post(`/api/v1/auth/reset-password`)
      .send(newPassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 Password must be at least 8 characters", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const forgot = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = forgot.body.data.token;
    const newPassword = {
      password: "admin",
      confirmPassword: "admin1234",
    };
    const response = await request(app)
      .post(`/api/v1/auth/reset-password`)
      .send(newPassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Confirm password is required", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const forgot = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = forgot.body.data.token;
    const newPassword = {
      password: "admin12345",
    };
    const response = await request(app)
      .post(`/api/v1/auth/reset-password`)
      .send(newPassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Passwords do not match", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const forgot = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = forgot.body.data.token;
    const newPassword = {
      password: "admin123456",
      confirmPassword: "admin123467",
    };
    const response = await request(app)
      .post(`/api/v1/auth/reset-password`)
      .send(newPassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 New password cannot be the same as old password", async () => {
    const user = {
      email: "user1@gmail.com",
    };
    const forgot = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = forgot.body.data.token;
    const newPassword = {
      password: "admin1234",
      confirmPassword: "admin1234",
    };
    const response = await request(app)
      .post(`/api/v1/auth/reset-password`)
      .send(newPassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe("API Update", () => {
  it("should return 200 Profile updated successfully", async () => {
    const user = {
      email: "user3@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const update = {
      name: "User 3 Habis update",
    };
    const response = await request(app)
      .put(`/api/v1/user/update`)
      .send(update)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe("API Update Password", () => {
  it("should return 200 Profile updated successfully", async () => {
    const user = {
      email: "user3@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin1234",
      newPassword: "admin12345",
      confirmPassword: "admin12345",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 Old password is required", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      newPassword: "admin12345",
      confirmPassword: "admin12345",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 New password is required", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin1234",
      confirmPassword: "admin12345",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 New password must be at least 8 characters", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin1234",
      newPassword: "admin",
      confirmPassword: "admin12345",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Confirm password is required", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin1234",
      newPassword: "admin123456",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Passwords do not match", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin1234",
      newPassword: "admin123456",
      confirmPassword: "admin123457",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Old password is incorrect", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin12345678asdasd",
      newPassword: "admin123457",
      confirmPassword: "admin123457",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 New password cannot be the same as old password", async () => {
    const user = {
      email: "user4@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const updatePassword = {
      oldPassword: "admin1234",
      newPassword: "admin1234",
      confirmPassword: "admin1234",
    };
    const response = await request(app)
      .put(`/api/v1/user/update-password`)
      .send(updatePassword)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  });
});

describe("API Get All User", () => {
  it("should return 200 OK for successful get All user", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 403 You don't have permission to access", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });

  it("should return 401 Missing authorization token", async () => {
    const response = await request(app).get("/api/v1/user");
    expect(response.statusCode).toBe(401);
  });

  it("should return 401 Invalid authorization token format", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/user")
      .set("Authorization", token);
    expect(response.statusCode).toBe(401);
  });

  it("should return 401 Token has expired", async () => {
    const response = await request(app)
      .get("/api/v1/user")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6bnVsbCwiZW1haWwiOiJhcHJtbmZrckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwMDk5NTY0OCwiZXhwIjoxNzAwOTk1NzA4fQ.gpSMb1sLAZ83BTsYfhZLrm6ofLL97qQ2SD6I4geaeho`
      );
    expect(response.statusCode).toBe(401);
  });

  it("should return 401 Token has Invalid token", async () => {
    const response = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer invalid`);
    expect(response.statusCode).toBe(401);
  });
});

describe("API Get User", () => {
  it("should return 200 User fetched successfully", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe("API login admin", () => {
  it("should return 200 Your account has been logged in successfully", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/login/admin")
      .send(user);
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 Email is required", async () => {
    const user = {
      password: "admin1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/login/admin")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Password is required", async () => {
    const user = {
      email: "admin2@gmail.com",
    };
    const response = await request(app)
      .post("/api/v1/auth/login/admin")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Email does not exist", async () => {
    const user = {
      email: "email@example.com",
      password: "admin1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/login/admin")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 Password is incorrect", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin123123",
    };
    const response = await request(app)
      .post("/api/v1/auth/login/admin")
      .send(user);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 You are not admin", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "admin1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/login/admin")
      .send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe("API get user by id", () => {
  it("should return 200 User fetched successfully", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const id = login.body.data.user.id;
    const response = await request(app)
      .get(`/api/v1/user/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 404 User not found", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get(`/api/v1/user/1000`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("API delete user", () => {
  it("should return 200 User deleted successfully", async () => {
    const admin = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const loginAdmin = await request(app)
      .post("/api/v1/auth/login")
      .send(admin);
    const token = loginAdmin.body.data.token;
    const user = {
      email: "user5@gmail.com",
      password: "admin1234",
    };
    const loginUser = await request(app).post("/api/v1/auth/login").send(user);
    const id = loginUser.body.data.user.id;
    const response = await request(app)
      .delete(`/api/v1/user/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it("should return 404 User not found", async () => {
    const user = {
      email: "admin2@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .delete(`/api/v1/user/1000`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("Forgot Password View", () => {
  it("should render the forgotPassword template", async () => {
    const response = await request(app).get("/forgot-password");
    expect(response.statusCode).toBe(200);
  });
});

describe("Reset Password View", () => {
  it("should render the resetPassword template with a valid token", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const resetPassword = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    const token = resetPassword.body.data.token;
    const res = await request(app).get(`/reset-password?token=${token}`);
    expect(res.status).toBe(200);
  });

  it("should redirect to /404 with an invalid token", async () => {
    const res = await request(app).get("/reset-password");
    expect(res.status).toBe(302);
  });
});
