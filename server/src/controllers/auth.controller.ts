import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";

export const authController = {
	async login(req: Request, res: Response) {
		const { password } = req.body;
		const token = await authService.login(password);
		res.json({ token });
	},

	logout(_req: Request, res: Response) {
		res.json({ message: "Logged out" });
	},
};
