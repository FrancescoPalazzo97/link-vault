import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/index.js";

describe("notFoundHandler", () => {
	it("returns 404 for unknown GET route", async () => {
		const res = await request(app).get("/api/nonexistent");

		expect(res.status).toBe(404);
		expect(res.body.error).toBe("Not found");
	});

	it("returns 404 for unknown POST route", async () => {
		const res = await request(app).post("/api/foo/bar");

		expect(res.status).toBe(404);
		expect(res.body.error).toBe("Not found");
	});
});
