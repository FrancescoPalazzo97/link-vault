import { describe, expect, it } from "vitest";
import { extractDomain } from "../../src/utils/extractDomain.js";

describe("extractDomain", () => {
	it("extract domain form a simple URL", () => {
		expect(extractDomain("https://example.com/page")).toBe("example.com");
	});

	it("removes www prefix", () => {
		expect(extractDomain("https://www.example.com")).toBe("example.com");
	});

	it("handles URLs with subdomains", () => {
		expect(extractDomain("https://blog.example.com/post")).toBe("blog.example.com");
	});

	it("handles URLs with ports", () => {
		expect(extractDomain("http://localhost:3000/api")).toBe("localhost");
	});

	it("throws on invalid URL", () => {
		expect(() => extractDomain("not-a-url")).toThrow();
	});
});
