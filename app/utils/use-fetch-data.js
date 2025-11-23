import { useCallback, useEffect, useRef, useState } from "react";
import { stringifyVariables } from "urql";
/**
 * Stores what has been queried through useFetchData. Is listened to by useCacheKey.
 */
class QueryCache {
    constructor() {
        this.cache = new Map();
        this.listeners = [];
        this.version = 0;
    }
    set(queryKey, value) {
        this.cache.set(stringifyVariables(queryKey), value);
        this.version++;
        this.fire(queryKey);
    }
    get(queryKey) {
        return (this.cache.get(stringifyVariables(queryKey)) || {
            data: null,
            error: null,
            status: "idle",
        });
    }
    fire(queryKey) {
        const key = stringifyVariables(queryKey);
        this.listeners.forEach(([k, cb]) => key === k && cb());
    }
    listen(queryKey, cb) {
        this.listeners.push([stringifyVariables(queryKey), cb]);
        return () => void this.listeners.splice(this.listeners.findIndex((c) => c[1] === cb), 1);
    }
}
const cache = new QueryCache();
const useCacheKey = (cache, queryKey) => {
    const [version, setVersion] = useState(cache.version);
    useEffect(() => {
        return cache.listen(queryKey, () => {
            setVersion(() => cache.version);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cache, stringifyVariables(queryKey)]);
    return version;
};
/**
 * Access remote data, very similar to useFetch from react-query. A global cache
 * is used to store the data. If data is not fetched, it will be fetched automatically.
 * Two useFetchData on the same queryKey will result in only 1 queryFn called. Both useFetchData
 * will share the same cache and data.
 */
export const useFetchData = ({ queryKey, queryFn, options = {}, }) => {
    const { pause, defaultData } = options;
    const cached = cache.get(queryKey);
    const { data, error, status } = cached !== null && cached !== void 0 ? cached : {};
    const fetchData = useCallback(async () => {
        const cached = cache.get(queryKey);
        if ((cached === null || cached === void 0 ? void 0 : cached.status) === "fetching") {
            return;
        }
        cache.set(queryKey, { ...cache.get(queryKey), status: "fetching" });
        try {
            const result = await queryFn();
            const cacheEntry = {
                data: result,
                error: null,
                status: "success",
            };
            cache.set(queryKey, cacheEntry);
            return cacheEntry;
        }
        catch (error) {
            const cacheEntry = {
                data: null,
                error: error,
                status: "error",
            };
            cache.set(queryKey, cacheEntry);
            return cacheEntry;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stringifyVariables(queryKey)]);
    useCacheKey(cache, queryKey);
    useEffect(() => {
        if (pause) {
            cache.set(queryKey, { ...cache.get(queryKey), status: "idle" });
            return;
        }
        if (cached.status === "idle") {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pause, fetchData, stringifyVariables(queryKey), cached.data]);
    const invalidate = useCallback(() => {
        fetchData();
    }, [fetchData]);
    return { data: data !== null && data !== void 0 ? data : defaultData, error, status, invalidate };
};
/**
 * Use this to populate (hydrate) the client store with the server side data
 */
export const useHydrate = (queryKey, data) => {
    const hasHydrated = useRef(false);
    if (!hasHydrated.current) {
        cache.set(queryKey, { data, error: null, status: "success" });
        hasHydrated.current = true;
    }
};
/**
 * Tracks a server mutation with loading/error states
 */
export const useMutate = (queryFn) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("idle");
    const mutate = useCallback(async (...args) => {
        setStatus("fetching");
        try {
            const result = await queryFn(...args);
            setData(result);
            setStatus("success");
            return result;
        }
        catch (error) {
            setError(error);
            setStatus("error");
        }
    }, [queryFn]);
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setStatus("idle");
    }, []);
    return { data, error, status, mutate, reset };
};
