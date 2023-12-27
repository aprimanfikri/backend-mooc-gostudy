const request = require("supertest");
const { it, expect, describe, beforeAll } = require("@jest/globals");
const app = require("../app");
const { Payment } = require("../models");

let tokenUser;
let tokenAdmin;
let courseId;
let courseId2;

let id;

beforeEach(async () => {
  const user = {
    email: "user3@gmail.com",
    password: "user1234",
  };
  const login = await request(app).post("/api/v1/auth/login").send(user);
  console.log(login);
  tokenUser = login.body.data.token;

  const admin = {
    email: "admin1@gmail.com",
    password: "admin1234",
  };

  const loginAdmin = await request(app).post("/api/v1/auth/login").send(admin);
  console.log(loginAdmin);
  tokenAdmin = loginAdmin.body.data.token;
}, 30000);

describe("API create transaction", () => {
  it("should return 201 Transaction created successfully", async () => {
    courseId = 7;
    const response = await request(app)
      .post("/api/v1/payment")
      .send({ courseId })
      .set("Authorization", `Bearer ${tokenUser}`);

    id = response.body.data.createPayment.courseId;
    expect(response.statusCode).toBe(201);
  }, 30000);

  it("should return 201 Transaction created successfully", async () => {
    courseId2 = 5;
    const response = await request(app)
      .post("/api/v1/payment")
      .send({ courseId: courseId2 })
      .set("Authorization", `Bearer ${tokenUser}`);

    // id = response.body.data.createPayment.id;
    expect(response.statusCode).toBe(201);
  }, 30000);

  it("should return 404 Course not found!", async () => {
    const response = await request(app)
      .post("/api/v1/payment")
      .send({
        courseId: 1000,
      })
      .set("Authorization", `Bearer ${tokenUser}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API Forbidden to buy the same course twice", () => {
  it("should return 403 Denied double transaction", async () => {
    courseId = 2;
    const response = await request(app)
      .post("/api/v1/payment")
      .send({ courseId })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(response.statusCode).toBe(403);
  }, 10000);
});

describe("API get transaction", () => {
  it("should return 200 Get transaction successfully", async () => {
    const response = await request(app)
      .get("/api/v1/payment")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(Payment, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app)
      .get("/api/v1/payment")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(500);
  }, 10000);
});

describe("API get transaction by id", () => {
  it("should return 200 Get transaction by id successfully", async () => {
    const response = await request(app)
      .get("/api/v1/payment/1")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it("should return 404 Transaction not found!", async () => {
    const response = await request(app)
      .get("/api/v1/payment/1000")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API get user transaction history", () => {
  it("should return 200 Get payment history successfully", async () => {
    const response = await request(app)
      .get("/api/v1/payment/history")
      .set("Authorization", `Bearer ${tokenUser}`);
    expect(response.statusCode).toBe(200);
  });

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(Payment, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app)
      .get("/api/v1/payment/history")
      .set("Authorization", `Bearer ${tokenUser}`);
    expect(response.statusCode).toBe(500);
  }, 10000);
});

describe("API delete payment", () => {
  it("should return 200 delete payment", async () => {
    const response = await request(app)
      .delete(`/api/v1/payment/delete/${id}`)
      .set("Authorization", `Bearer ${tokenUser}`);
    expect(response.statusCode).toBe(200);
  }, 30000);

  it("should return 404 payment history not found", async () => {
    const response = await request(app)
      .delete("/api/v1/payment/delete/300")
      .set("Authorization", `Bearer ${tokenUser}`);
    expect(response.statusCode).toBe(404);
  }, 15000);
});
