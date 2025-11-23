import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
const LEGACY_EMBED_QUERY_PARAMS = ["disableBorder"];
const migrateEmbedQueryParam = (param) => {
    switch (param) {
        case "disableBorder":
            return "removeBorder";
        case "optimizeSpace":
        case "removeLabelsInteractivity":
        case "removeBorder":
        case "removeFootnotes":
        case "removeFilters":
        case "removeMoreOptionsButton":
            return param;
        default:
            const _exhaustiveCheck = param;
            return _exhaustiveCheck;
    }
};
const EMBED_QUERY_PARAMS = [
    "removeBorder",
    "optimizeSpace",
    "removeMoreOptionsButton",
    "removeLabelsInteractivity",
    "removeFootnotes",
    "removeFilters",
];
export const isEmbedQueryParam = (param) => {
    return [...LEGACY_EMBED_QUERY_PARAMS, ...EMBED_QUERY_PARAMS].includes(param);
};
export const getEmbedParamsFromQuery = (query) => {
    return [
        ...LEGACY_EMBED_QUERY_PARAMS,
        ...EMBED_QUERY_PARAMS,
    ].reduce((acc, param) => {
        const value = query[param];
        if (value === "true") {
            acc[migrateEmbedQueryParam(param)] = true;
        }
        return acc;
    }, {
        removeBorder: false,
        optimizeSpace: false,
        removeMoreOptionsButton: false,
        removeLabelsInteractivity: false,
        removeFootnotes: false,
        removeFilters: false,
    });
};
const buildEmbedQueryParams = (embedParams) => {
    return Object.fromEntries(Object.entries(embedParams)
        .filter(([_, v]) => v)
        .map(([k]) => [k, "true"]));
};
export const getEmbedParamsQueryString = (embedParams) => {
    const queryObject = buildEmbedQueryParams(embedParams);
    const searchParams = new URLSearchParams(queryObject);
    return searchParams.toString();
};
export const useEmbedQueryParams = () => {
    const router = useRouter();
    const embedParams = useMemo(() => {
        return getEmbedParamsFromQuery(router.query);
    }, [router.query]);
    const setEmbedQueryParam = useCallback((param, value) => {
        const updatedParams = { ...embedParams, [param]: value };
        const nonEmbedParams = Object.fromEntries(Object.entries(router.query).filter(([key]) => !isEmbedQueryParam(key)));
        router.replace({
            pathname: router.pathname,
            query: {
                ...nonEmbedParams,
                ...buildEmbedQueryParams(updatedParams),
            },
        }, undefined, { shallow: true });
    }, [embedParams, router]);
    return {
        embedParams,
        setEmbedQueryParam,
    };
};
