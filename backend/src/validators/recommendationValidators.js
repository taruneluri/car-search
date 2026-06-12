export const recommendationSchema = {
  budget: { required: true, type: "number", min: 0 },
  familySize: { required: true, type: "number", min: 1, max: 10 },
};
