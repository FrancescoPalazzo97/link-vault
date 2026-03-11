import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const isDev = env.NODE_ENV !== "production";

export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	skip: () => isDev,
	standardHeaders: true,
	legacyHeaders: false,
});

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	skip: () => isDev,
	standardHeaders: true,
	legacyHeaders: false,
});
