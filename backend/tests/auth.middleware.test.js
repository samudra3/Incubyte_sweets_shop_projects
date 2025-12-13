const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/modules/auth/user.model");
const jwt = require("jsonwebtoken");

describe("Auth Middleware", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.create({
      name: "Test User",
      email: "middleware@test.com",
      password: "hashedpassword",
      role: "user"
    });

    token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should block request without token", async () => {
    const res = await request(app).get("/api/protected-test");
    expect(res.statusCode).toBe(401);
  });

  it("should allow request with valid token", async () => {
    const res = await request(app)
      .get("/api/protected-test")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
  });
});
