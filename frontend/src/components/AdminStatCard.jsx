export default function AdminStatCard({ label, value, tone = "zinc" }) {
  const toneClass = {
    zinc: "bg-zinc-900 text-white",
    teal: "bg-teal-600 text-white",
    amber: "bg-amber-500 text-zinc-950",
    red: "bg-red-600 text-white",
  }[tone];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-600">{label}</p>
      <div className={`mt-4 inline-flex min-w-20 items-center justify-center rounded-md px-4 py-2 text-3xl font-bold ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}
