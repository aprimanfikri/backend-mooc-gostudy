const request = require("supertest");
const { it, expect, beforeAll, describe } = require("@jest/globals");
const app = require("../app");
const { UserCourse } = require("../models");

let token;

beforeAll(async () => {
  const user = {
    email: "user3@gmail.com",
    password: "user1234",
  };
  const login = await request(app).post("/api/v1/auth/login").send(user);
  token = login.body.data.token;
});

describe("API Open course", () => {
  it("should return 200 Course opened", async () => {
    const response = await request(app)
      .get("/api/v1/view-course/course/1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 15000);

  it("should return 404 Course not found", async () => {
    const response = await request(app)
      .get("/api/v1/view-course/course/50")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 15000);
});

describe("API click module", () => {
  it("should return 200 Module clicked successfully", async () => {
    const response = await request(app)
      .get("/api/v1/view-course/course/2/modules/5")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 30000);

  it("should return 404 Course not found", async () => {
    const response = await request(app)
      .get("/api/v1/view-course/course/50/modules/99")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 15000);

  it("should return 404 Module not found", async () => {
    const response = await request(app)
      .get("/api/v1/view-course/course/1/modules/99")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 15000);

  it("should return 400 You have not purchased access to this course!", async () => {
    const response = await request(app)
      .get("/api/v1/view-course/course/3/modules/11")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  }, 15000);
});

describe("API Get User Course", () => {
  it("should return 200 success get user course data", async () => {
    const response = await request(app)
      .get("/api/v1/view-course")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 30000);

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(UserCourse, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app)
      .get("/api/v1/view-course")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
  }, 10000);
});
