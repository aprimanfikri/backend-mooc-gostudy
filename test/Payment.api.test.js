const fs = require("fs");
const path = require("path");
const request = require("supertest");
const {
  it,
  expect,
  beforeAll,
  describe,
  beforeEach,
} = require("@jest/globals");
const app = require("../app");
const { Payment } = require("../models");

let token;
let courseId;
let courseId2;
let imageBuffer;

let id;

beforeAll(async () => {
  const user = { email: "admin2@gmail.com", password: "admin1234" };
  const login = await request(app).post("/api/v1/auth/login").send(user);
  token = login.body.data.token;
  const filePath = path.join(__dirname, "../public/img/persia.jpg");
  imageBuffer = fs.readFileSync(filePath);
  const createCourse1 = await request(app)
    .post("/api/v1/course")
    .field("name", `test_${new Date().getTime()}`)
    .field("level", "Beginner")
    .field("categoryId", 1)
    .field("description", "Test description")
    .field("benefits", "Test benefits")
    .field("classCode", "test123")
    .field("type", "Premium")
    .field("promoPercentage", 10)
    .field("price", 100000)
    .field("courseBy", "test")
    .set("Authorization", `Bearer ${token}`)
    .attach("image", imageBuffer, "persia.jpg");
  courseId = createCourse1.body.data.newCourse.id;

  const createCourse2 = await request(app)
    .post("/api/v1/course")
    .field("name", `test_${new Date().getTime()}`)
    .field("level", "Beginner")
    .field("categoryId", 1)
    .field("description", "Test description")
    .field("benefits", "Test benefits")
    .field("classCode", "test123")
    .field("type", "Premium")
    .field("price", 100000)
    .field("courseBy", "test")
    .set("Authorization", `Bearer ${token}`)
    .attach("image", imageBuffer, "persia.jpg");
  courseId2 = createCourse2.body.data.newCourse.id;
}, 30000);

describe("API create transaction", () => {
  it("should return 201 Transaction created successfully", async () => {
    const response = await request(app)
      .post("/api/v1/payment")
      .send({ courseId })
      .set("Authorization", `Bearer ${token}`);

    id = response.body.data.createPayment.id;
    expect(response.statusCode).toBe(201);
  }, 10000);

  it("should return 201 Transaction created successfully", async () => {
    const response = await request(app)
      .post("/api/v1/payment")
      .send({ courseId: courseId2 })
      .set("Authorization", `Bearer ${token}`);

    id = response.body.data.createPayment.id;
    expect(response.statusCode).toBe(201);
  }, 10000);

  it("should return 404 Course not found!", async () => {
    const response = await request(app)
      .post("/api/v1/payment")
      .send({
        courseId: 1000,
      })
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API Forbidden to buy the same course twice", () => {
  beforeEach(async () => {
    const userMember = { email: "user3@gmail.com", password: "user1234" };
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send(userMember);
    token = login.body.data.token;

    courseId = 2;
  }, 30000);

  it("should return 403 Denied double transaction", async () => {
    const response = await request(app)
      .post("/api/v1/payment")
      .send({ courseId })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
  }, 10000);
});

describe("API get transaction", () => {
  it("should return 200 Get transaction successfully", async () => {
    const response = await request(app)
      .get("/api/v1/payment")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(Payment, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app)
      .get("/api/v1/payment")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
  }, 10000);
});

describe("API get transaction by id", () => {
  it("should return 200 Get transaction by id successfully", async () => {
    const response = await request(app)
      .get(`/api/v1/payment/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should return 404 Transaction not found!", async () => {
    const response = await request(app)
      .get("/api/v1/payment/1000")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API get user transaction history", () => {
  it("should return 200 Get payment history successfully", async () => {
    const response = await request(app)
      .get("/api/v1/payment/history")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(Payment, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app)
      .get("/api/v1/payment/history")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
  }, 10000);
});

describe("API delete payment", () => {
  beforeEach(async () => {
    const userMember = { email: "user4@gmail.com", password: "user1234" };
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send(userMember);
    token = login.body.data.token;
    courseId = 3;
  }, 30000);

  it("should return 200 delete payment", async () => {
    const response = await request(app)
      .delete(`/api/v1/payment/delete/${courseId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 30000);

  it("should return 404 payment history not found", async () => {
    const response = await request(app)
      .delete("/api/v1/payment/delete/300")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
}, 15000);
