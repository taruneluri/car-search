import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { Car } from "../models/Car.js";
import { Favorite } from "../models/Favorite.js";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { signToken } from "../utils/token.js";
import { isDatabaseConnected } from "../config/db.js";

const sanitizeAdmin = (admin) => ({
  id: admin._id?.toString?.() || admin._id,
  name: admin.name,
  email: admin.email,
  role: "admin",
});

const adminAuthResponse = (admin) => ({
  admin: sanitizeAdmin(admin),
  token: signToken({
    id: admin._id?.toString?.() || admin._id,
    role: "admin",
  }),
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (isDatabaseConnected()) {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      throw new ApiError(401, "Invalid admin credentials.");
    }

    return res.json(adminAuthResponse(admin));
  }

  const admin = memoryStore.getAdminByEmail(email);
  const passwordMatches = admin?.passwordHash
    ? await bcrypt.compare(password, admin.passwordHash)
    : password === admin?.password;

  if (!admin || !passwordMatches) {
    throw new ApiError(401, "Invalid admin credentials.");
  }

  return res.json(adminAuthResponse(admin));
});

export const getDashboardStats = asyncHandler(async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(memoryStore.getStats());
  }

  const [totalCars, totalUsers, totalReviews, totalShortlists] = await Promise.all([
    Car.countDocuments(),
    User.countDocuments(),
    Review.countDocuments(),
    Favorite.countDocuments(),
  ]);

  return res.json({
    totalCars,
    totalUsers,
    totalReviews,
    totalShortlists,
  });
});

export const listAdminCars = asyncHandler(async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json({ data: memoryStore.getCars({}) });
  }

  const cars = await Car.find({}).sort({ updatedAt: -1 }).lean();
  return res.json({ data: cars });
});

export const getAdminCar = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const car = memoryStore.getCarById(req.params.id);
    if (!car) throw new ApiError(404, "Car not found.");
    return res.json(car);
  }

  const car = await Car.findById(req.params.id).lean();
  if (!car) throw new ApiError(404, "Car not found.");
  return res.json(car);
});

export const createAdminCar = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.status(201).json(memoryStore.createCar(req.body));
  }

  const car = await Car.create(req.body);
  return res.status(201).json(car);
});

export const updateAdminCar = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const car = memoryStore.updateCar(req.params.id, req.body);
    if (!car) throw new ApiError(404, "Car not found.");
    return res.json(car);
  }

  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!car) throw new ApiError(404, "Car not found.");
  return res.json(car);
});

export const deleteAdminCar = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const deleted = memoryStore.deleteCar(req.params.id);
    if (!deleted) throw new ApiError(404, "Car not found.");
    return res.json({ success: true });
  }

  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) throw new ApiError(404, "Car not found.");
  await Promise.all([
    Review.deleteMany({ car: req.params.id }),
    Favorite.deleteMany({ car: req.params.id }),
  ]);
  return res.json({ success: true });
});

export const listAdminReviews = asyncHandler(async (_req, res) => {
  if (!isDatabaseConnected()) {
    return res.json({ data: memoryStore.getAllReviews() });
  }

  const reviews = await Review.find({})
    .populate("car", "make model name")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({ data: reviews });
});

export const updateAdminReview = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const review = memoryStore.updateReview(req.params.id, req.body);
    if (!review) throw new ApiError(404, "Review not found.");
    return res.json(review);
  }

  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) throw new ApiError(404, "Review not found.");
  return res.json(review);
});

export const deleteAdminReview = asyncHandler(async (req, res) => {
  if (!isDatabaseConnected()) {
    const deleted = memoryStore.deleteReview(req.params.id);
    if (!deleted) throw new ApiError(404, "Review not found.");
    return res.json({ success: true });
  }

  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, "Review not found.");
  return res.json({ success: true });
});
