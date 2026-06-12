import { ApiError } from "../utils/apiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id." });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value already exists.",
      fields: Object.keys(error.keyValue || {}),
    });
  }

  return res.status(statusCode).json({
    message: error.message || "Internal server error",
    errors: error.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};
