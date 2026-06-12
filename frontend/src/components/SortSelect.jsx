import { ArrowDownUp } from "lucide-react";
import { sortOptions } from "../utils/options.js";

export default function SortSelect({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">
      <ArrowDownUp size={16} className="text-zinc-500" aria-hidden="true" />
      <span className="sr-only">Sort cars</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-medium text-zinc-800 outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
