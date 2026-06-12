import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { signToken } from "../utils/token.js";
import { isDatabaseConnected } from "../config/db.js";

const sanitizeUser = (user) => ({
  id: user._id?.toString?.() || user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  familySize: user.familySize,
  preferredBudget: user.preferredBudget,
  role: user.role || "user",
});

const authResponse = (user) => ({
  user: sanitizeUser(user),
  token: signToken({
    id: user._id?.toString?.() || user._id,
    role: user.role || "user",
  }),
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, familySize, preferredBudget } = req.body;

  if (isDatabaseConnected()) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      familySize,
      preferredBudget,
    });

    return res.status(201).json(authResponse(user));
  }

  if (memoryStore.findUserByEmail(email)) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = memoryStore.createUser({
    name,
    email,
    passwordHash,
    phone,
    familySize,
    preferredBudget,
  });

  return res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (isDatabaseConnected()) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password.");
    }

    return res.json(authResponse(user));
  }

  const user = memoryStore.findUserByEmail(email);
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  return res.json(authResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
