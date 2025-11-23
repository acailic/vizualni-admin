export const executeWithCache = async (sparqlClient, query, execute, parse, cache) => {
    const key = `${sparqlClient.query.endpoint.endpointUrl} - ${query}`;
    const cached = cache === null || cache === void 0 ? void 0 : cache.get(key);
    if (cached) {
        return cached;
    }
    const result = await execute();
    const parsed = parse(result);
    if (cache) {
        cache.set(key, parsed);
    }
    return parsed;
};
