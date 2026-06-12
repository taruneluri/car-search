import mongoose from "mongoose";
import dns from "dns";

// Fix for querySrv ECONNREFUSED issues on certain Windows environments and ISPs (e.g. Reliance Jio)
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
} catch (error) {
  console.warn("Could not set custom DNS servers for SRV resolution:", error.message);
}

let databaseReady = false;
let connectionPromise = null;

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

mongoose.connection.on("disconnected", () => {
  databaseReady = false;
  connectionPromise = null;
});

export const isDatabaseConnected = () =>
  databaseReady && mongoose.connection.readyState === 1;

export const dbStatus = isDatabaseConnected;
