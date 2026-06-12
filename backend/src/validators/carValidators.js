export const carSchema = {
  make: { required: true, type: "string", minLength: 2 },
  model: { required: true, type: "string", minLength: 1 },
  bodyType: { required: true, type: "string" },
  fuelType: { required: true, type: "string" },
  transmission: { required: true, type: "string" },
  seatingCapacity: { required: true, type: "number", min: 2, max: 10 },
  startingPrice: { required: true, type: "number", min: 0 },
  mileage: { required: true, type: "number", min: 0 },
  safetyRating: { required: true, type: "number", min: 0, max: 5 },
  userRating: { type: "number", min: 0, max: 5 },
};
