import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/index.js";
import { getAuthToken } from "./helpers.js";

describe("GET /api/tags", () => {
	it("returns empty array when no links", async () => {
		const token = getAuthToken();

		const res = await request(app).get("/api/links/tags").set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});

	it("returns unique tags form all links", async () => {
		const token = getAuthToken();

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.com", tags: ["react", "javascript"] });

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.org", tags: ["react", "typescript"] });

		const res = await request(app).get("/api/links/tags").set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body).toEqual(expect.arrayContaining(["react", "javascript", "typescript"]));
		expect(res.body).toHaveLength(3);
	});
});

describe("GET /api/categories", () => {
	it("returns empty array when no links", async () => {
		const token = getAuthToken();

		const res = await request(app)
			.get("/api/links/categories")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body).toEqual([]);
	});

	it("returns unique categories excluding null", async () => {
		const token = getAuthToken();

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.com", category: "tech" });

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.org" });

		const res = await request(app)
			.get("/api/links/categories")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body).toEqual(["tech"]);
	});
});
