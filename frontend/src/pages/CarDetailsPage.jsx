import { CheckCircle2, GitCompare, Heart, MessageSquare, ShieldCheck, Star, XCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useShortlist } from "../context/ShortlistContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { carService, reviewService } from "../services/api.js";
import { formatMileage, formatPrice, getApiError, getCarId } from "../utils/formatters.js";

export default function CarDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toggleShortlist, toggleCompare } = useShortlist();
  const { data: car, loading, error, reload, setData } = useAsync(() => carService.getCar(id), [id]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmittingReview(true);
    setReviewError("");
    setReviewMessage("");
    try {
      await reviewService.create({
        car: getCarId(car),
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        comment: reviewForm.comment,
      });
      setReviewMessage("Review submitted for moderation.");
      setReviewForm({ rating: 5, title: "", comment: "" });
    } catch (err) {
      setReviewError(getApiError(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <section className="page-shell py-8"><LoadingState label="Loading car details" /></section>;
  if (error) return <section className="page-shell py-8"><ErrorState message={error} onRetry={reload} /></section>;
  if (!car) return <section className="page-shell py-8"><EmptyState title="Car not found" actionLabel="Browse cars" actionTo="/cars" /></section>;

  const reviews = car.reviews || [];

  return (
    <section className="page-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <img
              src={car.images?.[0]}
              alt={`${car.make} ${car.model}`}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(car.images || []).slice(1, 3).map((image) => (
              <img key={image} src={image} alt={car.name} className="aspect-[16/10] rounded-lg object-cover" />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            {car.make} / {car.bodyType}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-950">{car.name}</h1>
          <p className="mt-1 text-zinc-600">{car.variant}</p>
          <p className="mt-5 text-3xl font-bold text-zinc-950">{formatPrice(car.startingPrice)}</p>
          <p className="mt-2 text-zinc-600">{car.summary}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-zinc-500">Mileage</p>
              <p className="font-semibold text-zinc-950">{formatMileage(car)}</p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-zinc-500">Safety</p>
              <p className="flex items-center gap-1 font-semibold text-zinc-950">
                <ShieldCheck size={16} className="text-teal-600" aria-hidden="true" />
                {car.safetyRating}/5
              </p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-zinc-500">User rating</p>
              <RatingStars value={car.userRating} />
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-zinc-500">Seats</p>
              <p className="font-semibold text-zinc-950">{car.seatingCapacity}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="primary-button" onClick={() => toggleShortlist(car)}>
              <Heart size={16} aria-hidden="true" />
              Shortlist
            </button>
            <button type="button" className="secondary-button" onClick={() => toggleCompare(car)}>
              <GitCompare size={16} aria-hidden="true" />
              Compare
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-zinc-950">Variants</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm">
                <thead className="bg-zinc-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Variant</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Fuel</th>
                    <th className="px-4 py-3 text-left">Transmission</th>
                    <th className="px-4 py-3 text-left">Mileage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {(car.variants || []).map((variant) => (
                    <tr key={variant._id || variant.name}>
                      <td className="px-4 py-3 font-medium">{variant.name}</td>
                      <td className="px-4 py-3">{formatPrice(variant.price)}</td>
                      <td className="px-4 py-3">{variant.fuelType}</td>
                      <td className="px-4 py-3">{variant.transmission}</td>
                      <td className="px-4 py-3">{variant.mileage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-zinc-950">Specifications</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(car.specs || {}).map(([key, value]) => (
                <div key={key} className="rounded-md bg-zinc-50 p-3">
                  <p className="text-sm capitalize text-zinc-500">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="mt-1 font-medium text-zinc-950">{Array.isArray(value) ? value.join(", ") : value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-zinc-950">User reviews</h2>
            <div className="mt-4 space-y-3">
              {reviews.length === 0 && <p className="text-sm text-zinc-600">No approved reviews yet.</p>}
              {reviews.map((review) => (
                <article key={review._id} className="rounded-md border border-zinc-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-zinc-950">{review.title || "Owner review"}</p>
                      <p className="text-sm text-zinc-500">{review.userName}</p>
                    </div>
                    <RatingStars value={review.rating} />
                  </div>
                  <p className="mt-3 text-sm text-zinc-700">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-zinc-950">Pros and cons</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                {(car.pros || []).map((item) => (
                  <p key={item} className="flex gap-2 text-sm text-zinc-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-600" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                {(car.cons || []).map((item) => (
                  <p key={item} className="flex gap-2 text-sm text-zinc-700">
                    <XCircle size={16} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-zinc-700" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-zinc-950">Add a review</h2>
            </div>
            {!user ? (
              <p className="mt-3 text-sm text-zinc-600">
                <Link to="/login" className="font-semibold text-red-600">Login</Link> to submit an owner review.
              </p>
            ) : (
              <form onSubmit={submitReview} className="mt-4 space-y-3">
                <label className="space-y-1">
                  <span className="field-label">Rating</span>
                  <select className="field-input" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="field-label">Title</span>
                  <input className="field-input" value={reviewForm.title} onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })} />
                </label>
                <label className="space-y-1">
                  <span className="field-label">Review</span>
                  <textarea className="field-input min-h-28" value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} />
                </label>
                {reviewMessage && <p className="text-sm text-teal-700">{reviewMessage}</p>}
                {reviewError && <p className="text-sm text-red-700">{reviewError}</p>}
                <button type="submit" className="primary-button w-full" disabled={submittingReview}>
                  <Star size={16} aria-hidden="true" />
                  Submit review
                </button>
              </form>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}
