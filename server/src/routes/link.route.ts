import { createLinkSchema, updateLinkSchema } from "@link-vault/shared";
import { Router } from "express";
import { linkController } from "../controllers/link.controller.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/preview", linkController.preview);
router.get("/tags", linkController.getTags);
router.get("/categories", linkController.getCategories);

router.get("/", linkController.getAll);
router.get("/:id", linkController.getById);
router.post("/", validate(createLinkSchema), linkController.create);
router.patch("/:id", validate(updateLinkSchema), linkController.update);
router.delete("/:id", linkController.remove);

export default router;
