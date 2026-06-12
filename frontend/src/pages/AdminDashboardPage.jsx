import { ArrowRight, CarFront, MessageSquare, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader.jsx";
import AdminStatCard from "../components/AdminStatCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { adminService } from "../services/api.js";

export default function AdminDashboardPage() {
  const { data, loading, error, reload } = useAsync(() => adminService.dashboard(), []);

  return (
    <section className="page-shell py-8">
      <AdminHeader
        title="Dashboard"
        subtitle="Monitor catalog size, users, reviews, and shortlists from one place."
        actionTo="/admin/cars/new"
      />

      {loading && <LoadingState label="Loading admin dashboard" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard label="Total cars" value={data.totalCars} tone="red" />
            <AdminStatCard label="Users" value={data.totalUsers} tone="zinc" />
            <AdminStatCard label="Reviews" value={data.totalReviews} tone="amber" />
            <AdminStatCard label="Shortlists" value={data.totalShortlists} tone="teal" />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Link to="/admin/cars" className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400">
              <CarFront className="text-red-600" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-zinc-950">Manage cars</h2>
              <p className="mt-2 text-sm text-zinc-600">Create, edit, and remove catalog entries and variants.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                Open cars <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
            <Link to="/admin/reviews" className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400">
              <MessageSquare className="text-teal-600" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-zinc-950">Moderate reviews</h2>
              <p className="mt-2 text-sm text-zinc-600">Approve, reject, update, or delete user reviews.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                Open reviews <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
            <Link to="/recommendations" className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400">
              <Star className="text-amber-500" size={24} aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-zinc-950">Check recommendations</h2>
              <p className="mt-2 text-sm text-zinc-600">Validate how buyer preferences rank the current catalog.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-700">
                Open assistant <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
