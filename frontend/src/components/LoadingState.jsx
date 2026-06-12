import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Loading" }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-zinc-200 bg-white p-8 text-zinc-600">
      <Loader2 className="mr-2 animate-spin" size={18} aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
