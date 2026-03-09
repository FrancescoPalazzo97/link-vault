import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";

export function authGuard(req: Request, _res: Response, next: NextFunction) {
	const header = req.headers.authorization;

	if (!header?.startsWith("Bearer ")) {
		throw new AppError(401, "Missing or invalid token");
	}

	const token = header.slice(7);
	authService.verify(token);
	next();
}
