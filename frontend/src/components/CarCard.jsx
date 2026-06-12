import { ArrowRight, GitCompare, Heart, ShieldCheck, Star, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useShortlist } from "../context/ShortlistContext.jsx";
import { cx, formatMileage, formatPrice, getCarId } from "../utils/formatters.js";

export default function CarCard({ car }) {
  const { isShortlisted, isCompared, toggleShortlist, toggleCompare } = useShortlist();
  const carId = getCarId(car);

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[16/9] overflow-hidden bg-zinc-200">
        <img
          src={car.images?.[0]}
          alt={`${car.make} ${car.model}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            {car.bodyType} / {car.fuelType}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-950">{car.name || `${car.make} ${car.model}`}</h3>
          <p className="text-sm text-zinc-600">{car.variant}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-md bg-zinc-50 p-2">
            <p className="text-xs text-zinc-500">From</p>
            <p className="font-semibold text-zinc-950">{formatPrice(car.startingPrice)}</p>
          </div>
          <div className="rounded-md bg-zinc-50 p-2">
            <p className="text-xs text-zinc-500">Mileage</p>
            <p className="font-semibold text-zinc-950">{formatMileage(car)}</p>
          </div>
          <div className="rounded-md bg-zinc-50 p-2">
            <p className="text-xs text-zinc-500">Seats</p>
            <p className="font-semibold text-zinc-950">{car.seatingCapacity}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-700">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck size={15} className="text-teal-600" aria-hidden="true" />
            {car.safetyRating}/5 safety
          </span>
          <span className="inline-flex items-center gap-1">
            <Star size={15} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            {car.userRating}
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer size={15} className="text-zinc-500" aria-hidden="true" />
            {car.transmission}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cx("secondary-button flex-1", isShortlisted(carId) && "border-red-500 text-red-700")}
            onClick={() => toggleShortlist(car)}
          >
            <Heart size={16} className={isShortlisted(carId) ? "fill-red-600" : ""} aria-hidden="true" />
            Shortlist
          </button>
          <button
            type="button"
            className={cx("secondary-button flex-1", isCompared(carId) && "border-teal-500 text-teal-700")}
            onClick={() => toggleCompare(car)}
          >
            <GitCompare size={16} aria-hidden="true" />
            Compare
          </button>
        </div>

        <Link to={`/cars/${carId}`} className="primary-button w-full">
          View details
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
