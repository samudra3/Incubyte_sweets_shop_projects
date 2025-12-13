const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");

describe("Authorization: Roles", () => {
  it("should block non-admin from admin-only route", async () => {
    const userToken = jwt.sign(
      { userId: "u1", role: "user" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Ladoo",
        category: "Gram",
        price: 100,
        quantity: 10
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Admin access required");

  });

  it("should allow admin to access admin-only route", async () => {
    const adminToken = jwt.sign(
      { userId: "a1", role: "admin" },
      process.env.JWT_SECRET
    );

    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Ladoo",
        category: "Gram",
        price: 100,
        quantity: 10
      });

    expect(res.statusCode).toBe(201);
  });
});
