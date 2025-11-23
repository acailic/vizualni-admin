import { max, min } from "d3-array";
import get from "lodash/get";
import overEvery from "lodash/overEvery";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import { createContext, useCallback, useContext, useMemo } from "react";
import { getLabelWithUnit, useDimensionWithAbbreviations, useOptionalNumericVariable, useStringVariable, useTemporalEntityVariable, useTemporalVariable, } from "@/charts/shared/chart-helpers";
import { getAnimationField, hasChartConfigs, useConfiguratorState, } from "@/configurator";
import { parseDate, useErrorMeasure, useErrorRange, useErrorVariable, } from "@/configurator/components/ui-helpers";
import { isNumericalMeasure, isTemporalDimension, isTemporalEntityDimension, } from "@/domain/data";
import { useTimeFormatUnit } from "@/formatters";
import { RelatedDimensionType } from "@/graphql/query-hooks";
import { ScaleType } from "@/graphql/resolver-types";
import { useChartInteractiveFilters, useDashboardInteractiveFilters, } from "@/stores/interactive-filters";
export const ChartContext = createContext(undefined);
export const useChartState = () => {
    const ctx = useContext(ChartContext);
    if (ctx === undefined) {
        throw Error("You need to wrap your component in <ChartContext.Provider /> to useChartState()");
    }
    return ctx;
};
export const useBaseVariables = (chartConfig) => {
    return {
        interactiveFiltersConfig: chartConfig.interactiveFiltersConfig,
    };
};
export const useBandYVariables = (y, { dimensionsById, observations, }) => {
    const yDimension = dimensionsById[y.componentId];
    if (!yDimension) {
        throw Error(`No dimension <${y.componentId}> in cube! (useBandXVariables)`);
    }
    const yTimeUnit = isTemporalDimension(yDimension) || isTemporalEntityDimension(yDimension)
        ? yDimension.timeUnit
        : undefined;
    const timeFormatUnit = useTimeFormatUnit();
    const formatYDate = useCallback((d) => {
        if (yTimeUnit) {
            return timeFormatUnit(d, yTimeUnit);
        }
        if (typeof d === "string") {
            return d;
        }
        return d.toISOString();
    }, [timeFormatUnit, yTimeUnit]);
    const { getAbbreviationOrLabelByValue: getYAbbreviationOrLabel, getValue: getY, getLabel: getYLabel, } = useDimensionWithAbbreviations(yDimension, {
        observations,
        field: y,
    });
    const getYAsDate = useTemporalVariable(y.componentId);
    const getYTemporalEntity = useTemporalEntityVariable(dimensionsById[y.componentId].values)(y.componentId);
    const yAxisLabel = getLabelWithUnit(yDimension);
    return {
        yAxisLabel,
        yDimension,
        getY,
        getYLabel,
        getYAbbreviationOrLabel,
        yTimeUnit,
        getYAsDate: isTemporalEntityDimension(yDimension)
            ? getYTemporalEntity
            : getYAsDate,
        formatYDate,
    };
};
export const useBandXVariables = (x, { dimensionsById, observations, }) => {
    const xDimension = dimensionsById[x.componentId];
    if (!xDimension) {
        throw Error(`No dimension <${x.componentId}> in cube! (useBandXVariables)`);
    }
    const { getAbbreviationOrLabelByValue: getXAbbreviationOrLabel, getValue: getX, getLabel: getXLabel, } = useDimensionWithAbbreviations(xDimension, {
        observations,
        field: x,
    });
    const getXAsDate = useTemporalVariable(x.componentId);
    const getXTemporalEntity = useTemporalEntityVariable(dimensionsById[x.componentId].values)(x.componentId);
    const xAxisLabel = getLabelWithUnit(xDimension);
    const xTimeUnit = isTemporalDimension(xDimension) || isTemporalEntityDimension(xDimension)
        ? xDimension.timeUnit
        : undefined;
    const timeFormatUnit = useTimeFormatUnit();
    const formatXDate = useCallback((d) => {
        if (xTimeUnit) {
            return timeFormatUnit(d, xTimeUnit);
        }
        if (typeof d === "string") {
            return d;
        }
        return d.toISOString();
    }, [timeFormatUnit, xTimeUnit]);
    return {
        xAxisLabel,
        xDimension,
        getX,
        getXLabel,
        getXAbbreviationOrLabel,
        xTimeUnit,
        getXAsDate: isTemporalEntityDimension(xDimension)
            ? getXTemporalEntity
            : getXAsDate,
        formatXDate,
    };
};
export const useTemporalXVariables = (x, { dimensionsById }) => {
    const xDimension = dimensionsById[x.componentId];
    if (!xDimension) {
        throw Error(`No dimension <${x.componentId}> in cube! (useTemporalXVariables)`);
    }
    if (!isTemporalDimension(xDimension) &&
        !isTemporalEntityDimension(xDimension)) {
        throw Error(`Dimension <${x.componentId}> is not temporal!`);
    }
    const getXTemporal = useTemporalVariable(x.componentId);
    const dimensionValues = dimensionsById[x.componentId].values;
    const relatedLimitValues = dimensionsById[x.componentId].relatedLimitValues;
    const values = uniqBy([...dimensionValues, ...relatedLimitValues], (d) => d.value);
    const getXTemporalEntity = useTemporalEntityVariable(values)(x.componentId);
    const getXAsString = useStringVariable(x.componentId);
    const xAxisLabel = getLabelWithUnit(xDimension);
    return {
        xAxisLabel,
        xDimension,
        getX: isTemporalDimension(xDimension) ? getXTemporal : getXTemporalEntity,
        getXAsString,
    };
};
export const useTemporalMaybeXVariables = ({ componentId = "" }, { dimensionsById }) => {
    var _a, _b, _c, _d;
    const xDimension = dimensionsById[componentId];
    if (xDimension &&
        !isTemporalDimension(xDimension) &&
        !isTemporalEntityDimension(xDimension)) {
        throw Error(`Dimension <${componentId}> is not temporal!`);
    }
    const getXTemporal = useTemporalVariable(componentId);
    const dimensionValues = (_b = (_a = dimensionsById[componentId]) === null || _a === void 0 ? void 0 : _a.values) !== null && _b !== void 0 ? _b : [];
    const relatedLimitValues = (_d = (_c = dimensionsById[componentId]) === null || _c === void 0 ? void 0 : _c.relatedLimitValues) !== null && _d !== void 0 ? _d : [];
    const values = uniqBy([...dimensionValues, ...relatedLimitValues], (d) => d.value);
    const getXTemporalEntity = useTemporalEntityVariable(values)(componentId);
    return {
        xDimension,
        getX: isTemporalDimension(xDimension) ? getXTemporal : getXTemporalEntity,
    };
};
export const shouldUseDynamicMinScaleValue = (scaleType) => {
    return scaleType === ScaleType.Interval;
};
export const useNumericalXVariables = (chartType, x, { measuresById }) => {
    const xMeasure = measuresById[x.componentId];
    if (!xMeasure) {
        throw Error(`No dimension <${x.componentId}> in cube! (useNumericalXVariables)`);
    }
    if (!isNumericalMeasure(xMeasure)) {
        throw Error(`Measure <${x.componentId}> is not numerical!`);
    }
    const getX = useOptionalNumericVariable(x.componentId);
    const xAxisLabel = getLabelWithUnit(xMeasure);
    const getMinX = useCallback((data, _getX) => {
        var _a, _b, _c;
        switch (chartType) {
            case "bar":
                return Math.min(0, (_a = min(data, _getX)) !== null && _a !== void 0 ? _a : 0);
            case "scatterplot":
                return shouldUseDynamicMinScaleValue(xMeasure.scaleType)
                    ? ((_b = min(data, _getX)) !== null && _b !== void 0 ? _b : 0)
                    : Math.min(0, (_c = min(data, _getX)) !== null && _c !== void 0 ? _c : 0);
            default:
                const _exhaustiveCheck = chartType;
                return _exhaustiveCheck;
        }
    }, [chartType, xMeasure.scaleType]);
    return {
        xMeasure,
        getX,
        xAxisLabel,
        getMinX,
    };
};
export const useNumericalYVariables = (
// Combo charts have their own logic for y scales.
chartType, y, { measuresById }) => {
    const yMeasure = measuresById[y.componentId];
    if (!yMeasure) {
        throw Error(`No dimension <${y.componentId}> in cube! (useNumericalYVariables)`);
    }
    if (!isNumericalMeasure(yMeasure)) {
        throw Error(`Measure <${y.componentId}> is not numerical!`);
    }
    const getY = useOptionalNumericVariable(y.componentId);
    const yAxisLabel = getLabelWithUnit(yMeasure);
    const getMinY = useCallback((data, _getY) => {
        var _a, _b, _c;
        switch (chartType) {
            case "area":
            case "column":
            case "pie":
                return Math.min(0, (_a = min(data, _getY)) !== null && _a !== void 0 ? _a : 0);
            case "line":
            case "scatterplot":
                return shouldUseDynamicMinScaleValue(yMeasure.scaleType)
                    ? ((_b = min(data, _getY)) !== null && _b !== void 0 ? _b : 0)
                    : Math.min(0, (_c = min(data, _getY)) !== null && _c !== void 0 ? _c : 0);
            default:
                const _exhaustiveCheck = chartType;
                return _exhaustiveCheck;
        }
    }, [chartType, yMeasure.scaleType]);
    return {
        yMeasure,
        getY,
        yAxisLabel,
        getMinY,
    };
};
export const useNumericalYErrorVariables = (y, { getValue, dimensions, measures, }) => {
    const showYStandardError = get(y, ["showStandardError"], true);
    const yStandardErrorMeasure = useErrorMeasure(y.componentId, {
        dimensions,
        measures,
        type: RelatedDimensionType.StandardError,
    });
    const getYStandardError = useErrorVariable(yStandardErrorMeasure);
    const showYConfidenceInterval = get(y, ["showConfidenceInterval"], true);
    const yConfidenceIntervalUpperMeasure = useErrorMeasure(y.componentId, {
        dimensions,
        measures,
        type: RelatedDimensionType.ConfidenceUpperBound,
    });
    const getYConfidenceIntervalUpper = useErrorVariable(yConfidenceIntervalUpperMeasure);
    const yConfidenceIntervalLowerMeasure = useErrorMeasure(y.componentId, {
        dimensions,
        measures,
        type: RelatedDimensionType.ConfidenceLowerBound,
    });
    const getYConfidenceIntervalLower = useErrorVariable(yConfidenceIntervalLowerMeasure);
    const getYErrorPresent = useCallback((d) => {
        return ((showYStandardError && (getYStandardError === null || getYStandardError === void 0 ? void 0 : getYStandardError(d)) !== null) ||
            (showYConfidenceInterval &&
                (getYConfidenceIntervalUpper === null || getYConfidenceIntervalUpper === void 0 ? void 0 : getYConfidenceIntervalUpper(d)) !== null &&
                (getYConfidenceIntervalLower === null || getYConfidenceIntervalLower === void 0 ? void 0 : getYConfidenceIntervalLower(d)) !== null));
    }, [
        showYStandardError,
        getYStandardError,
        showYConfidenceInterval,
        getYConfidenceIntervalUpper,
        getYConfidenceIntervalLower,
    ]);
    const getYErrorRange = useErrorRange(showYStandardError && yStandardErrorMeasure
        ? yStandardErrorMeasure
        : yConfidenceIntervalUpperMeasure, showYStandardError && yStandardErrorMeasure
        ? yStandardErrorMeasure
        : yConfidenceIntervalLowerMeasure, getValue);
    const getFormattedYUncertainty = useCallback((d) => {
        var _a, _b;
        if (showYStandardError &&
            getYStandardError &&
            getYStandardError(d) !== null) {
            const sd = getYStandardError(d);
            const unit = (_a = yStandardErrorMeasure === null || yStandardErrorMeasure === void 0 ? void 0 : yStandardErrorMeasure.unit) !== null && _a !== void 0 ? _a : "";
            return ` ± ${sd}${unit}`;
        }
        if (showYConfidenceInterval &&
            getYConfidenceIntervalUpper &&
            getYConfidenceIntervalLower &&
            getYConfidenceIntervalUpper(d) !== null &&
            getYConfidenceIntervalLower(d) !== null) {
            const cil = getYConfidenceIntervalLower(d);
            const ciu = getYConfidenceIntervalUpper(d);
            const unit = (_b = yConfidenceIntervalUpperMeasure === null || yConfidenceIntervalUpperMeasure === void 0 ? void 0 : yConfidenceIntervalUpperMeasure.unit) !== null && _b !== void 0 ? _b : "";
            return `, [-${cil}${unit}, +${ciu}${unit}]`;
        }
    }, [
        showYStandardError,
        getYStandardError,
        showYConfidenceInterval,
        getYConfidenceIntervalUpper,
        getYConfidenceIntervalLower,
        yStandardErrorMeasure === null || yStandardErrorMeasure === void 0 ? void 0 : yStandardErrorMeasure.unit,
        yConfidenceIntervalUpperMeasure === null || yConfidenceIntervalUpperMeasure === void 0 ? void 0 : yConfidenceIntervalUpperMeasure.unit,
    ]);
    return {
        showYUncertainty: (showYStandardError && !!yStandardErrorMeasure) ||
            (showYConfidenceInterval &&
                !!yConfidenceIntervalUpperMeasure &&
                !!yConfidenceIntervalLowerMeasure),
        getYErrorPresent,
        getYErrorRange,
        getFormattedYUncertainty,
    };
};
export const useNumericalXErrorVariables = (x, { getValue, dimensions, measures, }) => {
    const showXStandardError = get(x, ["showStandardError"], true);
    const xStandardErrorMeasure = useErrorMeasure(x.componentId, {
        dimensions,
        measures,
        type: RelatedDimensionType.StandardError,
    });
    const getXStandardError = useErrorVariable(xStandardErrorMeasure);
    const showXConfidenceInterval = get(x, ["showConfidenceInterval"], true);
    const xConfidenceIntervalUpperMeasure = useErrorMeasure(x.componentId, {
        dimensions,
        measures,
        type: RelatedDimensionType.ConfidenceUpperBound,
    });
    const getXConfidenceIntervalUpper = useErrorVariable(xConfidenceIntervalUpperMeasure);
    const xConfidenceIntervalLowerMeasure = useErrorMeasure(x.componentId, {
        dimensions,
        measures,
        type: RelatedDimensionType.ConfidenceLowerBound,
    });
    const getXConfidenceIntervalLower = useErrorVariable(xConfidenceIntervalLowerMeasure);
    const getXErrorPresent = useCallback((d) => {
        return ((showXStandardError && (getXStandardError === null || getXStandardError === void 0 ? void 0 : getXStandardError(d)) !== null) ||
            (showXConfidenceInterval &&
                (getXConfidenceIntervalUpper === null || getXConfidenceIntervalUpper === void 0 ? void 0 : getXConfidenceIntervalUpper(d)) !== null &&
                (getXConfidenceIntervalLower === null || getXConfidenceIntervalLower === void 0 ? void 0 : getXConfidenceIntervalLower(d)) !== null));
    }, [
        showXStandardError,
        getXStandardError,
        showXConfidenceInterval,
        getXConfidenceIntervalUpper,
        getXConfidenceIntervalLower,
    ]);
    const getXErrorRange = useErrorRange(showXStandardError && xStandardErrorMeasure
        ? xStandardErrorMeasure
        : xConfidenceIntervalUpperMeasure, showXStandardError && xStandardErrorMeasure
        ? xStandardErrorMeasure
        : xConfidenceIntervalLowerMeasure, getValue);
    const getFormattedXUncertainty = useCallback((d) => {
        var _a, _b;
        if (showXStandardError &&
            getXStandardError &&
            getXStandardError(d) !== null) {
            const sd = getXStandardError(d);
            const unit = (_a = xStandardErrorMeasure === null || xStandardErrorMeasure === void 0 ? void 0 : xStandardErrorMeasure.unit) !== null && _a !== void 0 ? _a : "";
            return ` ± ${sd}${unit}`;
        }
        if (showXConfidenceInterval &&
            getXConfidenceIntervalUpper &&
            getXConfidenceIntervalLower &&
            getXConfidenceIntervalUpper(d) !== null &&
            getXConfidenceIntervalLower(d) !== null) {
            const cil = getXConfidenceIntervalLower(d);
            const ciu = getXConfidenceIntervalUpper(d);
            const unit = (_b = xConfidenceIntervalUpperMeasure === null || xConfidenceIntervalUpperMeasure === void 0 ? void 0 : xConfidenceIntervalUpperMeasure.unit) !== null && _b !== void 0 ? _b : "";
            return `, [-${cil}${unit}, +${ciu}${unit}]`;
        }
    }, [
        showXStandardError,
        getXStandardError,
        showXConfidenceInterval,
        getXConfidenceIntervalUpper,
        getXConfidenceIntervalLower,
        xStandardErrorMeasure === null || xStandardErrorMeasure === void 0 ? void 0 : xStandardErrorMeasure.unit,
        xConfidenceIntervalUpperMeasure === null || xConfidenceIntervalUpperMeasure === void 0 ? void 0 : xConfidenceIntervalUpperMeasure.unit,
    ]);
    return {
        showXUncertainty: (showXStandardError && !!xStandardErrorMeasure) ||
            (showXConfidenceInterval &&
                !!xConfidenceIntervalUpperMeasure &&
                !!xConfidenceIntervalLowerMeasure),
        getXErrorPresent,
        getXErrorRange,
        getFormattedXUncertainty,
    };
};
export const useSegmentVariables = (segment, { dimensionsById, observations, }) => {
    var _a, _b;
    const segmentDimension = dimensionsById[(_a = segment === null || segment === void 0 ? void 0 : segment.componentId) !== null && _a !== void 0 ? _a : ""];
    const { getAbbreviationOrLabelByValue: getSegmentAbbreviationOrLabel, abbreviationOrLabelLookup: segmentsByAbbreviationOrLabel, getValue: getSegment, getLabel: getSegmentLabel, } = useDimensionWithAbbreviations(segmentDimension, {
        observations,
        field: segment,
    });
    return {
        segmentDimension,
        segmentsByAbbreviationOrLabel,
        getSegment,
        getSegmentAbbreviationOrLabel,
        getSegmentLabel,
        showValuesBySegmentMapping: (_b = segment === null || segment === void 0 ? void 0 : segment.showValuesMapping) !== null && _b !== void 0 ? _b : {},
    };
};
export const useInteractiveFiltersVariables = (interactiveFiltersConfig, { dimensionsById }) => {
    var _a, _b;
    const id = interactiveFiltersConfig.timeRange.componentId;
    const dimension = dimensionsById[id];
    const getTimeRangeDate = useTemporalVariable(id);
    const dimensionValues = (_a = dimension === null || dimension === void 0 ? void 0 : dimension.values) !== null && _a !== void 0 ? _a : [];
    const relatedLimitValues = (_b = dimension === null || dimension === void 0 ? void 0 : dimension.relatedLimitValues) !== null && _b !== void 0 ? _b : [];
    const values = uniqBy([...dimensionValues, ...relatedLimitValues], (d) => d.value);
    const getTimeRangeEntityDate = useTemporalEntityVariable(values)(id);
    return {
        getTimeRangeDate: isTemporalDimension(dimension)
            ? getTimeRangeDate
            : getTimeRangeEntityDate,
    };
};
export const useLimitsVariables = (limits) => {
    const values = limits.limits.flatMap((d) => {
        switch (d.measureLimit.type) {
            case "single":
                return d.measureLimit.value;
            case "value-range":
                return [d.measureLimit.min, d.measureLimit.max];
            case "time-range":
                return [d.measureLimit.value];
            default:
                const _exhaustiveCheck = d.measureLimit;
                return _exhaustiveCheck;
        }
    });
    return {
        minLimitValue: min(values),
        maxLimitValue: max(values),
    };
};
/** Prepares the data to be used in charts, taking interactive filters into account. */
export const useChartData = (observations, { sortData, chartConfig, timeRangeDimensionId, axisDimensionId, limits, getAxisValueAsDate, getSegmentAbbreviationOrLabel, getTimeRangeDate, }) => {
    var _a, _b, _c, _d;
    const { interactiveFiltersConfig } = chartConfig;
    const allData = useMemo(() => {
        let allData = observations;
        if (axisDimensionId && limits) {
            const dimensionValuesObservations = limits
                .flatMap((limit) => limit.related)
                .filter((limit) => limit.dimensionId === axisDimensionId)
                .map((d) => ({
                [axisDimensionId]: d.label,
            }));
            const axisObservationValues = uniq(observations.map((o) => o[axisDimensionId]));
            allData = [
                ...observations,
                ...dimensionValuesObservations.filter((d) => !axisObservationValues.includes(d[axisDimensionId])),
            ];
        }
        return sortData ? sortData(allData) : observations;
    }, [axisDimensionId, limits, observations, sortData]);
    const categories = useChartInteractiveFilters((d) => d.categories);
    const timeRange = useChartInteractiveFilters((d) => d.timeRange);
    const timeSlider = useChartInteractiveFilters((d) => d.timeSlider);
    // time range
    const interactiveTimeRange = interactiveFiltersConfig.timeRange;
    const timeRangeFromTime = interactiveTimeRange.presets.from
        ? parseDate(interactiveTimeRange.presets.from).getTime()
        : undefined;
    const timeRangeToTime = interactiveTimeRange.presets.to
        ? parseDate(interactiveTimeRange.presets.to).getTime()
        : undefined;
    const timeRangeFilters = useMemo(() => {
        const timeRangeFilter = getTimeRangeDate && timeRangeFromTime && timeRangeToTime
            ? (d) => {
                const time = getTimeRangeDate(d).getTime();
                return time >= timeRangeFromTime && time <= timeRangeToTime;
            }
            : null;
        return timeRangeFilter ? [timeRangeFilter] : [];
    }, [timeRangeFromTime, timeRangeToTime, getTimeRangeDate]);
    // interactive time range
    const interactiveFromTime = (_a = timeRange.from) === null || _a === void 0 ? void 0 : _a.getTime();
    const interactiveToTime = (_b = timeRange.to) === null || _b === void 0 ? void 0 : _b.getTime();
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    const { potentialTimeRangeFilterIds } = useDashboardInteractiveFilters();
    const interactiveTimeRangeFilters = useMemo(() => {
        const interactiveTimeRangeFilter = getAxisValueAsDate &&
            interactiveFromTime &&
            interactiveToTime &&
            ((interactiveTimeRange === null || interactiveTimeRange === void 0 ? void 0 : interactiveTimeRange.active) ||
                ((dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange.active) &&
                    timeRangeDimensionId &&
                    potentialTimeRangeFilterIds.includes(timeRangeDimensionId)))
            ? (d) => {
                const time = getAxisValueAsDate(d).getTime();
                return time >= interactiveFromTime && time <= interactiveToTime;
            }
            : null;
        return interactiveTimeRangeFilter ? [interactiveTimeRangeFilter] : [];
    }, [
        getAxisValueAsDate,
        interactiveFromTime,
        interactiveToTime,
        interactiveTimeRange === null || interactiveTimeRange === void 0 ? void 0 : interactiveTimeRange.active,
        dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange.active,
        timeRangeDimensionId,
        potentialTimeRangeFilterIds,
    ]);
    // interactive time slider
    const animationField = getAnimationField(chartConfig);
    const dynamicScales = (_c = animationField === null || animationField === void 0 ? void 0 : animationField.dynamicScales) !== null && _c !== void 0 ? _c : true;
    const animationComponentId = (_d = animationField === null || animationField === void 0 ? void 0 : animationField.componentId) !== null && _d !== void 0 ? _d : "";
    const getAnimationDate = useTemporalVariable(animationComponentId);
    const getAnimationOrdinalDate = useStringVariable(animationComponentId);
    const interactiveTimeSliderFilters = useMemo(() => {
        const interactiveTimeSliderFilter = (animationField === null || animationField === void 0 ? void 0 : animationField.componentId) && timeSlider.value
            ? (d) => {
                if (timeSlider.type === "interval") {
                    return (getAnimationDate(d).getTime() === timeSlider.value.getTime());
                }
                const ordinalDate = getAnimationOrdinalDate(d);
                return ordinalDate === timeSlider.value;
            }
            : null;
        return interactiveTimeSliderFilter ? [interactiveTimeSliderFilter] : [];
    }, [
        animationField === null || animationField === void 0 ? void 0 : animationField.componentId,
        timeSlider.type,
        timeSlider.value,
        getAnimationDate,
        getAnimationOrdinalDate,
    ]);
    // interactive legend
    const interactiveLegendFilters = useMemo(() => {
        const legendItems = Object.keys(categories);
        const interactiveLegendFilter = interactiveFiltersConfig.legend.active && getSegmentAbbreviationOrLabel
            ? (d) => {
                return !legendItems.includes(getSegmentAbbreviationOrLabel(d));
            }
            : null;
        return interactiveLegendFilter ? [interactiveLegendFilter] : [];
    }, [
        categories,
        getSegmentAbbreviationOrLabel,
        interactiveFiltersConfig.legend.active,
    ]);
    const chartData = useMemo(() => {
        return allData.filter(overEvery([
            ...interactiveLegendFilters,
            ...interactiveTimeRangeFilters,
            ...interactiveTimeSliderFilters,
        ]));
    }, [
        allData,
        interactiveLegendFilters,
        interactiveTimeRangeFilters,
        interactiveTimeSliderFilters,
    ]);
    const scalesData = useMemo(() => {
        if (dynamicScales) {
            return chartData;
        }
        else {
            return allData.filter(overEvery([...interactiveLegendFilters, ...interactiveTimeRangeFilters]));
        }
    }, [
        dynamicScales,
        chartData,
        allData,
        interactiveLegendFilters,
        interactiveTimeRangeFilters,
    ]);
    const segmentData = useMemo(() => {
        return allData.filter(overEvery(interactiveTimeRangeFilters));
    }, [allData, interactiveTimeRangeFilters]);
    const timeRangeData = useMemo(() => {
        return allData.filter(overEvery(timeRangeFilters));
    }, [allData, timeRangeFilters]);
    const paddingData = useMemo(() => {
        if (dynamicScales) {
            return chartData;
        }
        else {
            return allData.filter(overEvery(interactiveLegendFilters));
        }
    }, [dynamicScales, chartData, allData, interactiveLegendFilters]);
    return {
        allData,
        chartData,
        scalesData,
        segmentData,
        timeRangeData,
        paddingData,
    };
};
