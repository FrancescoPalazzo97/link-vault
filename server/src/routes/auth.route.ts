import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

export default router;
