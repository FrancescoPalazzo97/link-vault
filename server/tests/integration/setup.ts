import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, vi } from "vitest";
import { env } from "../../src/config/env.js";

vi.mock("open-graph-scraper");

beforeAll(async () => {
	await mongoose.connect(env.MONGO_URI);
});

beforeEach(async () => {
	const collections = await mongoose.connection.db?.collections();

	if (!collections) {
		return;
	}

	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoose.connection.close();
});
