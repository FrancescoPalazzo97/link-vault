import type { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			error: err.message,
		});
		return;
	}

	if (err instanceof MongooseError.CastError) {
		res.status(400).json({ error: "Invalid ID format" });
		return;
	}

	logger.error(err, "Unknown error");
	res.status(500).json({
		error: "Internal Server Error",
	});
};
