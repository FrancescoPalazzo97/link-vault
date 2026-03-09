import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			error: err.message,
		});
		return;
	}

	console.log("Unknown error", err);
	res.status(500).json({
		error: "Internal Server Error",
	});
};
