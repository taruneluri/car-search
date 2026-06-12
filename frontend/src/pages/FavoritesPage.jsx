import { Trash2 } from "lucide-react";
import CarCard from "../components/CarCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useShortlist } from "../context/ShortlistContext.jsx";

export default function FavoritesPage() {
  const { shortlist, clearShortlist } = useShortlist();

  return (
    <section className="page-shell py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Saved choices</p>
          <h1 className="text-3xl font-bold text-zinc-950">Favorites and shortlist</h1>
          <p className="mt-2 text-zinc-600">Keep cars here while you compare, review details, and make the final call.</p>
        </div>
        {shortlist.length > 0 && (
          <button type="button" className="secondary-button w-fit" onClick={clearShortlist}>
            <Trash2 size={16} aria-hidden="true" />
            Clear shortlist
          </button>
        )}
      </div>

      {shortlist.length === 0 ? (
        <EmptyState
          title="Your shortlist is empty"
          message="Save cars from listings, recommendations, or detail pages."
          actionLabel="Find cars"
          actionTo="/cars"
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shortlist.map((car) => (
            <CarCard key={car._id || car.id || car.slug} car={car} />
          ))}
        </div>
      )}
    </section>
  );
}
