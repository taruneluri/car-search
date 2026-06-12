import { RefreshCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
      <p className="font-semibold">Unable to load this section.</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button type="button" className="mt-4 secondary-button" onClick={onRetry}>
          <RefreshCcw size={16} aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
