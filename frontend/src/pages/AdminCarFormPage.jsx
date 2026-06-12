import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/AdminHeader.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { adminService } from "../services/api.js";
import { getApiError } from "../utils/formatters.js";

const emptyVariant = {
  name: "",
  price: "",
  fuelType: "",
  transmission: "",
  mileage: "",
  engine: "",
  features: "",
};

const defaultForm = {
  make: "",
  model: "",
  name: "",
  variant: "",
  summary: "",
  bodyType: "SUV",
  fuelType: "Petrol",
  transmission: "Automatic",
  seatingCapacity: 5,
  startingPrice: "",
  mileage: "",
  safetyRating: 4,
  userRating: 4,
  reviewCount: 0,
  images: "",
  pros: "",
  cons: "",
  tags: "",
  engine: "",
  power: "",
  torque: "",
  drivetrain: "",
  bootSpace: "",
  groundClearance: "",
  airbags: 6,
  infotainment: "",
  keyFeatures: "",
};

const splitList = (value) =>
  String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const joinList = (value) => (Array.isArray(value) ? value.join("\n") : "");

const toForm = (car) => ({
  make: car.make || "",
  model: car.model || "",
  name: car.name || "",
  variant: car.variant || "",
  summary: car.summary || "",
  bodyType: car.bodyType || "SUV",
  fuelType: car.fuelType || "Petrol",
  transmission: car.transmission || "Automatic",
  seatingCapacity: car.seatingCapacity || 5,
  startingPrice: car.startingPrice || "",
  mileage: car.mileage || "",
  safetyRating: car.safetyRating || 4,
  userRating: car.userRating || 4,
  reviewCount: car.reviewCount || 0,
  images: joinList(car.images),
  pros: joinList(car.pros),
  cons: joinList(car.cons),
  tags: joinList(car.tags),
  engine: car.specs?.engine || "",
  power: car.specs?.power || "",
  torque: car.specs?.torque || "",
  drivetrain: car.specs?.drivetrain || "",
  bootSpace: car.specs?.bootSpace || "",
  groundClearance: car.specs?.groundClearance || "",
  airbags: car.specs?.airbags || 6,
  infotainment: car.specs?.infotainment || "",
  keyFeatures: joinList(car.specs?.keyFeatures),
});

const textFields = [
  ["make", "Make"],
  ["model", "Model"],
  ["name", "Display name"],
  ["variant", "Primary variant"],
  ["bodyType", "Body type"],
  ["fuelType", "Fuel type"],
  ["transmission", "Transmission"],
];

export default function AdminCarFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [variants, setVariants] = useState([emptyVariant]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    adminService
      .getCar(id)
      .then((car) => {
        setForm(toForm(car));
        setVariants(
          (car.variants || []).map((variant) => ({
            ...variant,
            features: joinList(variant.features),
          })),
        );
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const updateVariant = (index, field, value) => {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const addVariant = () => setVariants((current) => [...current, emptyVariant]);
  const removeVariant = (index) =>
    setVariants((current) => current.filter((_, variantIndex) => variantIndex !== index));

  const buildPayload = () => ({
    make: form.make,
    model: form.model,
    name: form.name || `${form.make} ${form.model}`,
    variant: form.variant,
    summary: form.summary,
    bodyType: form.bodyType,
    fuelType: form.fuelType,
    transmission: form.transmission,
    seatingCapacity: Number(form.seatingCapacity),
    startingPrice: Number(form.startingPrice),
    mileage: Number(form.mileage),
    safetyRating: Number(form.safetyRating),
    userRating: Number(form.userRating),
    reviewCount: Number(form.reviewCount),
    images: splitList(form.images),
    pros: splitList(form.pros),
    cons: splitList(form.cons),
    tags: splitList(form.tags),
    specs: {
      engine: form.engine,
      power: form.power,
      torque: form.torque,
      drivetrain: form.drivetrain,
      bootSpace: form.bootSpace,
      groundClearance: form.groundClearance,
      airbags: Number(form.airbags),
      infotainment: form.infotainment,
      keyFeatures: splitList(form.keyFeatures),
    },
    variants: variants
      .filter((variant) => variant.name && variant.price)
      .map((variant) => ({
        name: variant.name,
        price: Number(variant.price),
        fuelType: variant.fuelType,
        transmission: variant.transmission,
        mileage: Number(variant.mileage || 0),
        engine: variant.engine,
        features: splitList(variant.features),
      })),
  });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload();
      if (isEditing) await adminService.updateCar(id, payload);
      else await adminService.createCar(payload);
      navigate("/admin/cars");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="page-shell py-8">
        <LoadingState label="Loading car editor" />
      </section>
    );
  }

  return (
    <section className="page-shell py-8">
      <AdminHeader
        title={isEditing ? "Edit car" : "Add car"}
        subtitle="Manage catalog fields, variants, prices, specifications, mileage, safety ratings, and review scores."
      />

      {error && <div className="mb-4"><ErrorState message={error} /></div>}

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Core details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {textFields.map(([field, label]) => (
              <label key={field} className="space-y-1">
                <span className="field-label">{label}</span>
                <input
                  className="field-input"
                  value={form[field]}
                  onChange={(event) => setField(field, event.target.value)}
                  required={["make", "model", "bodyType", "fuelType", "transmission"].includes(field)}
                />
              </label>
            ))}
            <label className="space-y-1">
              <span className="field-label">Seating capacity</span>
              <input type="number" min="2" max="10" className="field-input" value={form.seatingCapacity} onChange={(event) => setField("seatingCapacity", event.target.value)} required />
            </label>
            <label className="space-y-1">
              <span className="field-label">Starting price</span>
              <input type="number" min="0" className="field-input" value={form.startingPrice} onChange={(event) => setField("startingPrice", event.target.value)} required />
            </label>
            <label className="space-y-1">
              <span className="field-label">Mileage or range</span>
              <input type="number" min="0" className="field-input" value={form.mileage} onChange={(event) => setField("mileage", event.target.value)} required />
            </label>
            <label className="space-y-1">
              <span className="field-label">Safety rating</span>
              <input type="number" min="0" max="5" step="0.1" className="field-input" value={form.safetyRating} onChange={(event) => setField("safetyRating", event.target.value)} required />
            </label>
            <label className="space-y-1">
              <span className="field-label">User rating</span>
              <input type="number" min="0" max="5" step="0.1" className="field-input" value={form.userRating} onChange={(event) => setField("userRating", event.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="field-label">Review count</span>
              <input type="number" min="0" className="field-input" value={form.reviewCount} onChange={(event) => setField("reviewCount", event.target.value)} />
            </label>
          </div>
          <label className="mt-4 block space-y-1">
            <span className="field-label">Summary</span>
            <textarea className="field-input min-h-24" value={form.summary} onChange={(event) => setField("summary", event.target.value)} />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Specifications</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["engine", "Engine"],
              ["power", "Power"],
              ["torque", "Torque"],
              ["drivetrain", "Drivetrain"],
              ["bootSpace", "Boot space"],
              ["groundClearance", "Ground clearance"],
              ["airbags", "Airbags"],
              ["infotainment", "Infotainment"],
            ].map(([field, label]) => (
              <label key={field} className="space-y-1">
                <span className="field-label">{label}</span>
                <input className="field-input" value={form[field]} onChange={(event) => setField(field, event.target.value)} />
              </label>
            ))}
          </div>
          <label className="mt-4 block space-y-1">
            <span className="field-label">Key features</span>
            <textarea className="field-input min-h-24" value={form.keyFeatures} onChange={(event) => setField("keyFeatures", event.target.value)} placeholder="One item per line" />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-950">Variants</h2>
            <button type="button" className="secondary-button" onClick={addVariant}>
              <Plus size={16} aria-hidden="true" />
              Add variant
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 p-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["name", "Name"],
                    ["price", "Price"],
                    ["fuelType", "Fuel"],
                    ["transmission", "Transmission"],
                    ["mileage", "Mileage"],
                    ["engine", "Engine"],
                  ].map(([field, label]) => (
                    <label key={field} className="space-y-1">
                      <span className="field-label">{label}</span>
                      <input
                        className="field-input"
                        type={["price", "mileage"].includes(field) ? "number" : "text"}
                        value={variant[field] || ""}
                        onChange={(event) => updateVariant(index, field, event.target.value)}
                      />
                    </label>
                  ))}
                  <label className="space-y-1 lg:col-span-2">
                    <span className="field-label">Features</span>
                    <input
                      className="field-input"
                      value={variant.features || ""}
                      onChange={(event) => updateVariant(index, "features", event.target.value)}
                      placeholder="Comma separated"
                    />
                  </label>
                </div>
                {variants.length > 1 && (
                  <button type="button" className="secondary-button mt-3 text-red-700" onClick={() => removeVariant(index)}>
                    <Trash2 size={15} aria-hidden="true" />
                    Remove variant
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Images, pros, cons, and tags</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="field-label">Image URLs</span>
              <textarea className="field-input min-h-32" value={form.images} onChange={(event) => setField("images", event.target.value)} placeholder="One URL per line" />
            </label>
            <label className="space-y-1">
              <span className="field-label">Tags</span>
              <textarea className="field-input min-h-32" value={form.tags} onChange={(event) => setField("tags", event.target.value)} placeholder="One tag per line" />
            </label>
            <label className="space-y-1">
              <span className="field-label">Pros</span>
              <textarea className="field-input min-h-32" value={form.pros} onChange={(event) => setField("pros", event.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="field-label">Cons</span>
              <textarea className="field-input min-h-32" value={form.cons} onChange={(event) => setField("cons", event.target.value)} />
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="primary-button" disabled={saving}>
            <Save size={16} aria-hidden="true" />
            {saving ? "Saving" : "Save car"}
          </button>
        </div>
      </form>
    </section>
  );
}
