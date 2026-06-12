import mongoose from "mongoose";
import dns from "dns";

if (process.env.USE_CUSTOM_DNS === "true") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
  } catch (error) {
    console.warn("Could not set custom DNS servers for SRV resolution:", error.message);
  }
}

let databaseReady = false;
let connectionPromise = null;
let lastConnectionAttemptAt = 0;

const retryAfterMs = () => Number(process.env.MONGODB_RETRY_AFTER_MS) || 30000;

export const connectDB = async () => {
  if (databaseReady && mongoose.connection.readyState === 1) {
    return true;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. API will use in-memory demo data.");
    return false;
  }

  connectionPromise = mongoose
    .connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 8000,
      connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS) || 8000,
      socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS) || 12000,
    })
    .then((connection) => {
      databaseReady = true;
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return true;
    })
    .catch((error) => {
      databaseReady = false;
      connectionPromise = null;
      console.error(`MongoDB connection failed: ${error.message}`);
      return false;
    });

  return connectionPromise;
};

export const warmDBConnection = () => {
  if (!process.env.MONGODB_URI || isDatabaseConnected() || connectionPromise) {
    return;
  }

  const now = Date.now();
  if (now - lastConnectionAttemptAt < retryAfterMs()) {
    return;
  }

  lastConnectionAttemptAt = now;
  void connectDB();
};

mongoose.connection.on("disconnected", () => {
  databaseReady = false;
  connectionPromise = null;
});

export const isDatabaseConnected = () =>
  databaseReady && mongoose.connection.readyState === 1;

export const isDatabaseConnecting = () =>
  Boolean(connectionPromise) || mongoose.connection.readyState === 2;

export const dbStatus = isDatabaseConnected;
