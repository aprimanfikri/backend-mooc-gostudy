require("dotenv").config();
const request = require("supertest");
const app = require("../app");

const invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJhcHJtbmZrckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwMTE2NzkxMiwiZXhwIjoxNzAxMTY3OTcyfQ.pAHK8Jj_MIAHQ2zh37dVujKYSnUN1nqfqMhrbms62Kc";
const invalidTokens =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJhcHJtbmZrckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwMTE2NzkxMiwiZXhwIjoxNzAxMTY3OTcyfQ.pAHK8Jj_MIAHQ2zh37dVujKYSnUN1nqfqMhrbms62Kc";

describe("API Login", () => {
  it("should return 200 OK for successful login", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(200);
  });
  it("should return 400 Invalid Credentials for unsuccessful login", async () => {
    const user = {
      email: "admins1@gmail.com",
      password: "admin1234",
    };
    const response = await request(app).post("/api/v1/auth/login").send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe("API Register", () => {
  it("should return 200 OK for successful register", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email:
        "asdddaaay2aasdasasssasdasdsaqweasdassdsasddasddasdasdasdasdsdasdyfasdvsasa@gmail.com",
      password: "admin1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(201);
  }, 10000);
  it("should return 400 Bad Request for unsuccessful register", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);
    expect(response.statusCode).toBe(400);
  });
});

describe("API Verify", () => {
  it("should return 200 OK for successful verify", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email:
        "asdasdadyasasasdasdasdasdaaqwesdasdsasdssasdsdaasasdasddasdsdyasasddafvsasa@gmail.com",
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
  });
});

describe("API Resend", () => {
  it("should return 200 OK for successful resend", async () => {
    const user = {
      name: "admin",
      phoneNumber: "1234567890",
      email:
        "asdasdasdayyasdasdasaasdasdasqwedasdassssasdsddasdasaaaasasdasddasdasvvfsxa@gmail.com",
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
  }, 10000);
});

describe("API Forgot Password", () => {
  it("should return 200 OK for successful forgot password", async () => {
    const user = {
      email: "admin1@gmail.com",
    };
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send(user);
    expect(response.statusCode).toBe(200);
  }, 10000);
});

describe("API Reset Password", () => {
  it("should return 200 OK for successful Reset password", async () => {
    const user = {
      email: "aprmnfkr@gmail.com",
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
    expect(response.statusCode).toBe(200);
  });
});

describe("API Update", () => {
  it("should return 200 OK for successful Update", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const update = {
      name: "admin1234",
    };
    const response = await request(app)
      .put(`/api/v1/auth/update`)
      .send(update)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  it("should return 401 for unsuccessful Update", async () => {
    const update = {
      name: "admin1234",
    };
    const response = await request(app)
      .put(`/api/v1/auth/update`)
      .send(update)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
  });
  it("should return 401 for unsuccessful Update", async () => {
    const update = {
      name: "admin1234",
    };
    const response = await request(app)
      .put(`/api/v1/auth/update`)
      .send(update)
      .set("Authorization", `Bearer ${invalidTokens}`);
    expect(response.statusCode).toBe(401);
  });
});

describe("API Get User", () => {
  it("should return 200 OK for successful get user", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  it("should return 401 Unauthorized for unsuccessful get user", async () => {
    const response = await request(app).get("/api/v1/auth/me");
    expect(response.statusCode).toBe(401);
  });
});

describe("API Get All User", () => {
  it("should return 200 OK for successful get All user", async () => {
    const user = {
      email: "admin1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/auth/all")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  it("should return 401 Unauthorized for unsuccessful get user", async () => {
    const user = {
      email: "user1@gmail.com",
      password: "admin1234",
    };
    const login = await request(app).post("/api/v1/auth/login").send(user);
    const token = login.body.data.token;
    const response = await request(app)
      .get("/api/v1/auth/all")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });
});
