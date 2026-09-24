import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { pool } from "@workspace/db";

afterAll(async () => {
  await pool.end();
});

function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@launchkit-test.dev`;
}

let ipCounter = 10;
function nextTestIp(): string {
  return `10.0.0.${ipCounter++}`;
}

describe("POST /api/auth/register", () => {
  it("returns 201 with tokens on valid registration", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", nextTestIp())
      .send({
        email: uniqueEmail("reg-ok"),
        password: "ValidPass1!",
        name: "Test User",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user).toHaveProperty("email");
  });

  it("returns 409 on duplicate email", async () => {
    const ip = nextTestIp();
    const email = uniqueEmail("dup");

    await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", ip)
      .send({ email, password: "ValidPass1!", name: "First" });

    const res = await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", nextTestIp())
      .send({ email, password: "ValidPass1!", name: "Second" });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already in use/i);
  });

  it("returns 400 with field error for invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", nextTestIp())
      .send({ email: "notanemail", password: "ValidPass1!", name: "Test" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("field");
    expect(res.body).toHaveProperty("message");
  });

  it("returns 400 with field error for weak password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", nextTestIp())
      .send({ email: uniqueEmail("weak"), password: "123", name: "Test" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("field");
    expect(res.body).toHaveProperty("message");
  });
});

describe("POST /api/auth/login", () => {
  it("returns 200 with tokens on valid credentials", async () => {
    const ip = nextTestIp();
    const email = uniqueEmail("login-ok");

    await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", ip)
      .send({ email, password: "ValidPass1!", name: "Login Test" });

    const res = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-For", ip)
      .send({ email, password: "ValidPass1!" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("returns 401 on wrong password", async () => {
    const ip = nextTestIp();
    const email = uniqueEmail("wrong-pw");

    await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", nextTestIp())
      .send({ email, password: "ValidPass1!", name: "Wrong PW" });

    const res = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-For", ip)
      .send({ email, password: "WrongPassword999!" });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("returns 401 for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-For", nextTestIp())
      .send({ email: uniqueEmail("ghost"), password: "AnyPass1!" });

    expect(res.status).toBe(401);
  });

  it("returns 429 after 5 failed attempts from the same IP", async () => {
    const ip = `10.99.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const email = uniqueEmail("rate-limit");

    for (let i = 0; i < 5; i++) {
      await request(app)
        .post("/api/auth/login")
        .set("X-Forwarded-For", ip)
        .send({ email, password: "WrongPass1!" });
    }

    const res = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-For", ip)
      .send({ email, password: "WrongPass1!" });

    expect(res.status).toBe(429);
    expect(res.body.message).toMatch(/too many/i);
  });
});

describe("POST /api/auth/refresh", () => {
  it("returns 401 when refresh token is revoked after logout", async () => {
    const email = uniqueEmail("revoke");

    const regRes = await request(app)
      .post("/api/auth/register")
      .set("X-Forwarded-For", nextTestIp())
      .send({ email, password: "ValidPass1!", name: "Revoke Test" });

    const { accessToken, refreshToken } = regRes.body as {
      accessToken: string;
      refreshToken: string;
    };

    await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ refreshToken });

    const refreshRes = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(refreshRes.status).toBe(401);
  });

  it("returns 401 for a completely fake refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "this.is.fake" });

    expect(res.status).toBe(401);
  });

  it("returns 401 when no refresh token is provided", async () => {
    const res = await request(app).post("/api/auth/refresh").send({});
    expect(res.status).toBe(401);
  });
});
