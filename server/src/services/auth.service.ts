import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const authService = {
	async login(password: string): Promise<string> {
		const isValid = await bcrypt.compare(password, env.PASSWORD_HASH);

		if (!isValid) {
			throw new AppError(401, "Invalid password");
		}

		return jwt.sign({}, env.JWT_SECRET, { expiresIn: "7d" });
	},

	verify(token: string) {
		try {
			return jwt.verify(token, env.JWT_SECRET);
		} catch {
			throw new AppError(401, "Invalid or expired token");
		}
	},
};
