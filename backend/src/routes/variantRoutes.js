import { Router } from "express";
import {
  createVariant,
  deleteVariant,
  listVariants,
  updateVariant,
} from "../controllers/variantController.js";
import { adminOnly, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listVariants);
router.post("/", protect, adminOnly, createVariant);
router.put("/:id", protect, adminOnly, updateVariant);
router.delete("/:id", protect, adminOnly, deleteVariant);

export default router;
