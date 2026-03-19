import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "../../src/index.js";
import { getAuthToken } from "./helpers.js";

describe("POST /api/links/preview", () => {
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

	describe("YouTube oEmbed", () => {
		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it("returns oEmbed data for YouTube URLs", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValueOnce({
					ok: true,
					json: async () => ({
						title: "Test Video",
						thumbnail_url: "https://i.ytimg.com/vi/test/hqdefault.jpg",
						author_name: "Test Author",
					}),
				})
			);

			const token = getAuthToken();
			const res = await request(app)
				.post("/api/links/preview")
				.set("Authorization", `Bearer ${token}`)
				.send({ url: "https://www.youtube.com/watch?v=test123" });

			expect(res.status).toBe(200);
			expect(res.body).toEqual({
				title: "Test Video",
				description: "Video by Test Author",
				image: "https://i.ytimg.com/vi/test/hqdefault.jpg",
			});
		});
	});
});
