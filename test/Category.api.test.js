const fs = require("fs");
const path = require("path");
const request = require("supertest");
const { it, expect, beforeAll, describe } = require("@jest/globals");
const app = require("../app");
const { Category } = require("../models");

let token;
let imageBuffer;
let imageBuffer2;
let fileBuffer;
let categoryId;

beforeAll(async () => {
  const user = { email: "admin2@gmail.com", password: "admin1234" };
  const login = await request(app).post("/api/v1/auth/login").send(user);
  const filePath = path.join(__dirname, "../public/img/persia.jpg");
  const filePath2 = path.join(__dirname, "../public/img/testImage.jpg");
  const filePath3 = path.join(__dirname, "../public/doc/test.pdf");
  imageBuffer = fs.readFileSync(filePath);
  imageBuffer2 = fs.readFileSync(filePath2);
  fileBuffer = fs.readFileSync(filePath3);
  token = login.body.data.token;
});

describe("API create category", () => {
  it("should return 201 Category created successfully", async () => {
    const response = await request(app)
      .post("/api/v1/category")
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer, "persia.jpg");
    categoryId = response.body.data.newCat.id;
    expect(response.statusCode).toBe(201);
  }, 10000);

  it("should return 400 Only .png, .jpg, .jpeg, and .mp4 format allowed!", async () => {
    const response = await request(app)
      .post("/api/v1/category")
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", fileBuffer, "test.pdf");
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 File size exceeds the limit (5MB)", async () => {
    const response = await request(app)
      .post("/api/v1/category")
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer2, "testImage.jpg");
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 Name is required", async () => {
    const response = await request(app)
      .post("/api/v1/category")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer, "persia.jpg");
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 Image is required", async () => {
    const response = await request(app)
      .post("/api/v1/category")
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe("API update category", () => {
  let id;
  beforeAll(async () => {
    const response = await request(app)
      .post("/api/v1/category")
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer, "persia.jpg");
    id = response.body.data.newCat.id;
  }, 10000);

  it("should return 200 Category updated successfully", async () => {
    const response = await request(app)
      .patch(`/api/v1/category/${id}`)
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer, "persia.jpg");
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should return 400 File size exceeds the limit (5MB)", async () => {
    const response = await request(app)
      .patch(`/api/v1/category/${id}`)
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer2, "testImage.jpg");
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 400 Name is required", async () => {
    const response = await request(app)
      .patch(`/api/v1/category/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer, "persia.jpg");
    expect(response.statusCode).toBe(400);
  }, 10000);

  it("should return 404 Category not found!", async () => {
    const response = await request(app)
      .patch("/api/v1/category/1000")
      .field("name", `category ${new Date().getTime()}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("image", imageBuffer, "persia.jpg");
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API get category by id", () => {
  it("should return 200 Category found", async () => {
    const response = await request(app)
      .get(`/api/v1/category/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should return 404 Category not found!", async () => {
    const response = await request(app)
      .get("/api/v1/category/1000")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API delete category", () => {
  it("should return 200 Category deleted successfully", async () => {
    const response = await request(app)
      .delete(`/api/v1/category/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should return 404 Category not found!", async () => {
    const response = await request(app)
      .delete("/api/v1/category/1000")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  }, 10000);
});

describe("API get all category", () => {
  it("should return 200 All categories fetched successfully", async () => {
    const response = await request(app)
      .get("/api/v1/category")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should call next with error when an error occurs", async () => {
    const mockedError = new Error("An example error");
    jest.spyOn(Category, "findAll").mockRejectedValueOnce(mockedError); // eslint-disable-line
    const response = await request(app).get("/api/v1/category");
    expect(response.statusCode).toBe(500);
  }, 10000);
});
