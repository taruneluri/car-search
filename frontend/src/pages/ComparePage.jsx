import { Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ComparisonTable from "../components/ComparisonTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useShortlist } from "../context/ShortlistContext.jsx";
import { carService } from "../services/api.js";
import { getApiError, getCarId } from "../utils/formatters.js";

export default function ComparePage() {
  const { compareCars, clearCompare } = useShortlist();
  const ids = useMemo(() => compareCars.map(getCarId).filter(Boolean), [compareCars]);
  const [cars, setCars] = useState(compareCars);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ids.length === 0) return;
    setLoading(true);
    setError("");
    carService
      .compareCars(ids)
      .then((response) => setCars(response.data || compareCars))
      .catch((err) => {
        setError(getApiError(err));
        setCars(compareCars);
      })
      .finally(() => setLoading(false));
  }, [ids.join(",")]);

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Side-by-side clarity</p>
          <h1 className="text-3xl font-bold text-zinc-950">Compare cars</h1>
          <p className="mt-2 text-zinc-600">Compare up to three shortlisted cars on price, mileage, safety, seating, and key specs.</p>
        </div>
        {cars.length > 0 && (
          <button type="button" className="secondary-button w-fit" onClick={clearCompare}>
            <Trash2 size={16} aria-hidden="true" />
            Clear compare
          </button>
        )}
      </div>

      {ids.length === 0 && (
        <EmptyState
          title="No cars selected"
          message="Add cars to compare from listings, recommendations, or detail pages."
          actionLabel="Browse cars"
          actionTo="/cars"
        />
      )}
      {ids.length > 0 && loading && <LoadingState label="Loading comparison" />}
      {ids.length > 0 && error && <ErrorState message={error} />}
      {ids.length > 0 && !loading && cars.length > 0 && <ComparisonTable cars={cars} />}
    </section>
  );
}
