import { createLinkSchema } from "@link-vault/shared";
import { describe, expect, it } from "vitest";

describe("createLinkSchema", () => {
	it("validate a correct link", () => {
		const result = createLinkSchema.safeParse({
			url: "https://example.com",
		});
		expect(result.success).toBe(true);
	});

	it("rejecting invalid url", () => {
		const result = createLinkSchema.safeParse({ url: "not-a-url" });
		expect(result.success).toBe(false);
	});

	it("applies default values", () => {
		const result = createLinkSchema.safeParse({ url: "https://example.com" });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.tags).toEqual([]);
			expect(result.data.isFavorite).toBe(false);
		}
	});

	it("accepts optional fields", () => {
		const result = createLinkSchema.safeParse({
			url: "https://example.com",
			title: "Example",
			tags: ["dev", "tools"],
			category: "tech",
			notes: "A note",
			isFavorite: true,
		});
		expect(result.success).toBe(true);
	});
});
