import { ArrowRight, Gauge, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BuyerAssistantForm, { defaultPreferences } from "../components/BuyerAssistantForm.jsx";
import CarCard from "../components/CarCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { carService } from "../services/api.js";

const heroImage =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(
    () => carService.getCars({ sort: "ratingDesc", limit: 3 }),
    [],
  );

  const featuredCars = data?.data || [];

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/cars${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  const submitAssistant = (preferences) => {
    sessionStorage.setItem("carwise_preferences", JSON.stringify(preferences));
    navigate("/recommendations");
  };

  return (
    <div>
      <section
        className="relative min-h-[560px] overflow-hidden bg-zinc-950 text-white"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(24,24,27,0.86), rgba(24,24,27,0.42)), url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="page-shell flex min-h-[560px] flex-col justify-center py-16">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-1 text-sm font-medium">
              <Sparkles size={16} aria-hidden="true" />
              Buyer-first car research
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">CarWise</h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-100">
              Move from too many options to a confident shortlist using filters, comparisons,
              owner ratings, and preference-based recommendations.
            </p>

            <form onSubmit={submitSearch} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search cars</span>
                <Search size={18} className="absolute left-3 top-3.5 text-zinc-500" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by make, model, fuel, feature"
                  className="h-12 w-full rounded-md border border-white/30 bg-white px-10 text-zinc-950 outline-none focus:ring-2 focus:ring-red-300"
                />
              </label>
              <button type="submit" className="primary-button h-12 px-5">
                Search cars
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-white/12 p-3">
                <ShieldCheck size={20} className="text-teal-300" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium">Safety-first ranking</p>
              </div>
              <div className="rounded-md bg-white/12 p-3">
                <Gauge size={20} className="text-amber-300" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium">Mileage-aware filters</p>
              </div>
              <div className="rounded-md bg-white/12 p-3">
                <Users size={20} className="text-red-200" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium">Family suitability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white py-10">
        <div className="page-shell grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Start with clarity</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-950">Get a shortlist in minutes</h2>
            <p className="mt-3 text-zinc-600">
              The assistant scores cars by budget, mileage, safety, reviews, family size, fuel
              choice, and usage pattern, then explains each recommendation.
            </p>
            <Link to="/cars" className="secondary-button mt-5">
              Browse all cars
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <BuyerAssistantForm initialValues={defaultPreferences} onSubmit={submitAssistant} />
        </div>
      </section>

      <section className="page-shell py-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">High confidence picks</p>
            <h2 className="text-2xl font-bold text-zinc-950">Top-rated cars</h2>
          </div>
          <Link to="/cars" className="secondary-button w-fit">
            View listings
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {loading && <LoadingState label="Loading featured cars" />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.map((car) => (
              <CarCard key={car._id || car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
