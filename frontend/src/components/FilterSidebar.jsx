import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const defaultFilters = {
  search: "",
  make: "",
  model: "",
  variant: "",
  minPrice: "",
  maxPrice: "",
  minMileage: "",
  fuelType: "",
  transmission: "",
  bodyType: "",
  safetyRating: "",
  seatingCapacity: "",
  userRating: "",
};

const SelectField = ({ label, value, onChange, options }) => (
  <label className="space-y-1">
    <span className="field-label">{label}</span>
    <select className="field-input" value={value || ""} onChange={(event) => onChange(event.target.value)}>
      <option value="">Any</option>
      {(options || []).map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export { defaultFilters };

export default function FilterSidebar({ filters, filterOptions, onChange, onReset }) {
  const setField = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-zinc-950">
          <SlidersHorizontal size={18} aria-hidden="true" />
          Filters
        </div>
        <button type="button" className="secondary-button px-3 py-1.5" onClick={onReset}>
          <RotateCcw size={14} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <label className="space-y-1">
          <span className="field-label">Search</span>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-2.5 text-zinc-400" />
            <input
              className="field-input pl-9"
              value={filters.search}
              onChange={(event) => setField("search", event.target.value)}
              placeholder="Make, model, feature"
            />
          </div>
        </label>

        <SelectField label="Make" value={filters.make} onChange={(value) => setField("make", value)} options={filterOptions?.makes} />
        <SelectField label="Model" value={filters.model} onChange={(value) => setField("model", value)} options={filterOptions?.models} />
        <SelectField label="Variant" value={filters.variant} onChange={(value) => setField("variant", value)} options={filterOptions?.variants} />

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="field-label">Min price</span>
            <input
              type="number"
              className="field-input"
              value={filters.minPrice}
              onChange={(event) => setField("minPrice", event.target.value)}
              placeholder="0"
            />
          </label>
          <label className="space-y-1">
            <span className="field-label">Max price</span>
            <input
              type="number"
              className="field-input"
              value={filters.maxPrice}
              onChange={(event) => setField("maxPrice", event.target.value)}
              placeholder="2000000"
            />
          </label>
        </div>

        <label className="space-y-1">
          <span className="field-label">Minimum mileage</span>
          <input
            type="number"
            className="field-input"
            value={filters.minMileage}
            onChange={(event) => setField("minMileage", event.target.value)}
            placeholder="18"
          />
        </label>

        <SelectField label="Fuel type" value={filters.fuelType} onChange={(value) => setField("fuelType", value)} options={filterOptions?.fuelTypes} />
        <SelectField label="Transmission" value={filters.transmission} onChange={(value) => setField("transmission", value)} options={filterOptions?.transmissions} />
        <SelectField label="Body type" value={filters.bodyType} onChange={(value) => setField("bodyType", value)} options={filterOptions?.bodyTypes} />
        <SelectField label="Safety rating" value={filters.safetyRating} onChange={(value) => setField("safetyRating", value)} options={filterOptions?.safetyRatings} />
        <SelectField label="Seating capacity" value={filters.seatingCapacity} onChange={(value) => setField("seatingCapacity", value)} options={filterOptions?.seatingCapacities} />
        <SelectField label="User rating" value={filters.userRating} onChange={(value) => setField("userRating", value)} options={filterOptions?.userRatings} />
      </div>
    </aside>
  );
}
