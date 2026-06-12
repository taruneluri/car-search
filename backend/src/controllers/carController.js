import { Car } from "../models/Car.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { memoryStore } from "../utils/memoryStore.js";
import { isDatabaseConnected } from "../config/db.js";

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const sortMap = {
  priceAsc: { startingPrice: 1 },
  priceDesc: { startingPrice: -1 },
  mileageDesc: { mileage: -1 },
  safetyDesc: { safetyRating: -1 },
  ratingDesc: { userRating: -1 },
};

const buildMongoFilter = (query) => {
  const filter = {};
  const and = [];

  ["make", "model", "fuelType", "transmission", "bodyType"].forEach((field) => {
    if (query[field]) {
      filter[field] = new RegExp(`^${escapeRegex(query[field])}$`, "i");
    }
  });

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    and.push({
      $or: [
        { make: regex },
        { model: regex },
        { name: regex },
        { variant: regex },
        { summary: regex },
        { tags: regex },
      ],
    });
  }

  if (query.variant) {
    const regex = new RegExp(escapeRegex(query.variant), "i");
    and.push({
      $or: [{ variant: regex }, { "variants.name": regex }],
    });
  }

  const minPrice = toNumber(query.minPrice);
  const maxPrice = toNumber(query.maxPrice);
  const minMileage = toNumber(query.minMileage || query.mileage);
  const minSafety = toNumber(query.safetyRating || query.minSafety);
  const seatingCapacity = toNumber(query.seatingCapacity);
  const userRating = toNumber(query.userRating);

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.startingPrice = {};
    if (minPrice !== undefined) filter.startingPrice.$gte = minPrice;
    if (maxPrice !== undefined) filter.startingPrice.$lte = maxPrice;
  }

  if (minMileage !== undefined) filter.mileage = { $gte: minMileage };
  if (minSafety !== undefined) filter.safetyRating = { $gte: minSafety };
  if (seatingCapacity !== undefined) filter.seatingCapacity = { $gte: seatingCapacity };
  if (userRating !== undefined) filter.userRating = { $gte: userRating };
  if (and.length > 0) filter.$and = and;

  return filter;
};

export const listCars = asyncHandler(async (req, res) => {
  if (isDatabaseConnected()) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 100);
    const skip = (page - 1) * limit;
    const filter = buildMongoFilter(req.query);
    const sort = sortMap[req.query.sort] || sortMap.ratingDesc;

    const [cars, total] = await Promise.all([
      Car.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Car.countDocuments(filter),
    ]);

    return res.json({
      data: cars,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  const cars = memoryStore.getCars(req.query);
  return res.json({
    data: cars,
    meta: {
      page: 1,
      limit: cars.length,
      total: cars.length,
      totalPages: 1,
    },
  });
});

export const getCarById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (isDatabaseConnected()) {
    const lookup = id.match(/^[a-f\d]{24}$/i)
      ? { $or: [{ _id: id }, { slug: id }] }
      : { slug: id };
    const car = await Car.findOne(lookup).lean();

    if (!car) throw new ApiError(404, "Car not found.");

    const reviews = await Review.find({ car: car._id, status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ...car, reviews });
  }

  const car = memoryStore.getCarById(id);
  if (!car) throw new ApiError(404, "Car not found.");

  return res.json({
    ...car,
    reviews: memoryStore.getReviews(car._id),
  });
});

export const compareCars = asyncHandler(async (req, res) => {
  const ids = String(req.query.ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    throw new ApiError(400, "At least one car id is required for comparison.");
  }

  if (isDatabaseConnected()) {
    const cars = await Car.find({ _id: { $in: ids } }).lean();
    return res.json({ data: cars });
  }

  const cars = ids.map((id) => memoryStore.getCarById(id)).filter(Boolean);
  return res.json({ data: cars });
});
