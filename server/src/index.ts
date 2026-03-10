import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { authGuard } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.route.js";
import healthRouter from "./routes/health.route.js";
import linkRouter from "./routes/link.route.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
});

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use("/api", globalLimiter);
app.use("/api/auth/login", loginLimiter);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.use("/api/links", authGuard, linkRouter);

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
