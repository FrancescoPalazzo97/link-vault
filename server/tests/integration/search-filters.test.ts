import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/index.js";
import { getAuthToken } from "./helpers.js";

describe("GET /api/links- search and filters", () => {
	it("filters by category", async () => {
		const token = getAuthToken();

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.com", category: "tech" });

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.org", category: "news" });

		const res = await request(app)
			.get("/api/links?category=tech")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.links).toHaveLength(1);
		expect(res.body.links[0].category).toBe("tech");
	});

	it("filters by tags", async () => {
		const token = getAuthToken();

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.com", tags: ["react"] });

		await request(app)
			.post("/api/links")
			.set("Authorization", `Bearer ${token}`)
			.send({ url: "https://example.org", tags: ["vue"] });

		const res = await request(app)
			.get("/api/links?tags=react")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.links).toHaveLength(1);
		expect(res.body.links[0].tags).toContain("react");
	});

	it("returns correct pagination metadata", async () => {
		const token = getAuthToken();

		for (let i = 0; i < 5; i++) {
			await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: `https://example${i}.com` });
		}

		const res = await request(app)
			.get("/api/links?page=1&limit=2")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.links).toHaveLength(2);
		expect(res.body.total).toBe(5);
		expect(res.body.totalPages).toBe(3);
		expect(res.body.page).toBe(1);
	});
});
