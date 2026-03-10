import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src";

describe("POST /api/auth/login", () => {
	it("returns 401 with wrong password", async () => {
		const res = await request(app).post("/api/auth/login").send({ password: "wrong-password" });

		expect(res.status).toBe(401);
		expect(res.body.error).toBe("Invalid password");
	});

	it("returns 200 with token on correct password", async () => {
		const res = await request(app).post("/api/auth/login").send({ password: "test-password-123" });

		expect(res.status).toBe(200);
		expect(res.body.token).toBeDefined();
	});

	it("returns 400 with missing password", async () => {
		const res = await request(app).post("/api/auth/login").send({});

		expect(res.status).toBe(400);
	});
});

describe("POST /api/auth/logout", () => {
	it("returns 200", async () => {
		const res = await request(app).post("/api/auth/logout");

		expect(res.status).toBe(200);
		expect(res.body.message).toBe("Logged out");
	});
});
