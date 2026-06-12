import { Router } from "express";
import { compareCars, getCarById, listCars } from "../controllers/carController.js";

const router = Router();

router.get("/", listCars);
router.get("/compare", compareCars);
router.get("/:id", getCarById);

export default router;
