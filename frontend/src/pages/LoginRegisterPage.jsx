import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiError } from "../utils/formatters.js";

export default function LoginRegisterPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register(form);
      navigate("/favorites");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell grid min-h-[calc(100vh-8rem)] items-center py-10">
      <div className="mx-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex rounded-md bg-zinc-100 p-1">
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600"}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <h1 className="text-2xl font-bold text-zinc-950">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-2 text-sm text-zinc-600">Save favorites and submit owner reviews.</p>

        {error && <div className="mt-4"><ErrorState message={error} /></div>}

        <form onSubmit={submit} className="mt-5 space-y-4">
          {mode === "register" && (
            <label className="space-y-1">
              <span className="field-label">Name</span>
              <input className="field-input" value={form.name} onChange={(event) => setField("name", event.target.value)} required />
            </label>
          )}
          <label className="space-y-1">
            <span className="field-label">Email</span>
            <input type="email" className="field-input" value={form.email} onChange={(event) => setField("email", event.target.value)} required />
          </label>
          <label className="space-y-1">
            <span className="field-label">Password</span>
            <input type="password" className="field-input" value={form.password} onChange={(event) => setField("password", event.target.value)} required minLength={6} />
          </label>
          <button type="submit" className="primary-button w-full" disabled={loading}>
            {mode === "login" ? <LogIn size={16} aria-hidden="true" /> : <UserPlus size={16} aria-hidden="true" />}
            {loading ? "Please wait" : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
}
