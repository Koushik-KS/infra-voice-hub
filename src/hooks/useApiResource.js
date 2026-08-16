import { useCallback, useEffect, useState } from "react";

/**
 * Generic API resource hook with loading / error / empty handling and an
 * optional clearly-labelled demo fallback used when the API returns no rows.
 */
export function useApiResource(fetcher, { fallback = [], deps = [] } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.resolve()
      .then(fetcher)
      .then((rows) => {
        if (cancelled) return;
        const list = Array.isArray(rows) ? rows : [];
        if (list.length === 0) {
          setData(fallback);
          setIsDemo(fallback.length > 0);
        } else {
          setData(list);
          setIsDemo(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Request failed");
        setData(fallback);
        setIsDemo(fallback.length > 0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  return { data, loading, error, isDemo, reload };
}
