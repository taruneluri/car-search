import { Router } from "express";
import { createReview, listReviewsForCar } from "../controllers/reviewController.js";
import { protect, userOnly } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reviewSchema } from "../validators/reviewValidators.js";

const router = Router();

router.get("/car/:carId", listReviewsForCar);
router.post("/", protect, userOnly, validate(reviewSchema), createReview);

export default router;
