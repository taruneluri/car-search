import { Variant } from "../models/Variant.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { isDatabaseConnected } from "../config/db.js";

export const listVariants = asyncHandler(async (req, res) => {
  const { carId } = req.query;

  if (isDatabaseConnected()) {
    const filter = carId ? { car: carId } : {};
    const variants = await Variant.find(filter).populate("car", "make model name").lean();
    return res.json({ data: variants });
  }

  if (carId) {
    const car = memoryStore.getCarById(carId);
    return res.json({ data: car?.variants || [] });
  }

  const variants = memoryStore
    .getCars({})
    .flatMap((car) => (car.variants || []).map((variant) => ({ ...variant, car: car._id })));

  return res.json({ data: variants });
});

export const createVariant = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const car = memoryStore.getCarById(req.body.car);
    if (!car) throw new ApiError(404, "Car not found.");
    const variant = { ...req.body, _id: `variant-${Date.now()}` };
    car.variants = [variant, ...(car.variants || [])];
    return res.status(201).json(variant);
  }

  const variant = await Variant.create(req.body);
  return res.status(201).json(variant);
});

export const updateVariant = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    throw new ApiError(501, "Variant updates require MongoDB in this demo.");
  }

  const variant = await Variant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!variant) throw new ApiError(404, "Variant not found.");
  return res.json(variant);
});

export const deleteVariant = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    throw new ApiError(501, "Variant deletion requires MongoDB in this demo.");
  }

  const variant = await Variant.findByIdAndDelete(req.params.id);
  if (!variant) throw new ApiError(404, "Variant not found.");
  return res.json({ success: true });
});
