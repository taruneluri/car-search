import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiError } from "../utils/formatters.js";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(form);
      navigate(location.state?.from || "/admin/dashboard", { replace: true });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell grid min-h-[calc(100vh-8rem)] items-center py-10">
      <div className="mx-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-red-100 text-red-700">
          <ShieldCheck size={24} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-950">Admin login</h1>
        <p className="mt-2 text-sm text-zinc-600">Manage cars, variants, specs, mileage, safety ratings, and reviews.</p>

        {error && <div className="mt-4"><ErrorState message={error} /></div>}

        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="space-y-1">
            <span className="field-label">Email</span>
            <input
              type="email"
              className="field-input"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label className="space-y-1">
            <span className="field-label">Password</span>
            <input
              type="password"
              className="field-input"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              minLength={8}
            />
          </label>
          <button type="submit" className="primary-button w-full" disabled={loading}>
            <ShieldCheck size={16} aria-hidden="true" />
            {loading ? "Signing in" : "Login as admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
