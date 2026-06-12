const asNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePreference = (value) => String(value || "").trim().toLowerCase();

const priorityMultiplier = (priority) => {
  const value = normalizePreference(priority);
  if (value === "high") return 1.4;
  if (value === "low") return 0.65;
  return 1;
};

const includesFeature = (car, preference) => {
  const needle = normalizePreference(preference);
  if (!needle || needle === "any") return true;

  const haystack = [
    ...(car.tags || []),
    ...(car.specs?.keyFeatures || []),
    ...(car.variants || []).flatMap((variant) => variant.features || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
};

const usageScore = (car, dailyUsage) => {
  const usage = normalizePreference(dailyUsage);
  const body = normalizePreference(car.bodyType);
  const transmission = normalizePreference(car.transmission);
  const tags = (car.tags || []).map(normalizePreference);

  if (!usage || usage === "mixed") {
    return { points: 8, reason: "Balanced for mixed usage" };
  }

  if (usage === "city") {
    let points = 5;
    if (["hatchback", "sedan"].includes(body)) points += 3;
    if (transmission === "automatic") points += 2;
    if (tags.includes("city")) points += 2;
    return { points: Math.min(points, 12), reason: "Easy fit for city use" };
  }

  if (usage === "highway" || usage === "long trips") {
    let points = 5;
    if (["suv", "sedan", "mpv"].includes(body)) points += 3;
    if (asNumber(car.safetyRating) >= 4) points += 2;
    if (tags.includes("highway")) points += 2;
    return { points: Math.min(points, 12), reason: "Comfortable for highway use" };
  }

  return { points: 6, reason: "Reasonable fit for your usage" };
};

const familyScore = (car, familySize) => {
  const seats = asNumber(car.seatingCapacity);
  const family = asNumber(familySize, 5);

  if (seats >= family) {
    const points = family >= 6 && seats >= 7 ? 14 : 11;
    return { points, reason: `${seats} seats suit your family size` };
  }

  return { points: 0, reason: `${seats} seats may feel tight for your family` };
};

const budgetScore = (car, budget) => {
  const maxBudget = asNumber(budget);
  const price = asNumber(car.startingPrice || car.priceRange?.min);

  if (!maxBudget) {
    return { points: 15, reason: "No strict budget was applied" };
  }

  if (price <= maxBudget) {
    const valueFit = Math.max(0, 1 - price / maxBudget);
    return {
      points: 24 + valueFit * 6,
      reason: "Fits inside your budget",
    };
  }

  const overBy = (price - maxBudget) / maxBudget;
  if (overBy <= 0.1) {
    return {
      points: 12,
      reason: "Slightly above budget but worth considering",
    };
  }

  return { points: 0, reason: "Above your stated budget" };
};

export const rankCars = (cars, preferences = {}) => {
  const mileageWeight = priorityMultiplier(preferences.mileagePriority);
  const safetyWeight = priorityMultiplier(preferences.safetyPriority);
  const featurePreference = preferences.featurePreference;
  const fuelPreference = normalizePreference(preferences.fuelPreference);
  const minUserRating = asNumber(preferences.minUserRating, 0);

  return cars
    .map((car) => {
      const reasons = [];
      let score = 0;

      const budget = budgetScore(car, preferences.budget || preferences.maxBudget);
      score += budget.points;
      reasons.push(budget.reason);

      const mileagePoints =
        Math.min(asNumber(car.mileage), normalizePreference(car.fuelType) === "electric" ? 250 : 25) /
        (normalizePreference(car.fuelType) === "electric" ? 250 : 25) *
        18 *
        mileageWeight;
      score += mileagePoints;
      if (mileagePoints >= 12) reasons.push("Strong efficiency for running costs");

      const safetyPoints = (asNumber(car.safetyRating) / 5) * 18 * safetyWeight;
      score += safetyPoints;
      if (asNumber(car.safetyRating) >= 4) reasons.push("High safety rating");

      const reviewPoints = (asNumber(car.userRating) / 5) * 12;
      score += reviewPoints;
      if (asNumber(car.userRating) >= Math.max(4, minUserRating)) {
        reasons.push("Owners rate it highly");
      }

      const family = familyScore(car, preferences.familySize);
      score += family.points;
      reasons.push(family.reason);

      if (!fuelPreference || fuelPreference === "any") {
        score += 7;
      } else if (normalizePreference(car.fuelType) === fuelPreference) {
        score += 10;
        reasons.push(`Matches your ${car.fuelType} preference`);
      }

      const usage = usageScore(car, preferences.dailyUsage);
      score += usage.points;
      reasons.push(usage.reason);

      if (includesFeature(car, featurePreference)) {
        score += 7;
        if (featurePreference && normalizePreference(featurePreference) !== "any") {
          reasons.push(`Includes your ${featurePreference} preference`);
        }
      }

      if (minUserRating && asNumber(car.userRating) < minUserRating) {
        score -= 12;
        reasons.push("Owner rating is below your preference");
      }

      const cappedScore = Math.max(0, Math.min(100, Math.round(score)));

      return {
        car,
        score: cappedScore,
        matchPercentage: cappedScore,
        reasons: [...new Set(reasons)].slice(0, 5),
      };
    })
    .sort((a, b) => b.score - a.score);
};
