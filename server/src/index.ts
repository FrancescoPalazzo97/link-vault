import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { openApiDocument } from "./config/openapi.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import apiRouter from "./routes/api.route.js";

const app = express();
const PORT = env.PORT;

app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api", globalLimiter, apiRouter);

app.use(notFoundHandler);
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
