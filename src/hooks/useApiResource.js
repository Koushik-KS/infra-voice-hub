import { useCallback, useEffect, useState } from "react";
import { API_ERROR_MESSAGE } from "@/lib/api";

/**
 * Generic API resource hook returning live backend data with
 * loading / error / empty handling. No sample data fallbacks.
 */
export function useApiResource(fetcher, { initialData = [], deps = [] } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.resolve()
      .then(fetcher)
      .then((result) => {
        if (cancelled) return;
        setData(Array.isArray(initialData) ? (Array.isArray(result) ? result : []) : (result ?? {}));
      })
      .catch(() => {
        if (cancelled) return;
        setError(API_ERROR_MESSAGE);
        setData(initialData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  return { data, loading, error, reload };
}
