import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const SESSION_KEY = "carwise_session";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

const unwrap = (response) => response.data;

export const carService = {
  async getCars(params = {}) {
    return unwrap(await api.get("/cars", { params }));
  },
  async getCar(id) {
    return unwrap(await api.get(`/cars/${id}`));
  },
  async compareCars(ids) {
    return unwrap(await api.get("/cars/compare", { params: { ids: ids.join(",") } }));
  },
  async getFilters() {
    return unwrap(await api.get("/filters"));
  },
};

export const recommendationService = {
  async recommend(preferences) {
    return unwrap(await api.post("/recommendations", preferences));
  },
};

export const authService = {
  async register(payload) {
    return unwrap(await api.post("/auth/register", payload));
  },
  async login(payload) {
    return unwrap(await api.post("/auth/login", payload));
  },
  async me() {
    return unwrap(await api.get("/auth/me"));
  },
  async adminLogin(payload) {
    return unwrap(await api.post("/admin/login", payload));
  },
};

export const favoriteService = {
  async list() {
    return unwrap(await api.get("/favorites"));
  },
  async add(carId, notes = "") {
    return unwrap(await api.post("/favorites", { carId, notes }));
  },
  async remove(carId) {
    return unwrap(await api.delete(`/favorites/${carId}`));
  },
};

export const reviewService = {
  async listForCar(carId) {
    return unwrap(await api.get(`/reviews/car/${carId}`));
  },
  async create(payload) {
    return unwrap(await api.post("/reviews", payload));
  },
};

export const adminService = {
  async dashboard() {
    return unwrap(await api.get("/admin/dashboard"));
  },
  async listCars() {
    return unwrap(await api.get("/admin/cars"));
  },
  async getCar(id) {
    return unwrap(await api.get(`/admin/cars/${id}`));
  },
  async createCar(payload) {
    return unwrap(await api.post("/admin/cars", payload));
  },
  async updateCar(id, payload) {
    return unwrap(await api.put(`/admin/cars/${id}`, payload));
  },
  async deleteCar(id) {
    return unwrap(await api.delete(`/admin/cars/${id}`));
  },
  async listReviews() {
    return unwrap(await api.get("/admin/reviews"));
  },
  async updateReview(id, payload) {
    return unwrap(await api.put(`/admin/reviews/${id}`, payload));
  },
  async deleteReview(id) {
    return unwrap(await api.delete(`/admin/reviews/${id}`));
  },
};

export { SESSION_KEY };
