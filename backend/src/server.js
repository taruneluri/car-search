import "dotenv/config";
import cors from "cors";
import express from "express";
import serverless from "serverless-http";
import { connectDB, isDatabaseConnected } from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import filterRoutes from "./routes/filterRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import shortlistRoutes from "./routes/shortlistRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isDevelopment = process.env.NODE_ENV === "development";
      const isLocalhost = origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const normalizedOrigin = origin?.replace(/\/$/, "");
      const isAllowedPreview =
        process.env.ALLOW_VERCEL_PREVIEWS === "true" &&
        Boolean(normalizedOrigin?.endsWith(".vercel.app"));

      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(normalizedOrigin) ||
        isAllowedPreview ||
        (isDevelopment && isLocalhost)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

const statusPayload = () => ({
  status: "ok",
  database: isDatabaseConnected() ? "mongodb" : "memory",
  message: "Car research platform API is running",
});

app.get(["/health", "/api/health"], (_req, res) => {
  res.json(statusPayload());
});

app.get(["/", "/api", "/api/index", "/api/index.js"], (_req, res) => {
  res.json({
    ...statusPayload(),
    service: "CarWise Backend API",
    endpoints: {
      health: "/api/health",
      cars: "/api/cars",
      recommendations: "/api/recommendations",
      admin: "/api/admin",
    },
  });
});

app.use(async (_req, _res, next) => {
  if (process.env.MONGODB_URI && !isDatabaseConnected()) {
    await connectDB();
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/filters", filterRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/shortlist", shortlistRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

if (process.argv[1]?.endsWith("server.js")) {
  startServer();
}

export const handler = serverless(app);
export default app;
