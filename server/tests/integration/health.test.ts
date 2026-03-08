import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "../../src/config/env.js";
import { app } from "../../src/index.js";

beforeAll(async () => {
	await mongoose.connect(env.MONGO_URI);
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("GET /api/health", () => {
	it("returns status ok and db connected", async () => {
		const res = await request(app).get("/api/health");

		expect(res.status).toBe(200);
		expect(res.body.status).toBe("ok");
		expect(res.body.db).toBe("connected");
	});
});
