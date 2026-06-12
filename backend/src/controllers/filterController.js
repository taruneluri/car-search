import { Car } from "../models/Car.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { isDatabaseConnected } from "../config/db.js";

export const getFilters = asyncHandler(async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(memoryStore.getFilters());
  }

  const cars = await Car.find({}).select(
    "make model variants fuelType transmission bodyType seatingCapacity startingPrice mileage",
  );

  const unique = (values) => [...new Set(values.filter(Boolean))].sort();
  const prices = cars.map((car) => car.startingPrice).filter(Number.isFinite);
  const mileages = cars.map((car) => car.mileage).filter(Number.isFinite);

  return res.json({
    makes: unique(cars.map((car) => car.make)),
    models: unique(cars.map((car) => car.model)),
    variants: unique(cars.flatMap((car) => (car.variants || []).map((variant) => variant.name))),
    fuelTypes: unique(cars.map((car) => car.fuelType)),
    transmissions: unique(cars.map((car) => car.transmission)),
    bodyTypes: unique(cars.map((car) => car.bodyType)),
    seatingCapacities: unique(cars.map((car) => car.seatingCapacity)),
    safetyRatings: [1, 2, 3, 4, 5],
    userRatings: [1, 2, 3, 4, 5],
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    mileageRange: {
      min: mileages.length ? Math.min(...mileages) : 0,
      max: mileages.length ? Math.max(...mileages) : 0,
    },
  });
});
