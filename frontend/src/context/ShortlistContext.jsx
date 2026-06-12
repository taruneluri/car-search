import { createContext, useContext, useMemo } from "react";
import { favoriteService } from "../services/api.js";
import { getCarId } from "../utils/formatters.js";
import { useAuth } from "./AuthContext.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const ShortlistContext = createContext(null);
const SHORTLIST_KEY = "carwise_shortlist";
const COMPARE_KEY = "carwise_compare";

export function ShortlistProvider({ children }) {
  const { session } = useAuth();
  const [shortlist, setShortlist] = useLocalStorage(SHORTLIST_KEY, []);
  const [compareCars, setCompareCars] = useLocalStorage(COMPARE_KEY, []);

  const isShortlisted = (carId) => shortlist.some((car) => getCarId(car) === carId);
  const isCompared = (carId) => compareCars.some((car) => getCarId(car) === carId);

  const toggleShortlist = async (car) => {
    const carId = getCarId(car);
    const exists = isShortlisted(carId);

    setShortlist((current) =>
      exists ? current.filter((item) => getCarId(item) !== carId) : [car, ...current],
    );

    if (session?.role === "user") {
      try {
        if (exists) await favoriteService.remove(carId);
        else await favoriteService.add(carId);
      } catch {
        setShortlist((current) =>
          exists ? [car, ...current] : current.filter((item) => getCarId(item) !== carId),
        );
      }
    }
  };

  const toggleCompare = (car) => {
    const carId = getCarId(car);
    setCompareCars((current) => {
      if (current.some((item) => getCarId(item) === carId)) {
        return current.filter((item) => getCarId(item) !== carId);
      }
      return [car, ...current].slice(0, 3);
    });
  };

  const clearCompare = () => setCompareCars([]);
  const clearShortlist = () => setShortlist([]);

  const value = useMemo(
    () => ({
      shortlist,
      compareCars,
      isShortlisted,
      isCompared,
      toggleShortlist,
      toggleCompare,
      clearCompare,
      clearShortlist,
    }),
    [shortlist, compareCars, session],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export const useShortlist = () => useContext(ShortlistContext);
