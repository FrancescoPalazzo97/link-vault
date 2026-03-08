import express from "express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.route.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use("/api/health", healthRouter);

async function start() {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

if (env.NODE_ENV !== "test") {
	start();
}

export { app };
