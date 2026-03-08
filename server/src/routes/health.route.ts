import { Router } from "express";
import { getDBStatus } from "../config/db.js";

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		status: "ok",
		db: getDBStatus(),
	});
});

export default router;
