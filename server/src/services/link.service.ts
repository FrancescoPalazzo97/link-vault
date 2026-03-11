import type { CreateLinkInput, UpdateLinkInput } from "@link-vault/shared";
import { Link } from "../models/link.model.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import { extractDomain } from "../utils/extractDomain.js";
import { previewService } from "./preview.service.js";

export const linkService = {
	async getAll(query: {
		search?: string;
		tags?: string;
		category?: string;
		page?: string;
		limit?: string;
	}) {
		const filter: Record<string, unknown> = {};

		if (query.search) {
			const escaped = escapeRegex(query.search);
			const regex = new RegExp(`\\b${escaped}`, "i");
			filter.$or = [{ title: regex }, { url: regex }, { tags: regex }, { notes: regex }];
		}

		if (query.tags) {
			filter.tags = { $in: query.tags.split(",") };
		}

		if (query.category) {
			filter.category = query.category;
		}

		const page = parseInt(query.page ?? "1", 10);
		const limit = parseInt(query.limit ?? "20", 10);
		const skip = (page - 1) * limit;

		const [links, total] = await Promise.all([
			Link.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
			Link.countDocuments(filter),
		]);

		return { links, total, page, totalPages: Math.ceil(total / limit) };
	},

	async getById(id: string) {
		const link = await Link.findById(id);
		if (!link) throw new AppError(404, "Link not found");
		return link;
	},

	async create(data: CreateLinkInput) {
		const preview = await previewService.fetch(data.url);
		return Link.create({
			...preview,
			...data,
			domain: data.domain ?? extractDomain(data.url),
		});
	},

	async update(id: string, data: UpdateLinkInput) {
		const link = await Link.findByIdAndUpdate(id, data, { new: true });
		if (!link) throw new AppError(404, "Link not found");
		return link;
	},

	async remove(id: string) {
		const link = await Link.findByIdAndDelete(id);
		if (!link) throw new AppError(404, "Link not found");
		return link;
	},

	async getTags() {
		return Link.distinct("tags");
	},

	async getCategories() {
		const cats = await Link.distinct("category");
		return cats.filter(Boolean);
	},
};
