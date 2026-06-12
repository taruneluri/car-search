import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { memoryStore } from "../utils/memoryStore.js";
import { verifyToken } from "../utils/token.js";
import { isDatabaseConnected } from "../config/db.js";

const getBearerToken = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
};

const sanitizeAuthUser = (user) => ({
  id: user._id?.toString?.() || user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const protect = asyncHandler(async (req, _res, next) => {
  const token = getBearerToken(req);
  if (!token) {
    throw new ApiError(401, "Authentication token is required.");
  }

  const decoded = verifyToken(token);
  let account = null;

  if (isDatabaseConnected()) {
    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).lean();
    } else {
      account = await User.findById(decoded.id).lean();
    }
  } else if (decoded.role === "admin") {
    account = memoryStore.getAdminById(decoded.id);
  } else {
    account = memoryStore.findUserById(decoded.id);
  }

  if (!account) {
    throw new ApiError(401, "Authenticated account was not found.");
  }

  req.user = sanitizeAuthUser(account);
  next();
});

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    return next(new ApiError(403, "Admin access is required."));
  }
  return next();
};

export const userOnly = (req, _res, next) => {
  if (req.user?.role !== "user") {
    return next(new ApiError(403, "User access is required."));
  }
  return next();
};
