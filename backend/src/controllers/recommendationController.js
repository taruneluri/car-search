import { Car } from "../models/Car.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { rankCars } from "../utils/recommendationEngine.js";
import { isDatabaseConnected } from "../config/db.js";

export const getRecommendationQuestions = asyncHandler(async (_req, res) => {
  res.json({
    budget: "What is your maximum on-road budget?",
    familySize: "How many people usually travel together?",
    dailyUsage: "Where will the car be used most?",
    fuelPreference: "Do you prefer petrol, diesel, hybrid, or electric?",
    mileagePriority: "How important is mileage?",
    safetyPriority: "How important is safety?",
    featurePreference: "Which feature matters most?",
    minUserRating: "Minimum owner rating you are comfortable with",
  });
});

export const generateRecommendations = asyncHandler(async (req, res) => {
  const cars = isDatabaseConnected()
    ? await Car.find({}).lean()
    : memoryStore.getCars({});

  const ranked = rankCars(cars, req.body).slice(0, Number(req.body.limit) || 5);

  res.json({
    preferences: req.body,
    totalConsidered: cars.length,
    shortlist: ranked,
  });
});
