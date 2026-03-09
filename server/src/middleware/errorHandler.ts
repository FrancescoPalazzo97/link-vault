import type { ErrorRequestHandler } from "express";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			error: err.message,
		});
		return;
	}

	logger.error(err, "Unknown error");
	res.status(500).json({
		error: "Internal Server Error",
	});
};
