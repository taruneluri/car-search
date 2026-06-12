import { Router } from "express";
import {
  adminLogin,
  createAdminCar,
  deleteAdminCar,
  deleteAdminReview,
  getAdminCar,
  getDashboardStats,
  listAdminCars,
  listAdminReviews,
  updateAdminCar,
  updateAdminReview,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema } from "../validators/authValidators.js";
import { carSchema } from "../validators/carValidators.js";

const router = Router();

router.post("/login", validate(adminLoginSchema), adminLogin);

router.use(protect, adminOnly);
router.get("/dashboard", getDashboardStats);
router.get("/cars", listAdminCars);
router.post("/cars", validate(carSchema), createAdminCar);
router.get("/cars/:id", getAdminCar);
router.put("/cars/:id", updateAdminCar);
router.delete("/cars/:id", deleteAdminCar);
router.get("/reviews", listAdminReviews);
router.put("/reviews/:id", updateAdminReview);
router.delete("/reviews/:id", deleteAdminReview);

export default router;
