export const getCarId = (car) => car?._id || car?.id || car?.slug;

export const formatPrice = (value) => {
  const amount = Number(value || 0);
  if (amount >= 10000000) return `Rs. ${(amount / 10000000).toFixed(2)} cr`;
  if (amount >= 100000) return `Rs. ${(amount / 100000).toFixed(2)} lakh`;
  return `Rs. ${amount.toLocaleString("en-IN")}`;
};

export const formatMileage = (car) => {
  if (!car) return "-";
  if (String(car.fuelType).toLowerCase() === "electric") {
    return `${car.mileage} km range`;
  }
  return `${car.mileage} km/l`;
};

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const getApiError = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.message || fallback;
