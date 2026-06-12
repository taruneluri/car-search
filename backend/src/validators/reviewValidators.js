export const reviewSchema = {
  car: { required: true, type: "string" },
  rating: { required: true, type: "number", min: 1, max: 5 },
  comment: { required: true, type: "string", minLength: 10 },
};
