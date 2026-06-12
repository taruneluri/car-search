import { CheckCircle2, GitCompare, Heart, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useShortlist } from "../context/ShortlistContext.jsx";
import { formatMileage, formatPrice, getCarId } from "../utils/formatters.js";

export default function RecommendationCard({ item, rank }) {
  const { car, matchPercentage, reasons } = item;
  const { toggleShortlist, toggleCompare } = useShortlist();
  const carId = getCarId(car);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <img
          src={car.images?.[0]}
          alt={`${car.make} ${car.model}`}
          className="aspect-[16/10] w-full rounded-md object-cover"
          loading="lazy"
        />
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Rank #{rank}</p>
              <h3 className="mt-1 text-xl font-semibold text-zinc-950">{car.name}</h3>
              <p className="text-sm text-zinc-600">{car.variant}</p>
            </div>
            <div className="rounded-md bg-teal-50 px-3 py-2 text-right">
              <p className="text-xs font-medium text-teal-700">Match</p>
              <p className="text-2xl font-bold text-teal-800">{matchPercentage}%</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <span className="rounded-md bg-zinc-50 p-2">{formatPrice(car.startingPrice)}</span>
            <span className="rounded-md bg-zinc-50 p-2">{formatMileage(car)}</span>
            <span className="rounded-md bg-zinc-50 p-2">{car.safetyRating}/5 safety</span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Info size={16} className="text-amber-600" aria-hidden="true" />
              Why it made the shortlist
            </div>
            <ul className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="secondary-button" onClick={() => toggleShortlist(car)}>
              <Heart size={16} aria-hidden="true" />
              Shortlist
            </button>
            <button type="button" className="secondary-button" onClick={() => toggleCompare(car)}>
              <GitCompare size={16} aria-hidden="true" />
              Compare
            </button>
            <Link to={`/cars/${carId}`} className="primary-button">
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
