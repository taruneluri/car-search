import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { adminService } from "../services/api.js";
import { formatMileage, formatPrice } from "../utils/formatters.js";

export default function AdminCarsManagementPage() {
  const { data, loading, error, reload, setData } = useAsync(() => adminService.listCars(), []);
  const [actionError, setActionError] = useState("");
  const cars = data?.data || [];

  const deleteCar = async (id) => {
    if (!confirm("Delete this car and related records?")) return;
    setActionError("");
    try {
      await adminService.deleteCar(id);
      setData({ data: cars.filter((car) => car._id !== id) });
    } catch (err) {
      setActionError(err?.response?.data?.message || err.message);
    }
  };

  return (
    <section className="page-shell py-8">
      <AdminHeader
        title="Cars management"
        subtitle="Add, edit, and delete makes, models, variants, specs, prices, mileage, and safety data."
        actionTo="/admin/cars/new"
      />

      {actionError && <div className="mb-4"><ErrorState message={actionError} /></div>}
      {loading && <LoadingState label="Loading cars" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && cars.length === 0 && (
        <EmptyState title="No cars in catalog" actionLabel="Add car" actionTo="/admin/cars/new" />
      )}
      {!loading && !error && cars.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-100 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Car</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Mileage</th>
                <th className="px-4 py-3 font-semibold">Safety</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cars.map((car) => (
                <tr key={car._id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-950">{car.name || `${car.make} ${car.model}`}</p>
                    <p className="text-zinc-500">{car.variant}</p>
                  </td>
                  <td className="px-4 py-3">{car.bodyType} / {car.fuelType}</td>
                  <td className="px-4 py-3">{formatPrice(car.startingPrice)}</td>
                  <td className="px-4 py-3">{formatMileage(car)}</td>
                  <td className="px-4 py-3">{car.safetyRating}/5</td>
                  <td className="px-4 py-3">{car.userRating}/5</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/cars/${car._id}`} className="secondary-button px-3">
                        <Edit size={15} aria-hidden="true" />
                        Edit
                      </Link>
                      <button type="button" className="secondary-button px-3 text-red-700" onClick={() => deleteCar(car._id)}>
                        <Trash2 size={15} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/admin/cars/new" className="primary-button fixed bottom-5 right-5 shadow-lg md:hidden">
        <Plus size={18} aria-hidden="true" />
        Add
      </Link>
    </section>
  );
}
