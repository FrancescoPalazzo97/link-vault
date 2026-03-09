import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src";

describe("POST /api/auth/login", () => {
	it("returns 401 with wrong password", async () => {
		const res = await request(app).post("/api/auth/login").send({ password: "wrong-password" });

		expect(res.status).toBe(401);
		expect(res.body.error).toBe("Invalid password");
	});
});
