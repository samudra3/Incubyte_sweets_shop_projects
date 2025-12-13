const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/modules/auth/user.model");

describe("Auth: Register (Integration)", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it("should register a user and store hashed password in DB", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Amit Verma",
        email: "amit@example.com",
        password: "secret123"
      });

    expect(response.statusCode).toBe(201);

    const user = await User.findOne({ email: "amit@example.com" });
    expect(user).not.toBeNull();
    expect(user.password).not.toBe("secret123");
  });
});
