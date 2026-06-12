import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelType: String,
    transmission: String,
    mileage: Number,
    engine: String,
    features: [String],
    specs: {
      power: String,
      torque: String,
      drivetrain: String,
    },
  },
  { timestamps: true },
);

export const Variant = mongoose.model("Variant", variantSchema);
