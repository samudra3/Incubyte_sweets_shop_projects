const request = require("supertest");
const app = require("../src/app");

describe("Auth: Register", () => {
  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: "password123"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });
});
