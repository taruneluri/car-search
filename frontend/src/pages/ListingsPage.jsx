import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarCard from "../components/CarCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import FilterSidebar, { defaultFilters } from "../components/FilterSidebar.jsx";
import LoadingState from "../components/LoadingState.jsx";
import SortSelect from "../components/SortSelect.jsx";
import { carService } from "../services/api.js";
import { getApiError } from "../utils/formatters.js";

const cleanParams = (filters, sort) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) params[key] = value;
  });
  params.sort = sort;
  return params;
};

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    ...Object.fromEntries(searchParams.entries()),
  }));
  const [sort, setSort] = useState(searchParams.get("sort") || "ratingDesc");
  const [filterOptions, setFilterOptions] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeParams = useMemo(() => cleanParams(filters, sort), [filters, sort]);

  useEffect(() => {
    carService.getFilters().then(setFilterOptions).catch(() => setFilterOptions(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    setSearchParams(activeParams, { replace: true });

    carService
      .getCars(activeParams)
      .then((response) => setCars(response.data || []))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [activeParams, setSearchParams]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSort("ratingDesc");
  };

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Research catalog</p>
          <h1 className="text-3xl font-bold text-zinc-950">Find cars that match your needs</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Search by make, model, variant, price, mileage, fuel type, transmission, body type,
            safety, seating, and owner rating.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="secondary-button lg:hidden" onClick={() => setShowFilters(true)}>
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
          </button>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            filterOptions={filterOptions}
            onChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-50 bg-zinc-950/40 p-4 lg:hidden">
            <div className="ml-auto h-full max-w-sm overflow-y-auto rounded-lg bg-white p-4">
              <div className="mb-3 flex justify-end">
                <button type="button" className="icon-button" onClick={() => setShowFilters(false)} aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                filterOptions={filterOptions}
                onChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          </div>
        )}

        <div>
          <div className="mb-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <p className="text-sm font-medium text-zinc-700">
              {loading ? "Searching" : `${cars.length} cars found`}
            </p>
            <p className="text-sm text-zinc-500">Sorted by {sort}</p>
          </div>

          {loading && <LoadingState label="Searching cars" />}
          {error && <ErrorState message={error} />}
          {!loading && !error && cars.length === 0 && <EmptyState />}
          {!loading && !error && cars.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car._id || car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
