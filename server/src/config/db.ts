import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<void> {
	await mongoose.connect(env.MONGO_URI);
}

export function getDBStatus(): "connected" | "disconnected" {
	return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}
