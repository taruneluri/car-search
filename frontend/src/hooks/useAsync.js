import { useCallback, useEffect, useState } from "react";
import { getApiError } from "../utils/formatters.js";

export const useAsync = (callback, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const execute = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await callback();
      setData(result);
      return result;
    } catch (err) {
      setError(getApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, reload: execute, setData };
};
