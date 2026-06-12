import mongoose from "mongoose";

const variantSubSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

const specsSchema = new mongoose.Schema(
  {
    engine: String,
    power: String,
    torque: String,
    drivetrain: String,
    bootSpace: String,
    groundClearance: String,
    airbags: Number,
    infotainment: String,
    keyFeatures: [String],
  },
  { _id: false },
);

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
    },
    summary: String,
    bodyType: {
      type: String,
      required: true,
      index: true,
    },
    fuelType: {
      type: String,
      required: true,
      index: true,
    },
    transmission: {
      type: String,
      required: true,
      index: true,
    },
    seatingCapacity: {
      type: Number,
      required: true,
      min: 2,
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    priceRange: {
      min: Number,
      max: Number,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    safetyRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true,
    },
    userRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    images: [String],
    specs: specsSchema,
    pros: [String],
    cons: [String],
    tags: [String],
    variants: [variantSubSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

carSchema.pre("validate", function normalizeCar(next) {
  if (!this.name) {
    this.name = `${this.make} ${this.model}`;
  }

  if (!this.slug) {
    this.slug = slugify(`${this.make}-${this.model}-${this.variant || ""}`);
  }

  const variantPrices = (this.variants || [])
    .map((variant) => variant.price)
    .filter((price) => Number.isFinite(price));

  if (variantPrices.length > 0) {
    this.priceRange = {
      min: Math.min(...variantPrices),
      max: Math.max(...variantPrices),
    };
    this.startingPrice = this.priceRange.min;
  } else if (!this.priceRange?.min || !this.priceRange?.max) {
    this.priceRange = {
      min: this.startingPrice,
      max: this.startingPrice,
    };
  }

  next();
});

carSchema.index({
  make: "text",
  model: "text",
  name: "text",
  summary: "text",
  tags: "text",
});

export const Car = mongoose.model("Car", carSchema);
