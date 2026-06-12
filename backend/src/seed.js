import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Car } from "./models/Car.js";
import { Review } from "./models/Review.js";
import { Admin } from "./models/Admin.js";
import { Variant } from "./models/Variant.js";
import { Favorite } from "./models/Favorite.js";
import { User } from "./models/User.js";
import { sampleCars, sampleReviews, sampleAdmin } from "./utils/sampleData.js";

const seed = async () => {
  try {
    console.log("Connecting to database...");
    const connected = await connectDB();
    if (!connected) {
      console.error("Database connection failed. Make sure MONGODB_URI is correct.");
      process.exit(1);
    }

    console.log("Clearing existing database collections...");
    await Promise.all([
      Car.deleteMany({}),
      Review.deleteMany({}),
      Admin.deleteMany({}),
      Variant.deleteMany({}),
      Favorite.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("Collections cleared successfully.");

    console.log("Generating ObjectIds for sample cars...");
    const carIdMap = {};
    const carsToInsert = sampleCars.map((car) => {
      const newId = new mongoose.Types.ObjectId();
      carIdMap[car._id] = newId;

      const cloned = { ...car };
      cloned._id = newId;
      
      // Remove string _id from subdocument variants to avoid validation CastError
      if (cloned.variants && Array.isArray(cloned.variants)) {
        cloned.variants = cloned.variants.map((v) => {
          const vCloned = { ...v };
          delete vCloned._id;
          return vCloned;
        });
      }
      return cloned;
    });

    console.log("Inserting cars...");
    await Car.insertMany(carsToInsert);
    console.log(`Successfully inserted ${carsToInsert.length} cars.`);

    console.log("Generating Variant documents...");
    const variantsToInsert = [];
    carsToInsert.forEach((car) => {
      if (car.variants && Array.isArray(car.variants)) {
        car.variants.forEach((variant) => {
          variantsToInsert.push({
            car: car._id,
            name: variant.name,
            price: variant.price,
            fuelType: variant.fuelType,
            transmission: variant.transmission,
            mileage: variant.mileage,
            engine: variant.engine,
            features: variant.features,
            specs: variant.specs,
          });
        });
      }
    });

    console.log("Inserting variants...");
    await Variant.insertMany(variantsToInsert);
    console.log(`Successfully inserted ${variantsToInsert.length} variants.`);

    console.log("Mapping reviews to new car ObjectIds...");
    const reviewsToInsert = sampleReviews.map((review) => {
      const cloned = { ...review };
      delete cloned._id; // Let mongoose generate ObjectId
      cloned.car = carIdMap[review.car];
      if (!cloned.car) {
        console.warn(`Warning: Review car "${review.car}" not found in sampleCars.`);
      }
      return cloned;
    });

    console.log("Inserting reviews...");
    await Review.insertMany(reviewsToInsert);
    console.log(`Successfully inserted ${reviewsToInsert.length} reviews.`);

    console.log("Inserting sample admin...");
    const adminData = { ...sampleAdmin };
    delete adminData._id; // Let mongoose generate ObjectId
    const admin = new Admin(adminData);
    await admin.save();
    console.log(`Successfully created admin user: ${adminData.email}`);

    console.log("\nDatabase seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
