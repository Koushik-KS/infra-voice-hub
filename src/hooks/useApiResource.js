import { useCallback, useEffect, useState } from "react";
import { API_ERROR_MESSAGE } from "@/lib/api";

/**
 * Generic API resource hook.
 * Uses live API data when available.
 * Falls back to clearly labelled demo data when the API is unavailable.
 */
export function useApiResource(
  fetcher,
  { initialData = [], fallback = null, deps = [] } = {}
) {
  const startingData = fallback ?? initialData;

  const [data, setData] = useState(startingData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadResource() {
      setLoading(true);
      setError(null);
      setIsDemo(false);

      try {
        const result = await fetcher();

        if (cancelled) return;

        if (Array.isArray(initialData)) {
          setData(Array.isArray(result) ? result : []);
        } else {
          setData(result ?? {});
        }

        setIsDemo(false);
      } catch (err) {
        if (cancelled) return;

        if (fallback !== null) {
          setData(fallback);
          setError(null);
          setIsDemo(true);
        } else {
          setData(initialData);
          setError(API_ERROR_MESSAGE);
          setIsDemo(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResource();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey, ...deps]);

  return {
    data,
    loading,
    error,
    isDemo,
    reload,
  };
}