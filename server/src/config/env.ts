import z from "zod";

const envSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z.string().default("development"),
	MONGO_URI: z
		.string()
		.default("mongodb://admin:secret@localhost:27017/linkvault?authSource=admin"),
	JWT_SECRET: z.string().trim().min(1),
	PASSWORD_HASH: z.string().trim().min(1),
	CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
	throw new Error("ENV not valid!");
}

export const env = result.data;
