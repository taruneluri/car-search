import { CarFront, LayoutDashboard, MessageSquarePlus, Plus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cx } from "../utils/formatters.js";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/cars", label: "Cars", icon: CarFront },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquarePlus },
];

const linkClass = ({ isActive }) =>
  cx(
    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
    isActive ? "bg-zinc-900 text-white" : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
  );

export default function AdminHeader({ title, subtitle, actionTo, actionLabel = "Add car" }) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Admin panel</p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-950">{title}</h1>
          {subtitle && <p className="mt-2 text-zinc-600">{subtitle}</p>}
        </div>
        {actionTo && (
          <Link to={actionTo} className="primary-button w-fit">
            <Plus size={16} aria-hidden="true" />
            {actionLabel}
          </Link>
        )}
      </div>
      <nav className="mt-5 flex flex-wrap gap-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <Icon size={16} aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
