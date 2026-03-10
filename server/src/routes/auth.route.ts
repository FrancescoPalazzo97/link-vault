import { loginSchema } from "@link-vault/shared";
import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

export default router;
