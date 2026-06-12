import { sampleAdmin, sampleCars, sampleReviews } from "./sampleData.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
const now = () => new Date().toISOString();
const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
const normalize = (value) => String(value || "").trim().toLowerCase();

let cars = clone(sampleCars);
let reviews = clone(sampleReviews);
let users = [];
let favorites = [];

const numberOrUndefined = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const sortCars = (items, sort) => {
  const data = [...items];

  if (sort === "priceAsc") return data.sort((a, b) => a.startingPrice - b.startingPrice);
  if (sort === "priceDesc") return data.sort((a, b) => b.startingPrice - a.startingPrice);
  if (sort === "mileageDesc") return data.sort((a, b) => b.mileage - a.mileage);
  if (sort === "safetyDesc") return data.sort((a, b) => b.safetyRating - a.safetyRating);
  if (sort === "ratingDesc") return data.sort((a, b) => b.userRating - a.userRating);

  return data.sort((a, b) => b.userRating - a.userRating);
};

const carMatchesFilters = (car, filters = {}) => {
  const search = normalize(filters.search);
  const minPrice = numberOrUndefined(filters.minPrice);
  const maxPrice = numberOrUndefined(filters.maxPrice);
  const minMileage = numberOrUndefined(filters.minMileage || filters.mileage);
  const minSafety = numberOrUndefined(filters.safetyRating || filters.minSafety);
  const seats = numberOrUndefined(filters.seatingCapacity);
  const minUserRating = numberOrUndefined(filters.userRating);

  const text = [
    car.make,
    car.model,
    car.name,
    car.variant,
    car.summary,
    ...(car.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  if (search && !text.includes(search)) return false;
  if (filters.make && normalize(car.make) !== normalize(filters.make)) return false;
  if (filters.model && normalize(car.model) !== normalize(filters.model)) return false;
  if (
    filters.variant &&
    !normalize(car.variant).includes(normalize(filters.variant)) &&
    !(car.variants || []).some((variant) => normalize(variant.name).includes(normalize(filters.variant)))
  ) {
    return false;
  }
  if (filters.fuelType && normalize(car.fuelType) !== normalize(filters.fuelType)) return false;
  if (filters.transmission && normalize(car.transmission) !== normalize(filters.transmission)) return false;
  if (filters.bodyType && normalize(car.bodyType) !== normalize(filters.bodyType)) return false;
  if (minPrice !== undefined && car.startingPrice < minPrice) return false;
  if (maxPrice !== undefined && car.startingPrice > maxPrice) return false;
  if (minMileage !== undefined && car.mileage < minMileage) return false;
  if (minSafety !== undefined && car.safetyRating < minSafety) return false;
  if (seats !== undefined && car.seatingCapacity < seats) return false;
  if (minUserRating !== undefined && car.userRating < minUserRating) return false;

  return true;
};

const getFilterOptions = () => {
  const unique = (field) => [...new Set(cars.map((car) => car[field]).filter(Boolean))].sort();
  const variants = [
    ...new Set(cars.flatMap((car) => (car.variants || []).map((variant) => variant.name))),
  ].sort();
  const prices = cars.map((car) => car.startingPrice);
  const mileages = cars.map((car) => car.mileage);

  return {
    makes: unique("make"),
    models: unique("model"),
    variants,
    fuelTypes: unique("fuelType"),
    transmissions: unique("transmission"),
    bodyTypes: unique("bodyType"),
    seatingCapacities: unique("seatingCapacity"),
    safetyRatings: [1, 2, 3, 4, 5],
    userRatings: [1, 2, 3, 4, 5],
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    mileageRange: {
      min: Math.min(...mileages),
      max: Math.max(...mileages),
    },
  };
};

export const memoryStore = {
  getCars(filters = {}) {
    return sortCars(cars.filter((car) => carMatchesFilters(car, filters)), filters.sort);
  },
  getCarById(id) {
    return cars.find((car) => car._id === id || car.slug === id);
  },
  createCar(payload) {
    const car = {
      ...payload,
      _id: createId("car"),
      createdAt: now(),
      updatedAt: now(),
    };
    cars.unshift(car);
    return car;
  },
  updateCar(id, payload) {
    const index = cars.findIndex((car) => car._id === id);
    if (index === -1) return null;
    cars[index] = { ...cars[index], ...payload, updatedAt: now() };
    return cars[index];
  },
  deleteCar(id) {
    const existing = this.getCarById(id);
    if (!existing) return false;
    cars = cars.filter((car) => car._id !== existing._id);
    reviews = reviews.filter((review) => review.car !== existing._id);
    favorites = favorites.filter((favorite) => favorite.car !== existing._id);
    return true;
  },
  getFilters: getFilterOptions,
  getReviews(carId, includePending = false) {
    return reviews.filter(
      (review) =>
        review.car === carId && (includePending || review.status === "approved"),
    );
  },
  getAllReviews() {
    return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  createReview(payload) {
    const review = {
      ...payload,
      _id: createId("review"),
      status: payload.status || "pending",
      createdAt: now(),
      updatedAt: now(),
    };
    reviews.unshift(review);
    return review;
  },
  updateReview(id, payload) {
    const index = reviews.findIndex((review) => review._id === id);
    if (index === -1) return null;
    reviews[index] = { ...reviews[index], ...payload, updatedAt: now() };
    return reviews[index];
  },
  deleteReview(id) {
    const before = reviews.length;
    reviews = reviews.filter((review) => review._id !== id);
    return reviews.length !== before;
  },
  findUserByEmail(email) {
    return users.find((user) => normalize(user.email) === normalize(email));
  },
  findUserById(id) {
    return users.find((user) => user._id === id);
  },
  createUser(payload) {
    const user = {
      ...payload,
      _id: createId("user"),
      role: "user",
      createdAt: now(),
    };
    users.push(user);
    return user;
  },
  getAdminByEmail(email) {
    return normalize(sampleAdmin.email) === normalize(email) ? sampleAdmin : null;
  },
  getAdminById(id) {
    return id === sampleAdmin._id ? sampleAdmin : null;
  },
  addFavorite(userId, carId, notes = "") {
    const existing = favorites.find(
      (favorite) => favorite.user === userId && favorite.car === carId,
    );
    if (existing) return existing;

    const favorite = {
      _id: createId("favorite"),
      user: userId,
      car: carId,
      notes,
      createdAt: now(),
    };
    favorites.push(favorite);
    return favorite;
  },
  removeFavorite(userId, carId) {
    const before = favorites.length;
    favorites = favorites.filter(
      (favorite) => !(favorite.user === userId && favorite.car === carId),
    );
    return favorites.length !== before;
  },
  getFavorites(userId) {
    return favorites
      .filter((favorite) => favorite.user === userId)
      .map((favorite) => ({
        ...favorite,
        car: this.getCarById(favorite.car),
      }))
      .filter((favorite) => favorite.car);
  },
  getStats() {
    return {
      totalCars: cars.length,
      totalUsers: users.length,
      totalReviews: reviews.length,
      totalShortlists: favorites.length,
    };
  },
};

export const memoryCars = cars;
