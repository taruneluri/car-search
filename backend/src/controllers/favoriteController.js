import { Favorite } from "../models/Favorite.js";
import { Car } from "../models/Car.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { isDatabaseConnected } from "../config/db.js";

export const listFavorites = asyncHandler(async (req, res) => {
  if (isDatabaseConnected()) {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate("car")
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ data: favorites });
  }

  return res.json({ data: memoryStore.getFavorites(req.user.id) });
});

export const addFavorite = asyncHandler(async (req, res) => {
  const { carId, notes } = req.body;
  if (!carId) throw new ApiError(400, "carId is required.");

  if (isDatabaseConnected()) {
    const car = await Car.findById(carId);
    if (!car) throw new ApiError(404, "Car not found.");

    const favorite = await Favorite.findOneAndUpdate(
      { user: req.user.id, car: carId },
      { notes },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).populate("car");

    return res.status(201).json(favorite);
  }

  if (!memoryStore.getCarById(carId)) throw new ApiError(404, "Car not found.");
  const favorite = memoryStore.addFavorite(req.user.id, carId, notes);
  return res.status(201).json(favorite);
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  if (isDatabaseConnected()) {
    const deleted = await Favorite.findOneAndDelete({
      user: req.user.id,
      car: carId,
    });

    if (!deleted) throw new ApiError(404, "Favorite not found.");
    return res.json({ success: true });
  }

  const removed = memoryStore.removeFavorite(req.user.id, carId);
  if (!removed) throw new ApiError(404, "Favorite not found.");

  return res.json({ success: true });
});
