import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src";
import { getAuthToken } from "./helpers";

const token = getAuthToken();

describe("Links CRUD", () => {
	describe("POST /api/links", () => {
		it("creates a new link", async () => {
			const res = await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "https://example.com" });

			expect(res.status).toBe(201);
			expect(res.body.url).toBe("https://example.com");
			expect(res.body.domain).toBe("example.com");
			expect(res.body._id).toBeDefined();
		});

		it("returns 400 with invalid url", async () => {
			const res = await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "not-a-url" });

			expect(res.status).toBe(400);
		});

		it("returns 401 without token", async () => {
			const res = await request(app).post("/api/links").send({ url: "https://example.com" });

			expect(res.status).toBe(401);
		});
	});

	describe("GET /api/links", () => {
		it("returns empty list initially", async () => {
			const res = await request(app).get("/api/links").set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body.links).toEqual([]);
			expect(res.body.total).toBe(0);
		});

		it("returns created links", async () => {
			await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "https://example.com", title: "Example" });

			const res = await request(app).get("/api/links").set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body.links).toHaveLength(1);
			expect(res.body.links[0].title).toBe("Example");
		});
	});

	describe("GET /api/links/:id", () => {
		it("returns a single link", async () => {
			const created = await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "https://example.com" });

			const res = await request(app)
				.get(`/api/links/${created.body._id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body.url).toBe("https://example.com");
		});

		it("returns 404 for non-existent link", async () => {
			const res = await request(app)
				.get("/api/links/000000000000000000000000")
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(404);
		});
	});

	describe("PATCH /api/links/:id", () => {
		it("updates a link", async () => {
			const created = await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "https://example.com" });

			const res = await request(app)
				.patch(`/api/links/${created.body._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ title: "Updated Title" });

			expect(res.status).toBe(200);
			expect(res.body.title).toBe("Updated Title");
		});
	});

	describe("DELETE /api/links/:id", () => {
		it("deletes a link", async () => {
			const created = await request(app)
				.post("/api/links")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "https://example.com" });

			const res = await request(app)
				.delete(`/api/links/${created.body._id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(200);

			const check = await request(app)
				.get(`/api/links/${created.body._id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(check.status).toBe(404);
		});
	});
});
