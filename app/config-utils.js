import { bisectCenter } from "d3-array";
import { useMemo } from "react";
import { getAnimationField, } from "@/config-types";
import { useConfiguratorState } from "@/configurator/configurator-state";
import { isTemporalDimensionWithTimeUnit, } from "@/domain/data";
import { truthy } from "@/domain/types";
import { useTimeFormatUnit } from "@/formatters";
import { mkJoinById } from "@/graphql/join";
import { useChartInteractiveFilters, useDashboardInteractiveFilters, } from "@/stores/interactive-filters";
const isFilterValueSingle = (v) => {
    return v.type === "single";
};
export const isSingleFilters = (filters) => {
    return Object.values(filters).every(isFilterValueSingle);
};
export const extractSingleFilters = (filters) => {
    return Object.fromEntries(Object.entries(filters).filter(([, value]) => value.type === "single"));
};
export const makeMultiFilter = (values) => {
    return {
        type: "multi",
        values: Object.fromEntries(values.map((d) => [d, true])),
    };
};
/** Use to extract the chart config from configurator state. Handy in the editor mode,
 * where the is a need to edit the active chart config.
 *
 * @param state configurator state
 * @param chartKey optional chart key. If not provided, the active chart config will be returned.
 *
 */
export const getChartConfig = (state, chartKey) => {
    var _a;
    if (state.state === "INITIAL" || state.state === "SELECTING_DATASET") {
        throw Error("No chart config available!");
    }
    const { chartConfigs, activeChartKey } = state;
    const key = chartKey !== null && chartKey !== void 0 ? chartKey : activeChartKey;
    return (_a = chartConfigs.find((d) => d.key === key)) !== null && _a !== void 0 ? _a : chartConfigs[0];
};
/**
 * Get all filters from cubes and returns an object containing all values.
 */
export const getChartConfigFilters = (cubes, { cubeIri, joined, } = {}) => {
    const relevantCubes = cubes.filter((c) => cubeIri ? c.iri === cubeIri : true);
    const dimIdToJoinId = joined
        ? Object.fromEntries(relevantCubes.flatMap((x) => {
            var _a;
            return ((_a = x.joinBy) !== null && _a !== void 0 ? _a : []).map((iri, index) => [iri, mkJoinById(index)]);
        }))
        : {};
    return Object.fromEntries(relevantCubes.flatMap((c) => Object.entries(c.filters).map(([id, value]) => {
        var _a;
        return [
            (_a = dimIdToJoinId[id]) !== null && _a !== void 0 ? _a : id,
            value,
        ];
    })));
};
export const useChartConfigFilters = (chartConfig, options) => {
    return useMemo(() => {
        return getChartConfigFilters(chartConfig.cubes, {
            cubeIri: options === null || options === void 0 ? void 0 : options.cubeIri,
            joined: options === null || options === void 0 ? void 0 : options.joined,
        });
    }, [chartConfig.cubes, options === null || options === void 0 ? void 0 : options.cubeIri, options === null || options === void 0 ? void 0 : options.joined]);
};
export const useDefinitiveTemporalFilterValue = ({ dimensions, }) => {
    const [state] = useConfiguratorState();
    const chartConfig = getChartConfig(state);
    const definitiveFilters = useDefinitiveFilters();
    const temporalDims = dimensions.filter(isTemporalDimensionWithTimeUnit);
    const temporalFilters = Object.entries(definitiveFilters)
        .map(([id, f]) => {
        return temporalDims.some((d) => d.id === id) && f.type === "single"
            ? f
            : undefined;
    })
        .filter(truthy);
    const animationDim = temporalDims.find((d) => { var _a; return d.id === ((_a = getAnimationField(chartConfig)) === null || _a === void 0 ? void 0 : _a.componentId); });
    const timeFormatUnit = useTimeFormatUnit();
    const timeUnit = animationDim === null || animationDim === void 0 ? void 0 : animationDim.timeUnit;
    const { value: timeSliderValue } = useChartInteractiveFilters((d) => d.timeSlider);
    const formattedTimeSliderValue = timeUnit && timeSliderValue
        ? timeFormatUnit(new Date(timeSliderValue), timeUnit)
        : undefined;
    const closestTemporalTimeSliderValue = useMemo(() => {
        var _a;
        if (!animationDim || !formattedTimeSliderValue) {
            return undefined;
        }
        const closesValueIndex = bisectCenter(animationDim.values.map((d) => d.value), formattedTimeSliderValue);
        return (_a = animationDim.values[closesValueIndex]) === null || _a === void 0 ? void 0 : _a.value;
    }, [animationDim, formattedTimeSliderValue]);
    if (closestTemporalTimeSliderValue) {
        return closestTemporalTimeSliderValue;
    }
    if (temporalFilters.length > 1) {
        console.warn("More than one temporal filter found. Using the first one.");
    }
    return temporalFilters.length === 1 ? temporalFilters[0].value : undefined;
};
export const useDefinitiveFilters = () => {
    const [state] = useConfiguratorState();
    const chartConfig = getChartConfig(state);
    const filters = useChartConfigFilters(chartConfig);
    const dataFilters = useChartInteractiveFilters((d) => d.dataFilters);
    const dashboardFilters = useDashboardInteractiveFilters();
    const definitiveFilters = useMemo(() => {
        const definitiveFilters = {};
        for (const [k, v] of Object.entries(filters)) {
            definitiveFilters[k] = v;
        }
        for (const [k, v] of Object.entries(dataFilters)) {
            definitiveFilters[k] = v;
        }
        for (const [getState] of Object.values(dashboardFilters.stores)) {
            const state = getState();
            for (const [k, v] of Object.entries(state.dataFilters)) {
                definitiveFilters[k] = v;
            }
        }
        return definitiveFilters;
    }, [filters, dataFilters, dashboardFilters]);
    return definitiveFilters;
};
/** Get the limit from the chart config that is related to the given measure
 * and dimension along with additional metadata.
 */
export const getMaybeValidChartConfigLimit = ({ chartConfig, measureId, limit, axisDimension, filters, }) => {
    var _a, _b, _c;
    const relatedAxisDimensionValue = axisDimension
        ? (_a = limit.related.find((r) => r.dimensionId === axisDimension.id)) === null || _a === void 0 ? void 0 : _a.value
        : undefined;
    const relatedAxisDimensionValueLabel = axisDimension
        ? (_b = [...axisDimension.values, ...axisDimension.relatedLimitValues].find((v) => v.value === relatedAxisDimensionValue)) === null || _b === void 0 ? void 0 : _b.label
        : undefined;
    const relatedToFilterBys = axisDimension
        ? limit.related.filter((r) => r.dimensionId !== axisDimension.id)
        : limit.related;
    for (const relatedToFilterBy of relatedToFilterBys) {
        const maybeFilter = filters[relatedToFilterBy.dimensionId];
        const maybeFilterValue = maybeFilter && isFilterValueSingle(maybeFilter)
            ? maybeFilter.value
            : undefined;
        if (maybeFilterValue !== relatedToFilterBy.value) {
            return {
                limit: undefined,
                relatedAxisDimensionValueLabel,
                wouldBeValid: false,
            };
        }
    }
    const measureConfigLimits = (_c = chartConfig.limits[measureId]) !== null && _c !== void 0 ? _c : [];
    return {
        limit: measureConfigLimits.find((configLimit) => {
            if (configLimit.related.length !== limit.related.length) {
                return false;
            }
            return configLimit.related.every((cr) => {
                return limit.related.some((lr) => {
                    return lr.dimensionId === cr.dimensionId && lr.value === cr.value;
                });
            });
        }),
        relatedAxisDimensionValueLabel,
        wouldBeValid: true,
    };
};
export const getAxisDimension = ({ chartConfig, dimensions, }) => {
    switch (chartConfig.chartType) {
        case "area":
        case "column":
        case "line":
            return dimensions.find((d) => d.id === chartConfig.fields.x.componentId);
        case "bar":
            return dimensions.find((d) => d.id === chartConfig.fields.y.componentId);
        // For maps, we don't really have a "related dimension", as it's used as single filter.
        case "map":
            return;
        // These chart types do not support the display of the limits.
        case "comboLineColumn":
        case "comboLineDual":
        case "comboLineSingle":
        case "pie":
        case "scatterplot":
        case "table":
            return;
        default:
            const _exhaustiveCheck = chartConfig;
            return _exhaustiveCheck;
    }
};
const getLimitMeasure = ({ chartConfig, measures, }) => {
    switch (chartConfig.chartType) {
        case "area":
        case "column":
        case "line":
            return measures.find((d) => d.id === chartConfig.fields.y.componentId);
        case "bar":
            return measures.find((d) => d.id === chartConfig.fields.x.componentId);
        case "map":
            return measures.find((d) => { var _a; return d.id === ((_a = chartConfig.fields.symbolLayer) === null || _a === void 0 ? void 0 : _a.measureId); });
        case "comboLineColumn":
        case "comboLineDual":
        case "comboLineSingle":
        case "pie":
        case "scatterplot":
        case "table":
            return;
        default:
            const _exhaustiveCheck = chartConfig;
            return _exhaustiveCheck;
    }
};
export const useLimits = ({ chartConfig, dimensions, measures, }) => {
    const filters = useDefinitiveFilters();
    const limitMeasure = getLimitMeasure({ chartConfig, measures });
    const axisDimension = getAxisDimension({ chartConfig, dimensions });
    return useMemo(() => {
        if (!limitMeasure) {
            return {
                axisDimension,
                limitMeasure,
                limits: [],
            };
        }
        return {
            axisDimension,
            limitMeasure,
            limits: limitMeasure.limits
                .map((limit) => {
                var _a;
                const { limit: maybeLimit, relatedAxisDimensionValueLabel } = getMaybeValidChartConfigLimit({
                    chartConfig,
                    measureId: limitMeasure.id,
                    limit,
                    axisDimension,
                    filters,
                });
                return maybeLimit
                    ? {
                        configLimit: {
                            ...maybeLimit,
                            symbolType: limit.type === "single" &&
                                getSupportsLimitSymbols(chartConfig)
                                ? ((_a = maybeLimit.symbolType) !== null && _a !== void 0 ? _a : "circle")
                                : undefined,
                        },
                        measureLimit: limit,
                        relatedAxisDimensionValueLabel,
                        limitUnit: limitMeasure.unit,
                    }
                    : null;
            })
                .filter(truthy),
        };
    }, [limitMeasure, axisDimension, chartConfig, filters]);
};
export const getSupportsLimitSymbols = (chartConfig) => {
    return chartConfig.chartType === "area" || chartConfig.chartType === "line";
};
