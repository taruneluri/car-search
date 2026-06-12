import { CarFront, Heart, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useShortlist } from "../context/ShortlistContext.jsx";
import { cx } from "../utils/formatters.js";

const navItems = [
  { to: "/cars", label: "Search" },
  { to: "/recommendations", label: "Assistant" },
  { to: "/compare", label: "Compare" },
  { to: "/favorites", label: "Favorites" },
];

const navClass = ({ isActive }) =>
  cx(
    "rounded-md px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
  );

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { session, logout } = useAuth();
  const { shortlist } = useShortlist();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="page-shell flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-zinc-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600 text-white">
              <CarFront size={20} aria-hidden="true" />
            </span>
            <span>CarWise</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/favorites"
              className="secondary-button px-3"
              title="Shortlisted cars"
            >
              <Heart size={16} aria-hidden="true" />
              {shortlist.length}
            </Link>
            {session ? (
              <button type="button" className="secondary-button" onClick={logout}>
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </button>
            ) : (
              <Link to="/login" className="secondary-button">
                <User size={16} aria-hidden="true" />
                Login
              </Link>
            )}
            <Link to="/admin/login" className="secondary-button">
              <ShieldCheck size={16} aria-hidden="true" />
              Admin
            </Link>
          </div>

          <button
            type="button"
            className="icon-button md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-zinc-200 bg-white md:hidden">
            <div className="page-shell flex flex-col gap-2 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/login" className="secondary-button justify-start" onClick={() => setOpen(false)}>
                <User size={16} aria-hidden="true" />
                {session ? "Account" : "Login"}
              </Link>
              <Link
                to="/admin/login"
                className="secondary-button justify-start"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck size={16} aria-hidden="true" />
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="page-shell flex flex-col gap-2 py-6 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>CarWise car research and recommendations.</p>
          <p>Built with React, Express, MongoDB, and Vercel-ready APIs.</p>
        </div>
      </footer>
    </div>
  );
}
