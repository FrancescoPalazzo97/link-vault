import z from "zod";

export const envSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z.string().default("development"),
	MONGO_URI: z
		.string()
		.default("mongodb://admin:secret@localhost:27017/linkvault?authSource=admin"),
});
