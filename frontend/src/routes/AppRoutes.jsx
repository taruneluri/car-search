import { Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import AdminCarFormPage from "../pages/AdminCarFormPage.jsx";
import AdminCarsManagementPage from "../pages/AdminCarsManagementPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import AdminReviewsManagementPage from "../pages/AdminReviewsManagementPage.jsx";
import CarDetailsPage from "../pages/CarDetailsPage.jsx";
import ComparePage from "../pages/ComparePage.jsx";
import FavoritesPage from "../pages/FavoritesPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import ListingsPage from "../pages/ListingsPage.jsx";
import LoginRegisterPage from "../pages/LoginRegisterPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import QuestionnairePage from "../pages/QuestionnairePage.jsx";
import RecommendationsPage from "../pages/RecommendationsPage.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<ListingsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/shortlist" element={<FavoritesPage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/finder" element={<QuestionnairePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cars"
          element={
            <ProtectedAdminRoute>
              <AdminCarsManagementPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cars/new"
          element={
            <ProtectedAdminRoute>
              <AdminCarFormPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/cars/:id"
          element={
            <ProtectedAdminRoute>
              <AdminCarFormPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedAdminRoute>
              <AdminReviewsManagementPage />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
