import type { Request, Response } from "express";
import { linkService } from "../services/link.service.js";
import { previewService } from "../services/preview.service.js";

export const linkController = {
	async getAll(req: Request, res: Response) {
		const result = await linkService.getAll(req.query);
		res.json(result);
	},

	async getById(req: Request, res: Response) {
		const link = await linkService.getById(req.params.id as string);
		res.json(link);
	},

	async create(req: Request, res: Response) {
		const link = await linkService.create(req.body);
		res.status(201).json(link);
	},

	async update(req: Request, res: Response) {
		const link = await linkService.update(req.params.id as string, req.body);
		res.json(link);
	},

	async remove(req: Request, res: Response) {
		const link = await linkService.remove(req.params.id as string);
		res.json(link);
	},

	async preview(req: Request, res: Response) {
		const { url } = req.body;
		const data = await previewService.fetch(url);
		res.json(data);
	},

	async getTags(_req: Request, res: Response) {
		const tags = await linkService.getTags();
		res.json(tags);
	},

	async getCategories(_req: Request, res: Response) {
		const categories = await linkService.getCategories();
		res.json(categories);
	},
};
