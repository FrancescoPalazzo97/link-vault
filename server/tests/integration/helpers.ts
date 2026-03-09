import jwt from "jsonwebtoken";
import { env } from "../../src/config/env.js";

export function getAuthToken(): string {
	return jwt.sign({}, env.JWT_SECRET, { expiresIn: "1h" });
}
