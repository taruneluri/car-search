import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  dailyUsageOptions,
  featureOptions,
  fuelOptions,
  priorityOptions,
} from "../utils/options.js";

const defaultPreferences = {
  budget: 1500000,
  familySize: 5,
  dailyUsage: "mixed",
  fuelPreference: "Any",
  mileagePriority: "medium",
  safetyPriority: "high",
  featurePreference: "safety",
  minUserRating: 4,
};

const Select = ({ label, value, onChange, options }) => (
  <label className="space-y-1">
    <span className="field-label">{label}</span>
    <select className="field-input" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export { defaultPreferences };

export default function BuyerAssistantForm({ initialValues = defaultPreferences, onSubmit, loading }) {
  const [form, setForm] = useState(initialValues);
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({
      ...form,
      budget: Number(form.budget),
      familySize: Number(form.familySize),
      minUserRating: Number(form.minUserRating),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-100 text-teal-700">
          <Sparkles size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Confused buyer assistant</h2>
          <p className="text-sm text-zinc-600">Answer the essentials and get a ranked shortlist.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="field-label">Maximum budget</span>
          <input
            type="number"
            className="field-input"
            value={form.budget}
            min="0"
            onChange={(event) => setField("budget", event.target.value)}
          />
        </label>
        <label className="space-y-1">
          <span className="field-label">Family size</span>
          <input
            type="number"
            className="field-input"
            value={form.familySize}
            min="1"
            max="10"
            onChange={(event) => setField("familySize", event.target.value)}
          />
        </label>
        <Select label="Daily usage" value={form.dailyUsage} onChange={(value) => setField("dailyUsage", value)} options={dailyUsageOptions} />
        <Select label="Fuel preference" value={form.fuelPreference} onChange={(value) => setField("fuelPreference", value)} options={fuelOptions} />
        <Select label="Mileage priority" value={form.mileagePriority} onChange={(value) => setField("mileagePriority", value)} options={priorityOptions} />
        <Select label="Safety priority" value={form.safetyPriority} onChange={(value) => setField("safetyPriority", value)} options={priorityOptions} />
        <Select label="Feature preference" value={form.featurePreference} onChange={(value) => setField("featurePreference", value)} options={featureOptions} />
        <label className="space-y-1">
          <span className="field-label">Minimum user rating</span>
          <select
            className="field-input"
            value={form.minUserRating}
            onChange={(event) => setField("minUserRating", event.target.value)}
          >
            {[3, 3.5, 4, 4.5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="primary-button mt-5 w-full md:w-auto" disabled={loading}>
        <Sparkles size={16} aria-hidden="true" />
        {loading ? "Finding matches" : "Recommend cars"}
      </button>
    </form>
  );
}
