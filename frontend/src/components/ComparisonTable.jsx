import { formatMileage, formatPrice } from "../utils/formatters.js";

const rows = [
  { label: "Price", render: (car) => formatPrice(car.startingPrice) },
  { label: "Mileage", render: (car) => formatMileage(car) },
  { label: "Fuel", render: (car) => car.fuelType },
  { label: "Transmission", render: (car) => car.transmission },
  { label: "Body type", render: (car) => car.bodyType },
  { label: "Seats", render: (car) => car.seatingCapacity },
  { label: "Safety", render: (car) => `${car.safetyRating}/5` },
  { label: "User rating", render: (car) => `${car.userRating}/5` },
  { label: "Boot", render: (car) => car.specs?.bootSpace || "-" },
  { label: "Airbags", render: (car) => car.specs?.airbags || "-" },
];

export default function ComparisonTable({ cars }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-100">
          <tr>
            <th className="w-40 px-4 py-3 text-left font-semibold text-zinc-800">Metric</th>
            {cars.map((car) => (
              <th key={car._id || car.id} className="min-w-52 px-4 py-3 text-left font-semibold text-zinc-950">
                {car.name || `${car.make} ${car.model}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">{row.label}</td>
              {cars.map((car) => (
                <td key={`${car._id || car.id}-${row.label}`} className="px-4 py-3 text-zinc-800">
                  {row.render(car)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
