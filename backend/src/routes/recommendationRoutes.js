import { Router } from "express";
import {
  generateRecommendations,
  getRecommendationQuestions,
} from "../controllers/recommendationController.js";
import { validate } from "../middleware/validate.js";
import { recommendationSchema } from "../validators/recommendationValidators.js";

const router = Router();

router.get("/questions", getRecommendationQuestions);
router.post("/", validate(recommendationSchema), generateRecommendations);

export default router;
