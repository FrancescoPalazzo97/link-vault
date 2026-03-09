import express from "express";
import { pinoHttp } from "pino-http";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/health.route.js";
import linkRouter from "./routes/link.route.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/api/health", healthRouter);
app.use("/api/links", linkRouter);

app.use(errorHandler);

async function start() {
	await connectDB();
	app.listen(PORT, () => {
		logger.info(`Server running on port ${PORT}`);
	});
}

if (env.NODE_ENV !== "test") {
	start();
}

export { app };
