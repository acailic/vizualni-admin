import isEqual from "lodash/isEqual";
import uniq from "lodash/uniq";
import { createContext, useContext, useMemo, useRef, } from "react";
import create from "zustand";
import { getChartSpec } from "@/charts/chart-config-ui-options";
import { canDimensionBeMultiFiltered } from "@/domain/data";
import { truthy } from "@/domain/types";
import { getOriginalIds, isJoinById } from "@/graphql/join";
import { createBoundUseStoreWithSelector, } from "@/stores/utils";
import { assert } from "@/utils/assert";
const interactiveFiltersStoreCreator = (set) => {
    return {
        categories: {},
        addCategory: (category) => {
            set((state) => ({
                categories: { ...state.categories, [category]: true },
            }));
        },
        removeCategory: (category) => {
            set((state) => {
                delete state.categories[category];
                return { categories: { ...state.categories } };
            });
        },
        resetCategories: () => {
            set({
                categories: {},
            });
        },
        timeRange: {
            from: undefined,
            to: undefined,
        },
        setTimeRange: (from, to) => {
            set({
                timeRange: { from, to },
            });
        },
        timeSlider: {
            type: "interval",
            value: undefined,
        },
        setTimeSlider: ({ type, value }) => {
            set({
                timeSlider: { type, value },
            });
        },
        resetTimeSlider: () => {
            set((state) => ({
                timeSlider: { ...state.timeSlider, value: undefined },
            }));
        },
        dataFilters: {},
        setDataFilters: (dataFilters) => {
            set({ dataFilters });
        },
        updateDataFilter: (dimensionId, dimensionValue) => {
            set((state) => ({
                dataFilters: {
                    ...state.dataFilters,
                    [dimensionId]: {
                        type: "single",
                        value: dimensionValue,
                    },
                },
            }));
        },
        setMultiDataFilter: (dimensionId, values) => {
            set((state) => ({
                dataFilters: {
                    ...state.dataFilters,
                    [dimensionId]: {
                        type: "multi",
                        values: Object.fromEntries(values.map((v) => [v, true])),
                    },
                },
            }));
        },
        addDataFilterValue: (dimensionId, value) => {
            set((state) => {
                const currentFilter = state.dataFilters[dimensionId];
                if ((currentFilter === null || currentFilter === void 0 ? void 0 : currentFilter.type) === "single") {
                    return {
                        dataFilters: {
                            ...state.dataFilters,
                            [dimensionId]: {
                                type: "multi",
                                values: {
                                    [currentFilter.value]: true,
                                    [value]: true,
                                },
                            },
                        },
                    };
                }
                if ((currentFilter === null || currentFilter === void 0 ? void 0 : currentFilter.type) === "multi") {
                    return {
                        dataFilters: {
                            ...state.dataFilters,
                            [dimensionId]: {
                                type: "multi",
                                values: {
                                    ...currentFilter.values,
                                    [value]: true,
                                },
                            },
                        },
                    };
                }
                return {
                    dataFilters: {
                        ...state.dataFilters,
                        [dimensionId]: {
                            type: "multi",
                            values: { [value]: true },
                        },
                    },
                };
            });
        },
        removeDataFilterValue: (dimensionId, value) => {
            set((state) => {
                const currentFilter = state.dataFilters[dimensionId];
                if ((currentFilter === null || currentFilter === void 0 ? void 0 : currentFilter.type) === "multi") {
                    const newValues = { ...currentFilter.values };
                    delete newValues[value];
                    const remainingValues = Object.keys(newValues);
                    if (remainingValues.length === 1) {
                        return {
                            dataFilters: {
                                ...state.dataFilters,
                                [dimensionId]: {
                                    type: "single",
                                    value: remainingValues[0],
                                },
                            },
                        };
                    }
                    if (remainingValues.length === 0) {
                        const newDataFilters = { ...state.dataFilters };
                        delete newDataFilters[dimensionId];
                        return { dataFilters: newDataFilters };
                    }
                    return {
                        dataFilters: {
                            ...state.dataFilters,
                            [dimensionId]: {
                                type: "multi",
                                values: newValues,
                            },
                        },
                    };
                }
                if ((currentFilter === null || currentFilter === void 0 ? void 0 : currentFilter.type) === "single" && currentFilter.value === value) {
                    const newDataFilters = { ...state.dataFilters };
                    delete newDataFilters[dimensionId];
                    return { dataFilters: newDataFilters };
                }
                return { dataFilters: state.dataFilters };
            });
        },
        resetDataFilters: () => {
            set({ dataFilters: {} });
        },
        calculation: {
            type: undefined,
        },
        setCalculationType: (calculationType) => {
            set({ calculation: { type: calculationType } });
        },
        annotations: {},
        setAnnotations: (annotations) => {
            set({ annotations });
        },
        updateAnnotation: (key, show) => {
            set((state) => ({
                annotations: {
                    ...state.annotations,
                    [key]: show,
                },
            }));
        },
    };
};
const InteractiveFiltersContext = createContext(undefined);
const getPotentialTimeRangeFilterIds = (chartConfigs) => {
    const temporalDimensions = chartConfigs.flatMap((config) => {
        const chartSpec = getChartSpec(config);
        const temporalEncodings = chartSpec.encodings.filter((x) => x.componentTypes.some((x) => x === "TemporalDimension" || x === "TemporalEntityDimension"));
        const chartTemporalDimensions = temporalEncodings
            .map((encoding) => {
            const field = encoding.field in config.fields
                ? // @ts-expect-error ts(7053) - Not possible to narrow down here, but we check for undefined below
                    config.fields[encoding.field]
                : undefined;
            if (field && "componentId" in field) {
                const candidateIds = isJoinById(field.componentId)
                    ? getOriginalIds(field.componentId, config)
                    : [field.componentId];
                return candidateIds.map((componentId) => ({
                    componentId,
                    chartKey: config.key,
                }));
            }
        })
            .flat()
            .filter(truthy);
        return chartTemporalDimensions;
    });
    return temporalDimensions.map((dimension) => dimension.componentId);
};
export const getPotentialDataFilterIds = (chartConfigs) => {
    const dimensionIdCounts = new Map();
    chartConfigs.forEach((config) => {
        const dimensionIds = uniq(config.cubes
            .map((cube) => cube.filters)
            .flatMap((filters) => {
            return Object.entries(filters)
                .filter(([_, filter]) => filter.type === "single" || filter.type === "multi")
                .map(([dimensionId]) => dimensionId)
                .concat(config.chartType === "table"
                ? Object.entries(config.fields)
                    .map(([componentId, field]) => canDimensionBeMultiFiltered({
                    __typename: field.componentType,
                })
                    ? componentId
                    : undefined)
                    .filter(truthy)
                : []);
        }));
        dimensionIds.forEach((dimensionId) => {
            var _a;
            dimensionIdCounts.set(dimensionId, ((_a = dimensionIdCounts.get(dimensionId)) !== null && _a !== void 0 ? _a : 0) + 1);
        });
    });
    const sharedDimensionIds = Array.from(dimensionIdCounts.entries())
        .filter(([_, count]) => count > 1)
        .map(([dimensionId]) => dimensionId);
    return sharedDimensionIds;
};
/**
 * Creates and provides all the interactive filters stores for the given chartConfigs.
 */
export const InteractiveFiltersProvider = ({ children, chartConfigs, }) => {
    const storeRefs = useRef({});
    const boundSelectorRefs = useRef({});
    const potentialTimeRangeFilterIds = useMemo(() => {
        return getPotentialTimeRangeFilterIds(chartConfigs);
    }, [chartConfigs]);
    const potentialDataFilterIds = useMemo(() => {
        return getPotentialDataFilterIds(chartConfigs);
    }, [chartConfigs]);
    const stores = useMemo(() => {
        return Object.fromEntries(chartConfigs.map((chartConfig) => {
            var _a;
            const store = (_a = storeRefs.current[chartConfig.key]) !== null && _a !== void 0 ? _a : create(interactiveFiltersStoreCreator);
            storeRefs.current[chartConfig.key] = store;
            if (!boundSelectorRefs.current[chartConfig.key]) {
                boundSelectorRefs.current[chartConfig.key] =
                    createBoundUseStoreWithSelector(store);
            }
            const ctxValue = [
                store.getState,
                boundSelectorRefs.current[chartConfig.key],
                store,
            ];
            return [chartConfig.key, ctxValue];
        }));
    }, [chartConfigs]);
    const ctxValueRef = useRef();
    const newCtxValue = {
        potentialTimeRangeFilterIds,
        potentialDataFilterIds,
        stores,
    };
    if (!ctxValueRef.current || !isEqual(ctxValueRef.current, newCtxValue)) {
        ctxValueRef.current = newCtxValue;
    }
    const ctxValue = ctxValueRef.current;
    return (<InteractiveFiltersContext.Provider value={ctxValue}>
      {children}
    </InteractiveFiltersContext.Provider>);
};
/**
 * Provides the chartConfig key to children, so that they know which interactive filters
 * store they should use.
 */
const InteractiveFiltersChartContext = createContext(null);
export const InteractiveFiltersChartProvider = ({ chartConfigKey, children, }) => {
    return (<InteractiveFiltersChartContext.Provider value={chartConfigKey}>
      {children}
    </InteractiveFiltersChartContext.Provider>);
};
export const useChartInteractiveFilters = (selector) => {
    const ctx = useContext(InteractiveFiltersContext);
    const key = useContext(InteractiveFiltersChartContext);
    assert(ctx, `ctx=${ctx}. useChartInteractiveFilters must be called inside a InteractiveFiltersChartProvider.`);
    assert(key, `key=${key}. useChartInteractiveFilters must be called inside a InteractiveFiltersChartProvider.`);
    const [, useStore] = ctx.stores[key];
    return useStore(selector);
};
export const useInteractiveFiltersGetState = () => {
    const ctx = useContext(InteractiveFiltersContext);
    const key = useContext(InteractiveFiltersChartContext);
    assert(ctx, "useInteractiveFilters must be called inside a InteractiveFiltersContext.Provider!");
    assert(key, "useInteractiveFilters must be called inside a InteractiveFiltersChartContext.Provider!");
    const [getState] = ctx.stores[key];
    return getState;
};
export const useDashboardInteractiveFilters = () => {
    const ctx = useContext(InteractiveFiltersContext);
    assert(ctx, "useInteractiveFilters must be called inside a InteractiveFiltersContext.Provider!");
    return ctx;
};
export const setDataFilter = (store, key, value) => {
    store.setState({
        dataFilters: {
            ...store.getState().dataFilters,
            [key]: { type: "single", value },
        },
    });
};
