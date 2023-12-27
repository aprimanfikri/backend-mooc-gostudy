const request = require("supertest");
const { it, expect, beforeAll, describe } = require("@jest/globals");
const app = require("../app");
const { UserNotification } = require("../models");

let token;

beforeAll(async () => {
  const user = {
    email: "user3@gmail.com",
    password: "user1234",
  };
  const login = await request(app).post("/api/v1/auth/login").send(user);
  token = login.body.data.token;
});

describe("API Get Notification for User", () => {
  it("should return 200 Notification sent", async () => {
    const response = await request(app)
      .get("/api/v1/my-notification/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it("should return 404 Notification not found", async () => {
    const response = await request(app)
      .get("/api/v1/my-notification/99")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 15000);
});

describe("API Get User Notification", () => {
  it("should return 200 success get user notification data", async () => {
    const response = await request(app)
      .get("/api/v1/my-notification")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 30000);

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(UserNotification, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app)
      .get("/api/v1/my-notification")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
  }, 10000);
});
