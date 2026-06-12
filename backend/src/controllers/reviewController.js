import { Car } from "../models/Car.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { isDatabaseConnected } from "../config/db.js";

export const listReviewsForCar = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  if (isDatabaseConnected()) {
    const reviews = await Review.find({ car: carId, status: "approved" })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ data: reviews });
  }

  return res.json({ data: memoryStore.getReviews(carId) });
});

export const createReview = asyncHandler(async (req, res) => {
  const carId = req.body.car;

  if (isDatabaseConnected()) {
    const car = await Car.findById(carId);
    if (!car) throw new ApiError(404, "Car not found.");

    const review = await Review.create({
      ...req.body,
      user: req.user.id,
      userName: req.user.name,
      status: "pending",
    });

    return res.status(201).json(review);
  }

  const car = memoryStore.getCarById(carId);
  if (!car) throw new ApiError(404, "Car not found.");

  const review = memoryStore.createReview({
    ...req.body,
    user: req.user.id,
    userName: req.user.name,
    status: "pending",
  });

  return res.status(201).json(review);
});
