import { Router } from "express";
import { authGuard } from "../middleware/auth.js";
import authRouter from "./auth.route.js";
import healthRouter from "./health.route.js";
import linkRouter from "./link.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);

router.use("/links", authGuard, linkRouter);

export default router;
