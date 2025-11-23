import { sum } from "d3-array";
import omitBy from "lodash/omitBy";
import uniq from "lodash/uniq";
import { useCallback, useMemo } from "react";
import { useMaybeAbbreviations } from "@/charts/shared/abbreviations";
import { imputeTemporalLinearSeries, interpolateZerosValue, } from "@/charts/shared/imputation";
import { useObservationLabels } from "@/charts/shared/observation-labels";
import { isAnimationInConfig, } from "@/config-types";
import { getChartConfigFilters } from "@/config-utils";
import { isComboChartConfig, } from "@/configurator";
import { parseDate } from "@/configurator/components/ui-helpers";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { getTemporalEntityValue, } from "@/domain/data";
import { truthy } from "@/domain/types";
import { getOriginalIds, getResolvedJoinById, isJoinById, } from "@/graphql/join";
import { useChartInteractiveFilters, } from "@/stores/interactive-filters";
// Prepare filters used in data query:
// - merges publisher data filters, interactive data filters, and dashboard filters
//   if applicable
// - removes none values since they should not be sent as part of the GraphQL query
export const prepareCubeQueryFilters = ({ chartConfig, cubeFilters, animationField, interactiveFiltersConfig, dashboardFilters, interactiveDataFilters, }) => {
    var _a, _b;
    const queryFilters = { ...cubeFilters };
    const dashboardFiltersComponentIds = (_a = dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.dataFilters.componentIds) !== null && _a !== void 0 ? _a : [];
    for (const [k, v] of Object.entries((_b = dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.dataFilters.filters) !== null && _b !== void 0 ? _b : {})) {
        if (k in cubeFilters &&
            dashboardFiltersComponentIds.includes(k) &&
            (animationField === null || animationField === void 0 ? void 0 : animationField.componentId) !== k) {
            queryFilters[k] = v;
        }
    }
    const resolvedInteractiveFiltersConfigComponentIds = interactiveFiltersConfig.dataFilters.componentIds.flatMap((k) => isJoinById(k) ? getOriginalIds(k, chartConfig) : [k]);
    for (const [k, v] of Object.entries(interactiveDataFilters)) {
        const interactiveActiveForKey = interactiveFiltersConfig.dataFilters.active &&
            resolvedInteractiveFiltersConfigComponentIds.includes(k);
        const hasFilterValue = (v.type === "single" && v.value !== FIELD_VALUE_NONE) ||
            (v.type === "multi" && Object.keys(v.values).length > 0);
        const shouldApplyInteractiveFilter = interactiveActiveForKey ||
            (resolvedInteractiveFiltersConfigComponentIds.includes(k) &&
                hasFilterValue);
        if ((shouldApplyInteractiveFilter ||
            dashboardFiltersComponentIds.includes(k)) &&
            (animationField === null || animationField === void 0 ? void 0 : animationField.componentId) !== k) {
            if (v.type === "single" && v.value === FIELD_VALUE_NONE) {
                if (!(k in cubeFilters) || cubeFilters[k].type !== "multi") {
                    delete queryFilters[k];
                }
            }
            else if (v.type === "multi" && Object.keys(v.values).length === 0) {
                if (!(k in cubeFilters) || cubeFilters[k].type !== "multi") {
                    delete queryFilters[k];
                }
            }
            else {
                queryFilters[k] = v;
            }
        }
    }
    return omitBy(queryFilters, (v) => v.type === "single" && v.value === FIELD_VALUE_NONE);
};
export const useQueryFilters = ({ chartConfig, dashboardFilters, componentIds, }) => {
    const chartInteractiveFilters = useChartInteractiveFilters((d) => d.dataFilters);
    const resolvedChartInteractiveFilters = useMemo(() => {
        return Object.fromEntries(Object.entries(chartInteractiveFilters).flatMap(([k, v]) => {
            const resolvedIds = isJoinById(k)
                ? getOriginalIds(k, chartConfig)
                : [k];
            return resolvedIds.map((id) => [id, v]);
        }));
    }, [chartInteractiveFilters, chartConfig]);
    const animationField = isAnimationInConfig(chartConfig)
        ? chartConfig.fields.animation
        : undefined;
    return useMemo(() => {
        return chartConfig.cubes.map((cube) => {
            const rawCubeFilters = getChartConfigFilters(chartConfig.cubes, {
                cubeIri: cube.iri,
            });
            const cubeFilters = Object.fromEntries(Object.entries(rawCubeFilters).map(([key, value]) => {
                var _a;
                return [
                    isJoinById(key) ? ((_a = getResolvedJoinById(cube, key)) !== null && _a !== void 0 ? _a : key) : key,
                    value,
                ];
            }));
            const cubeComponentIds = [
                ...Object.keys(cubeFilters),
                ...Object.keys(chartConfig.fields),
                ...Object.values(chartConfig.fields).map((field) => field.componentId),
            ]
                .filter(truthy)
                .map((id) => { var _a; return isJoinById(id) ? ((_a = getResolvedJoinById(cube, id)) !== null && _a !== void 0 ? _a : id) : id; });
            const cubeInteractiveDataFilters = Object.fromEntries(Object.entries(resolvedChartInteractiveFilters).filter(([componentId]) => cubeComponentIds.includes(componentId)));
            const preparedFilters = prepareCubeQueryFilters({
                chartConfig,
                cubeFilters,
                animationField,
                interactiveFiltersConfig: chartConfig.interactiveFiltersConfig,
                dashboardFilters,
                interactiveDataFilters: cubeInteractiveDataFilters,
            });
            return {
                iri: cube.iri,
                componentIds,
                filters: preparedFilters,
                joinBy: cube.joinBy,
            };
        });
    }, [
        chartConfig,
        resolvedChartInteractiveFilters,
        animationField,
        dashboardFilters,
        componentIds,
    ]);
};
const getChartConfigFilterComponentIds = ({ cubes }) => {
    return Object.keys(getChartConfigFilters(cubes)).filter((d) => !isJoinById(d));
};
const getMapChartConfigAdditionalFieldIds = ({ fields }) => {
    const { areaLayer, symbolLayer } = fields;
    const additionalFields = [];
    if (areaLayer) {
        additionalFields.push(areaLayer.color.componentId);
    }
    if (symbolLayer) {
        if (symbolLayer.measureId !== FIELD_VALUE_NONE) {
            additionalFields.push(symbolLayer.measureId);
        }
        if (["categorical", "numerical"].includes(symbolLayer.color.type)) {
            additionalFields.push(symbolLayer.color
                .componentId);
        }
    }
    return additionalFields;
};
const getComboChartComponentIds = (chartConfig) => {
    switch (chartConfig.chartType) {
        case "comboLineSingle":
            return chartConfig.fields.y.componentIds;
        case "comboLineDual":
            return [
                chartConfig.fields.y.leftAxisComponentId,
                chartConfig.fields.y.rightAxisComponentId,
            ];
        case "comboLineColumn":
            return [
                chartConfig.fields.y.columnComponentId,
                chartConfig.fields.y.lineComponentId,
            ];
        default:
            const _exhaustiveCheck = chartConfig;
            return _exhaustiveCheck;
    }
};
export const extractChartConfigsComponentIds = (chartConfigs) => {
    return uniq(chartConfigs
        .map((chartConfig) => extractChartConfigComponentIds({ chartConfig }))
        .flat());
};
export const extractChartConfigComponentIds = ({ chartConfig, includeFilters = true, }) => {
    const { fields, interactiveFiltersConfig } = chartConfig;
    const fieldIds = Object.values(
    // @ts-ignore - we are only interested in component ids
    fields).map((field) => field.componentId);
    const additionalFieldIds = chartConfig.chartType === "map"
        ? getMapChartConfigAdditionalFieldIds(chartConfig)
        : isComboChartConfig(chartConfig)
            ? getComboChartComponentIds(chartConfig)
            : [];
    const filterIds = includeFilters
        ? getChartConfigFilterComponentIds(chartConfig)
        : [];
    const IFKeys = interactiveFiltersConfig
        ? Object.keys(interactiveFiltersConfig)
        : [];
    const IFIris = [];
    if (interactiveFiltersConfig) {
        IFKeys.forEach((k) => {
            const v = interactiveFiltersConfig[k];
            switch (k) {
                case "legend": {
                    const legend = v;
                    if (legend.active) {
                        IFIris.push(legend.componentId);
                    }
                    break;
                }
                case "timeRange": {
                    const timeRange = v;
                    if (timeRange.active) {
                        IFIris.push(timeRange.componentId);
                    }
                    break;
                }
                case "dataFilters": {
                    const dataFilters = v;
                    if (dataFilters.active) {
                        IFIris.push(...dataFilters.componentIds);
                    }
                    break;
                }
                case "calculation":
                    break;
                default:
                    const _exhaustiveCheck = k;
                    return _exhaustiveCheck;
            }
        });
    }
    return (uniq([...fieldIds, ...additionalFieldIds, ...filterIds, ...IFIris].filter(Boolean))
        .flatMap((id) => isJoinById(id) ? getOriginalIds(id, chartConfig) : [id])
        .filter((id) => !isJoinById(id))
        // Important so the order is consistent when querying.
        .sort());
};
export const extractChartConfigUsedComponents = (chartConfig, { components }) => {
    const componentIds = extractChartConfigComponentIds({
        chartConfig,
        includeFilters: false,
    });
    return componentIds
        .map((id) => components.find((component) => component.id === id))
        .filter(truthy); // exclude potential joinBy components
};
/** Use to remove missing values from chart data. */
export const usePlottableData = (data, { getX, getY, }) => {
    const isPlottable = useCallback((d) => {
        for (const p of [getX, getY].filter(truthy)) {
            const v = p(d);
            if (v === undefined || v === null) {
                return false;
            }
        }
        return true;
    }, [getX, getY]);
    return useMemo(() => data.filter(isPlottable), [data, isPlottable]);
};
export const useDimensionWithAbbreviations = (dimension, { observations, field, }) => {
    const { getAbbreviationOrLabelByValue, abbreviationOrLabelLookup } = useMaybeAbbreviations({
        useAbbreviations: field === null || field === void 0 ? void 0 : field.useAbbreviations,
        dimensionId: dimension === null || dimension === void 0 ? void 0 : dimension.id,
        dimensionValues: dimension === null || dimension === void 0 ? void 0 : dimension.values,
    });
    const { getValue, getLabel } = useObservationLabels(observations, getAbbreviationOrLabelByValue, dimension === null || dimension === void 0 ? void 0 : dimension.id);
    return {
        getAbbreviationOrLabelByValue,
        abbreviationOrLabelLookup,
        getValue,
        getLabel,
    };
};
const makeUseParsedVariable = (parser) => (key) => {
    return useCallback((d) => parser(d[key]), [key]);
};
export const parseOptionalNumericVariable = (d) => {
    return d !== null ? +d : null;
};
export const useOptionalNumericVariable = makeUseParsedVariable(parseOptionalNumericVariable);
export const parseStringVariable = (d) => {
    return d !== null ? `${d}` : "";
};
export const useStringVariable = makeUseParsedVariable(parseStringVariable);
export const useTemporalVariable = makeUseParsedVariable((x) => parseDate(`${x}`));
export const useTemporalEntityVariable = (dimensionValues) => {
    const indexedValues = useMemo(() => {
        return new Map(dimensionValues.map((d) => [d.label, d]));
    }, [dimensionValues]);
    return useCallback((key) => {
        return (d) => {
            const label = d[key];
            const dimensionValue = indexedValues.get(`${label}`);
            const value = dimensionValue
                ? getTemporalEntityValue(dimensionValue)
                : undefined;
            return parseDate(`${value}`);
        };
    }, [indexedValues]);
};
export const getSegment = (segmentKey) => (d) => segmentKey ? `${d[segmentKey]}` : "segment";
// Stacking helpers.
// Modified from d3 source code to treat 0s as positive values and stack them correctly
// in area charts.
export const stackOffsetDivergingPositiveZeros = (series, order) => {
    const n = series.length;
    if (!(n > 0))
        return;
    for (let i, j = 0, d, dy, yp, yn, m = series[order[0]].length; j < m; ++j) {
        for (yp = yn = 0, i = 0; i < n; ++i) {
            if ((dy = (d = series[order[i]][j])[1] - d[0]) >= 0) {
                (d[0] = yp), (d[1] = yp += dy);
            }
            else {
                (d[1] = yn), (d[0] = yn += dy);
            }
        }
    }
};
// Helper to pivot a dataset to a wider format.
// Currently, imputation is only applicable to temporal charts (specifically, stacked area charts).
export const getWideData = ({ dataGrouped, key, getAxisValue, allSegments, getSegment, imputationType = "none", }) => {
    switch (imputationType) {
        case "linear":
            if (allSegments) {
                const dataGroupedEntries = [...dataGrouped.entries()];
                const dataGroupedWithImputedValues = Array.from({ length: dataGrouped.size }, () => ({}));
                for (const segment of allSegments) {
                    const imputedSeriesValues = imputeTemporalLinearSeries({
                        dataSortedByX: dataGroupedEntries.map(([date, values]) => {
                            const observation = values.find((d) => getSegment(d) === segment);
                            return {
                                date: new Date(date),
                                value: observation ? getAxisValue(observation) : null,
                            };
                        }),
                    });
                    for (let i = 0; i < imputedSeriesValues.length; i++) {
                        dataGroupedWithImputedValues[i][segment] =
                            imputedSeriesValues[i].value;
                    }
                }
                return getBaseWideData({
                    dataGrouped,
                    key,
                    getAxisValue,
                    getSegment,
                    getOptionalObservationProps: (i) => {
                        return allSegments.map((d) => {
                            return {
                                [d]: dataGroupedWithImputedValues[i][d],
                            };
                        });
                    },
                });
            }
        case "zeros":
            if (allSegments) {
                return getBaseWideData({
                    dataGrouped,
                    key,
                    getAxisValue,
                    getSegment,
                    getOptionalObservationProps: () => {
                        return allSegments.map((d) => {
                            return {
                                [d]: interpolateZerosValue(),
                            };
                        });
                    },
                });
            }
        case "none":
        default:
            return getBaseWideData({
                dataGrouped,
                key,
                getAxisValue,
                getSegment,
            });
    }
};
const getBaseWideData = ({ dataGrouped, key, getAxisValue, getSegment, getOptionalObservationProps = () => [], }) => {
    const wideData = [];
    const dataGroupedByXEntries = [...dataGrouped.entries()];
    for (let i = 0; i < dataGrouped.size; i++) {
        const [k, v] = dataGroupedByXEntries[i];
        const observation = Object.assign({
            [key]: k,
            [`${key}/__iri__`]: v[0][`${key}/__iri__`],
            total: sum(v, getAxisValue),
        }, ...getOptionalObservationProps(i), ...v
            // Sorting the values in case of multiple values for the same segment
            // (desired behavior for getting the domain when time slider is active).
            .sort((a, b) => {
            var _a, _b;
            return ((_a = getAxisValue(a)) !== null && _a !== void 0 ? _a : 0) - ((_b = getAxisValue(b)) !== null && _b !== void 0 ? _b : 0);
        })
            .map((d) => {
            return {
                [getSegment(d)]: getAxisValue(d),
            };
        }));
        wideData.push(observation);
    }
    return wideData;
};
const getIdentityId = (id) => `${id}/__identity__`;
export const useGetIdentityY = (id) => {
    return useCallback((d) => {
        var _a;
        return (_a = d[getIdentityId(id)]) !== null && _a !== void 0 ? _a : null;
    }, [id]);
};
export const useGetIdentityX = (id) => {
    return useCallback((d) => {
        var _a;
        return (_a = d[getIdentityId(id)]) !== null && _a !== void 0 ? _a : null;
    }, [id]);
};
export const normalizeData = (sortedData, { key, getAxisValue, getTotalGroupValue, }) => {
    return sortedData.map((d) => {
        const totalGroupValue = getTotalGroupValue(d);
        const axisValue = getAxisValue(d);
        return {
            ...d,
            [key]: 100 * (axisValue ? axisValue / totalGroupValue : (axisValue !== null && axisValue !== void 0 ? axisValue : 0)),
            [getIdentityId(key)]: axisValue,
        };
    });
};
const SlugRe = /\W+/g;
export const getSlugifiedId = (id) => id.replace(SlugRe, "_");
export const getLabelWithUnit = (component) => {
    return component.unit
        ? `${component.label} (${component.unit})`
        : component.label;
};
export const checkForMissingValuesInSegments = (dataGroupedByX, segments) => {
    for (const value of dataGroupedByX.values()) {
        if (value.length !== segments.length) {
            return true;
        }
    }
    return false;
};
