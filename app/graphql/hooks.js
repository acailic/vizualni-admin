import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClient } from "urql";
import { hasChartConfigs, } from "@/configurator";
import { truthy } from "@/domain/types";
import { createLocalizedString } from "@/locales/localized-string";
import { assert } from "@/utils/assert";
import { joinDimensions, mergeObservations } from "./join";
import { DataCubeComponentsDocument, DataCubeComponentTermsetsDocument, DataCubeMetadataDocument, DataCubeObservationsDocument, } from "./query-hooks";
const queryResultsCache = new Map();
const useQueryKey = (options) => {
    return useMemo(() => {
        return JSON.stringify(options);
    }, [options]);
};
export const makeUseQuery = ({ fetch, check, transform, }) => (options) => {
    var _a;
    const client = useClient();
    const { keepPreviousData } = options;
    const queryKey = useQueryKey(options);
    const cachedResult = queryResultsCache.get(queryKey);
    const [rawResult, setRawResult] = useState(cachedResult || { fetching: !options.pause, queryKey: null, data: null });
    const currentQueryRef = useRef();
    if (!options.pause && check) {
        check(options.variables);
    }
    const executeQuery = useCallback(async (options) => {
        const currentQuery = queryKey;
        currentQueryRef.current = currentQuery;
        setRawResult((prev) => ({
            ...prev,
            fetching: false,
            data: prev.queryKey === queryKey || keepPreviousData ? prev.data : null,
            queryKey,
        }));
        if (check) {
            check(options.variables);
        }
        const result = await fetch(client, options.variables, () => {
            if (currentQueryRef.current === currentQuery) {
                setRawResult((prev) => ({
                    ...prev,
                    fetching: true,
                }));
            }
        });
        if (currentQueryRef.current === currentQuery) {
            const finalResult = { ...result, queryKey };
            queryResultsCache.set(queryKey, finalResult);
            setRawResult(finalResult);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryKey]);
    useEffect(() => {
        if (options.pause) {
            return;
        }
        executeQuery(options);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryKey, options.pause]);
    const result = useMemo(() => {
        var _a;
        if (!transform || !((_a = options.chartConfig) === null || _a === void 0 ? void 0 : _a.conversionUnitsByComponentId)) {
            return rawResult;
        }
        return transform(rawResult, {
            locale: options.variables.locale,
            conversionUnitsByComponentId: options.chartConfig.conversionUnitsByComponentId,
        });
    }, [
        rawResult,
        options.variables.locale,
        (_a = options.chartConfig) === null || _a === void 0 ? void 0 : _a.conversionUnitsByComponentId,
    ]);
    return [result, executeQuery];
};
const executeDataCubesMetadataQuery = async (client, variables, 
/** Callback triggered when data fetching starts (cache miss). */
onFetching) => {
    var _a;
    const { locale, sourceType, sourceUrl, cubeFilters } = variables;
    const queries = await Promise.all(cubeFilters.map((cubeFilter) => {
        const cubeVariables = { locale, sourceType, sourceUrl, cubeFilter };
        const cached = client.readQuery(DataCubeMetadataDocument, cubeVariables);
        if (cached) {
            return Promise.resolve(cached);
        }
        onFetching === null || onFetching === void 0 ? void 0 : onFetching();
        return client
            .query(DataCubeMetadataDocument, cubeVariables)
            .toPromise();
    }));
    const error = (_a = queries.find((q) => q.error)) === null || _a === void 0 ? void 0 : _a.error;
    const fetching = !error && queries.some((q) => !q.data);
    return {
        data: error || fetching
            ? undefined
            : { dataCubesMetadata: queries.map((q) => q.data.dataCubeMetadata) },
        error,
        fetching,
    };
};
export const useDataCubesMetadataQuery = makeUseQuery({
    fetch: executeDataCubesMetadataQuery,
});
export const executeDataCubesComponentsQuery = async (client, variables, 
/** Callback triggered when data fetching starts (cache miss). */
onFetching) => {
    var _a, _b;
    const { locale, sourceType, sourceUrl, cubeFilters } = variables;
    const joinBy = Object.fromEntries(cubeFilters
        .map((x) => {
        return [x.iri, x.joinBy];
    })
        .filter(truthy));
    const queries = await Promise.all(cubeFilters.map((cubeFilter) => {
        const cubeVariables = {
            locale,
            sourceType,
            sourceUrl,
            cubeFilter,
        };
        const cached = client.readQuery(DataCubeComponentsDocument, cubeVariables);
        if (cached) {
            return Promise.resolve(cached);
        }
        onFetching === null || onFetching === void 0 ? void 0 : onFetching();
        return client
            .query(DataCubeComponentsDocument, cubeVariables)
            .toPromise();
    }));
    const error = (_a = queries.find((q) => q.error)) === null || _a === void 0 ? void 0 : _a.error;
    const fetching = !error && queries.some((q) => !q.data);
    if (error || fetching) {
        return {
            data: undefined,
            error,
            fetching,
        };
    }
    const { dimensions: firstDimensions = [], measures: firstMeasures = [] } = ((_b = queries[0].data) === null || _b === void 0 ? void 0 : _b.dataCubeComponents) || {};
    assert(firstDimensions !== undefined, "Undefined dimensions");
    assert(firstMeasures !== undefined, "Undefined measures");
    return {
        data: queries.length === 1
            ? {
                dataCubesComponents: {
                    dimensions: firstDimensions,
                    measures: firstMeasures,
                },
            }
            : {
                dataCubesComponents: {
                    dimensions: joinDimensions({
                        joinBy,
                        dimensions: queries
                            .map((q) => {
                            var _a;
                            const dataCubeComponents = (_a = q.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponents;
                            assert(dataCubeComponents !== undefined, "Undefined dataCubeComponents");
                            return dataCubeComponents.dimensions;
                        })
                            .filter(truthy)
                            .flat(),
                    }),
                    measures: queries.flatMap((q) => {
                        var _a;
                        const measures = (_a = q.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponents.measures;
                        assert(measures !== undefined, "Undefined measures");
                        return measures;
                    }),
                },
            },
        error,
        fetching,
    };
};
/** Fetches components/dimensions along with the values */
export const useDataCubesComponentsQuery = makeUseQuery({
    fetch: executeDataCubesComponentsQuery,
    transform: transformDataCubesComponents,
});
/**
 * Transforms the data from the data cubes components query, converting
 * the values to the overridden unit.
 *
 * @param data - The data from the data cubes components query.
 * @param options - The options for the data cubes components query.
 * @returns The transformed data.
 */
export function transformDataCubesComponents(data, options) {
    const { locale, conversionUnitsByComponentId } = options;
    if (!data.data ||
        !conversionUnitsByComponentId ||
        Object.keys(conversionUnitsByComponentId).length === 0) {
        return data;
    }
    return {
        ...data,
        data: {
            ...data.data,
            dataCubesComponents: {
                ...data.data.dataCubesComponents,
                measures: data.data.dataCubesComponents.measures.map((measure) => {
                    var _a;
                    const conversionUnit = conversionUnitsByComponentId[measure.id];
                    if (!conversionUnit) {
                        return measure;
                    }
                    const labels = createLocalizedString(conversionUnit.labels);
                    return {
                        ...measure,
                        unit: (_a = labels[locale]) !== null && _a !== void 0 ? _a : measure.unit,
                        originalUnit: measure.unit,
                        limits: measure.limits.map((limit) => {
                            switch (limit.type) {
                                case "single":
                                    const singleLimit = {
                                        ...limit,
                                        value: convertValue(limit.value, conversionUnit),
                                    };
                                    return singleLimit;
                                case "value-range":
                                    const verticalRangeLimit = {
                                        ...limit,
                                        min: convertValue(limit.min, conversionUnit),
                                        max: convertValue(limit.max, conversionUnit),
                                    };
                                    return verticalRangeLimit;
                                case "time-range":
                                    const horizontalRangeLimit = {
                                        ...limit,
                                        value: convertValue(limit.value, conversionUnit),
                                    };
                                    return horizontalRangeLimit;
                                default:
                                    const _exhaustiveCheck = limit;
                                    return _exhaustiveCheck;
                            }
                        }),
                        values: measure.values.map((value) => {
                            if (typeof value.value === "number") {
                                return {
                                    ...value,
                                    value: convertValue(value.value, conversionUnit),
                                };
                            }
                            if (typeof value.value === "string") {
                                return {
                                    ...value,
                                    value: convertValue(Number(value.value), conversionUnit),
                                };
                            }
                            return value;
                        }),
                    };
                }),
            },
        },
    };
}
const convertValue = (value, conversionUnit) => {
    return value * conversionUnit.multiplier;
};
export const executeDataCubesObservationsQuery = async (client, variables, 
/** Callback triggered when data fetching starts (cache miss). */
onFetching) => {
    var _a, _b, _c;
    const { locale, sourceType, sourceUrl, cubeFilters } = variables;
    const queries = await Promise.all(cubeFilters.map((cubeFilter) => {
        const cubeVariables = { locale, sourceType, sourceUrl, cubeFilter };
        const cached = client.readQuery(DataCubeObservationsDocument, cubeVariables);
        if (cached) {
            return Promise.resolve(cached);
        }
        onFetching === null || onFetching === void 0 ? void 0 : onFetching();
        // If not in cache, execute the query
        return client
            .query(DataCubeObservationsDocument, cubeVariables)
            .toPromise();
    }));
    const error = (_a = queries.find((q) => q.error)) === null || _a === void 0 ? void 0 : _a.error;
    const fetching = !error && queries.some((q) => !q.data);
    if (error || fetching) {
        return {
            data: undefined,
            error,
            fetching,
        };
    }
    const observations = 
    // If we are fetching data from multiple cubes, we need to merge them into one
    queries.length > 1
        ? mergeObservations(queries)
        : // If we are fetching data from a single cube, we can just return the data
            (_c = (_b = queries[0].data) === null || _b === void 0 ? void 0 : _b.dataCubeObservations) === null || _c === void 0 ? void 0 : _c.data;
    return {
        data: {
            dataCubesObservations: {
                data: observations,
                sparqlEditorUrls: queries.flatMap((q) => {
                    var _a, _b, _c;
                    return ({
                        cubeIri: (_a = q.operation.variables) === null || _a === void 0 ? void 0 : _a.cubeFilter.iri,
                        url: (_c = (_b = q.data) === null || _b === void 0 ? void 0 : _b.dataCubeObservations) === null || _c === void 0 ? void 0 : _c.sparqlEditorUrl,
                    });
                }),
            },
        },
        error,
        fetching,
    };
};
export const useDataCubesObservationsQuery = makeUseQuery({
    fetch: executeDataCubesObservationsQuery,
    transform: transformDataCubesObservations,
});
/**
 * Transforms the data from the data cubes observations query, converting
 * the values to the overridden unit.
 *
 * @param data - The data from the data cubes observations query.
 * @param options - The options for the data cubes observations query.
 * @returns The transformed data.
 */
export function transformDataCubesObservations(data, options) {
    const { conversionUnitsByComponentId } = options;
    if (!data.data ||
        !conversionUnitsByComponentId ||
        Object.keys(conversionUnitsByComponentId).length === 0) {
        return data;
    }
    return {
        ...data,
        data: {
            dataCubesObservations: {
                ...data.data.dataCubesObservations,
                data: data.data.dataCubesObservations.data.map((observation) => {
                    const newObservation = { ...observation };
                    Object.entries(conversionUnitsByComponentId).forEach(([componentId, conversionUnit]) => {
                        if (componentId in newObservation) {
                            const value = newObservation[componentId];
                            if (typeof value === "number") {
                                newObservation[componentId] = convertValue(value, conversionUnit);
                            }
                            else if (typeof value === "string") {
                                newObservation[componentId] = convertValue(Number(value), conversionUnit);
                            }
                        }
                    });
                    return newObservation;
                }),
            },
        },
    };
}
/**
 * Fetches all cubes components in one go. Is useful in contexts where we deal
 * with all the cubes at once, for example the shared dashboard filters.
 */
const executeFetchAllUsedCubeComponents = async (client, variables) => {
    var _a;
    const { state, locale } = variables;
    const { dataSource } = state;
    assert(hasChartConfigs(state), "Expected state with chart configs");
    const cubeFilters = state.chartConfigs.map((config) => {
        return config.cubes.map((x) => ({
            iri: x.iri,
            joinBy: x.joinBy,
            loadValues: true,
        }));
    });
    // executeDataCubesComponentsQuery dedupes queries through urql cache
    const dataCubesComponents = await Promise.all(cubeFilters.map((cf) => executeDataCubesComponentsQuery(client, {
        cubeFilters: cf,
        locale,
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
    })));
    return {
        error: (_a = dataCubesComponents.find((x) => x.error)) === null || _a === void 0 ? void 0 : _a.error,
        fetching: dataCubesComponents.some((x) => x.fetching),
        data: {
            dataCubesComponents: {
                dimensions: dataCubesComponents.flatMap((x) => { var _a, _b; return (_b = (_a = x === null || x === void 0 ? void 0 : x.data) === null || _a === void 0 ? void 0 : _a.dataCubesComponents.dimensions) !== null && _b !== void 0 ? _b : []; }),
                measures: dataCubesComponents.flatMap((x) => { var _a, _b; return (_b = (_a = x === null || x === void 0 ? void 0 : x.data) === null || _a === void 0 ? void 0 : _a.dataCubesComponents.measures) !== null && _b !== void 0 ? _b : []; }),
            },
        },
    };
};
export const useConfigsCubeComponents = makeUseQuery({
    fetch: executeFetchAllUsedCubeComponents,
});
/**
 * Fetches all cubes termsets in one go.
 */
const executeDataCubesTermsetsQuery = async (client, variables, 
/** Callback triggered when data fetching starts (cache miss). */
onFetching) => {
    var _a, _b;
    const { locale, sourceType, sourceUrl, cubeFilters } = variables;
    const queries = await Promise.all(cubeFilters.map((cubeFilter) => {
        const cubeVariables = { locale, sourceType, sourceUrl, cubeFilter };
        // Try to read from cache first
        const cached = client.readQuery(DataCubeComponentTermsetsDocument, cubeVariables);
        if (cached) {
            return Promise.resolve(cached);
        }
        onFetching === null || onFetching === void 0 ? void 0 : onFetching();
        // If not in cache, execute the query
        return client
            .query(DataCubeComponentTermsetsDocument, cubeVariables)
            .toPromise();
    }));
    const error = (_a = queries.find((q) => q.error)) === null || _a === void 0 ? void 0 : _a.error;
    const fetching = !error && queries.some((q) => !q.data);
    if (error || fetching) {
        return {
            data: undefined,
            error,
            fetching,
        };
    }
    const termsets = 
    // If we are fetching data from multiple cubes, we need to merge them into one
    (queries.length > 1
        ? queries.map((q) => { var _a; return (_a = q.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponentTermsets; }).flat()
        : // If we are fetching data from a single cube, we can just return the data
            (_b = queries[0].data) === null || _b === void 0 ? void 0 : _b.dataCubeComponentTermsets).filter(truthy);
    return {
        data: {
            dataCubeComponentTermsets: termsets,
        },
        error,
        fetching,
    };
};
export const useDataCubesComponentTermsetsQuery = makeUseQuery({
    fetch: executeDataCubesTermsetsQuery,
});
