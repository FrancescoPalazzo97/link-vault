import ogs from "open-graph-scraper";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
});
