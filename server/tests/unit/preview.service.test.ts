import ogs from "open-graph-scraper";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { previewService } from "../../src/services/preview.service.js";

vi.mock("open-graph-scraper");

const mockOgs = vi.mocked(ogs);

describe("previewService.fetch", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns parsed OG data on success", async () => {
		mockOgs.mockResolvedValueOnce({
			result: {
				ogTitle: "Example Title",
				ogDescription: "Example Description",
				ogImage: [{ url: "https://example.com/image.jpg" }],
			},
			html: "",
			response: {} as never,
			error: false,
		});

		const data = await previewService.fetch("https://example.com");

		expect(data).toEqual({
			title: "Example Title",
			description: "Example Description",
			image: "https://example.com/image.jpg",
		});
	});

	it("returns empty object when ogs throws", async () => {
		mockOgs.mockRejectedValueOnce(new Error("Network error"));

		const data = await previewService.fetch("https://unreachable.example.com");

		expect(data).toEqual({});
	});

	it("returns undefined image when ogImage is absent", async () => {
		mockOgs.mockResolvedValueOnce({
			result: {
				ogTitle: "No Image",
				ogDescription: undefined,
				ogImage: undefined,
			},
			html: "",
			response: {} as never,
			error: false,
		});

		const data = await previewService.fetch("https://example.com");

		expect(data.image).toBeUndefined();
	});

	describe("YouTube URLs", () => {
		const youtubeUrls = [
			"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			"https://youtu.be/dQw4w9WgXcQ",
			"https://m.youtube.com/watch?v=dQw4w9WgXcQ",
			"https://youtube.com/watch?v=dQw4w9WgXcQ",
		];

		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it.each(youtubeUrls)("uses oEmbed API for %s", async (url) => {
			const mockFetch = vi.fn().mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					title: "Rick Astley - Never Gonna Give You Up",
					thumbnail_url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
					author_name: "Rick Astley",
				}),
			});
			vi.stubGlobal("fetch", mockFetch);

			const data = await previewService.fetch(url);

			expect(data).toEqual({
				title: "Rick Astley - Never Gonna Give You Up",
				image: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
			});
			expect(mockOgs).not.toHaveBeenCalled();
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("youtube.com/oembed"),
				expect.any(Object),
			);
		});

		it("returns empty object when oEmbed returns non-ok response", async () => {
			vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: false }));

			const data = await previewService.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

			expect(data).toEqual({});
			expect(mockOgs).not.toHaveBeenCalled();
		});

		it("returns empty object when oEmbed fetch throws", async () => {
			vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new Error("Network error")));

			const data = await previewService.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

			expect(data).toEqual({});
			expect(mockOgs).not.toHaveBeenCalled();
		});
	});
});
