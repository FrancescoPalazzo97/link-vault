import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/index.js";
import { getAuthToken } from "./helpers.js";

describe("GET /api/links/preview", () => {
	it("returns 401 without auth token", async () => {
		const res = await request(app).post("/api/links/preview").send({ url: "https://example.com" });

		expect(res.status).toBe(401);
	});

	it("returns preview data shape", async () => {
		const token = getAuthToken();
		const res = await request(app)
			.post("/api/links/preview")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.com" });

		expect(res.status).toBe(200);
		expect(res.body).toBeTypeOf("object");
	});
});
