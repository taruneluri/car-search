import { Save, Trash2 } from "lucide-react";
import { useState } from "react";
import AdminHeader from "../components/AdminHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { adminService } from "../services/api.js";
import { getApiError } from "../utils/formatters.js";

const carLabel = (review) => {
  if (typeof review.car === "object" && review.car) {
    return review.car.name || `${review.car.make || ""} ${review.car.model || ""}`.trim();
  }
  return review.car || "Unknown car";
};

export default function AdminReviewsManagementPage() {
  const { data, loading, error, reload, setData } = useAsync(() => adminService.listReviews(), []);
  const [actionError, setActionError] = useState("");
  const reviews = data?.data || [];

  const updateStatus = async (review, status) => {
    setActionError("");
    try {
      const updated = await adminService.updateReview(review._id, { status });
      setData({
        data: reviews.map((item) => (item._id === review._id ? { ...item, ...updated } : item)),
      });
    } catch (err) {
      setActionError(getApiError(err));
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    setActionError("");
    try {
      await adminService.deleteReview(id);
      setData({ data: reviews.filter((review) => review._id !== id) });
    } catch (err) {
      setActionError(getApiError(err));
    }
  };

  return (
    <section className="page-shell py-8">
      <AdminHeader
        title="Reviews management"
        subtitle="Moderate owner reviews and keep the recommendation quality signal clean."
      />

      {actionError && <div className="mb-4"><ErrorState message={actionError} /></div>}
      {loading && <LoadingState label="Loading reviews" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && reviews.length === 0 && (
        <EmptyState title="No reviews yet" message="Submitted reviews will appear here for moderation." />
      )}
      {!loading && !error && reviews.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-100 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Car</th>
                <th className="px-4 py-3 font-semibold">Reviewer</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Review</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="px-4 py-3 font-medium text-zinc-950">{carLabel(review)}</td>
                  <td className="px-4 py-3">{review.userName || review.user?.name || "User"}</td>
                  <td className="px-4 py-3">{review.rating}/5</td>
                  <td className="max-w-md px-4 py-3">
                    <p className="font-medium text-zinc-900">{review.title || "Owner review"}</p>
                    <p className="mt-1 line-clamp-2 text-zinc-600">{review.comment}</p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="field-input min-w-32"
                      value={review.status}
                      onChange={(event) => updateStatus(review, event.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="secondary-button px-3" onClick={() => updateStatus(review, review.status)}>
                        <Save size={15} aria-hidden="true" />
                        Save
                      </button>
                      <button type="button" className="secondary-button px-3 text-red-700" onClick={() => deleteReview(review._id)}>
                        <Trash2 size={15} aria-hidden="true" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
