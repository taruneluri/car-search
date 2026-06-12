import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  title = "No cars found",
  message = "Try changing your filters.",
  actionLabel,
  actionTo,
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 text-amber-700">
        <Search size={22} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-zinc-950">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="primary-button mt-5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
