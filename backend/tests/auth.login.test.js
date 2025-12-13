const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const User = require("../src/modules/auth/user.model");

describe("Auth: Login", () => {

  // Connect to test database before tests
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  // Clean up database & close connection
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should fail for invalid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "wrongpassword"
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should login successfully with correct credentials", async () => {
    /**
     * Arrange
     * We must create the user INSIDE this test file.
     * Tests must not depend on other test files.
     */
    const hashedPassword = await bcrypt.hash("secret123", 10);

    await User.create({
      name: "Amit Verma",
      email: "amit@example.com",
      password: hashedPassword
    });

    /**
     * Act
     */
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "amit@example.com",
        password: "secret123"
      });

    /**
     * Assert
     */
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
