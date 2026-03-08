import { envSchema } from "../models/env.model.js";

const result = envSchema.safeParse(process.env);

if (!result.success) {
	throw new Error("ENV not valid!");
}

export const env = result.data;
