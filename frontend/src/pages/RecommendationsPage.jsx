import { useEffect, useState } from "react";
import BuyerAssistantForm, { defaultPreferences } from "../components/BuyerAssistantForm.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";
import { recommendationService } from "../services/api.js";
import { getApiError } from "../utils/formatters.js";

const readStoredPreferences = () => {
  try {
    return JSON.parse(sessionStorage.getItem("carwise_preferences") || "null");
  } catch {
    return null;
  }
};

export default function RecommendationsPage() {
  const [preferences, setPreferences] = useState(readStoredPreferences() || defaultPreferences);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendations = async (nextPreferences) => {
    setPreferences(nextPreferences);
    sessionStorage.setItem("carwise_preferences", JSON.stringify(nextPreferences));
    setLoading(true);
    setError("");

    try {
      const response = await recommendationService.recommend(nextPreferences);
      setResult(response);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (readStoredPreferences()) {
      getRecommendations(readStoredPreferences());
    }
  }, []);

  const shortlist = result?.shortlist || [];

  return (
    <section className="page-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Ranked recommendations</p>
        <h1 className="text-3xl font-bold text-zinc-950">Build your confident shortlist</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">
          Cars are scored across budget match, mileage, safety, owner reviews, family fit, fuel
          preference, usage pattern, and feature priority.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <BuyerAssistantForm initialValues={preferences} onSubmit={getRecommendations} loading={loading} />

        <div className="space-y-4">
          {error && <ErrorState message={error} />}
          {!result && !loading && !error && (
            <EmptyState
              title="No recommendation run yet"
              message="Answer the assistant questions to generate a ranked shortlist."
            />
          )}
          {loading && (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-sm font-medium text-zinc-700">
              Scoring cars against your preferences...
            </div>
          )}
          {!loading && result && shortlist.length === 0 && (
            <EmptyState title="No recommendations found" message="Try increasing your budget or relaxing one priority." />
          )}
          {!loading &&
            shortlist.map((item, index) => (
              <RecommendationCard key={item.car._id || item.car.id} item={item} rank={index + 1} />
            ))}
        </div>
      </div>
    </section>
  );
}
