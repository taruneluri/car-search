import { Star } from "lucide-react";

export default function RatingStars({ value = 0, label = "rating" }) {
  const rounded = Math.round(Number(value || 0));

  return (
    <div className="flex items-center gap-1" aria-label={`${value} ${label}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          className={star <= rounded ? "fill-amber-400 text-amber-400" : "text-zinc-300"}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1 text-sm font-medium text-zinc-700">{Number(value || 0).toFixed(1)}</span>
    </div>
  );
}
