import { Router } from "express";
import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";
import { protect, userOnly } from "../middleware/auth.js";

const router = Router();

router.use(protect, userOnly);
router.get("/", listFavorites);
router.post("/", addFavorite);
router.delete("/:carId", removeFavorite);

export default router;
