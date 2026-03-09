import z from "zod";

export const envSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z.string().default("development"),
	MONGO_URI: z
		.string()
		.default("mongodb://admin:secret@localhost:27017/linkvault?authSource=admin"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
	throw new Error("ENV not valid!");
}

export const env = result.data;
