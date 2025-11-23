import { ascending, descending } from "d3-array";
import { useCallback } from "react";
import { usePlottableData } from "@/charts/shared/chart-helpers";
import { useBandYVariables, useBaseVariables, useChartData, useInteractiveFiltersVariables, useLimitsVariables, useNumericalXErrorVariables, useNumericalXVariables, useSegmentVariables, } from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";
import { isTemporalEntityDimension } from "@/domain/data";
export const useBarsStateVariables = (props) => {
    const { chartConfig, observations, dimensions, dimensionsById, measures, measuresById, limits, } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x, y, animation, segment } = fields;
    const yDimension = dimensionsById[y.componentId];
    const filters = useChartConfigFilters(chartConfig);
    const baseVariables = useBaseVariables(chartConfig);
    const numericalXVariables = useNumericalXVariables("bar", x, {
        measuresById,
    });
    const bandYVariables = useBandYVariables(y, {
        dimensionsById,
        observations,
    });
    const numericalXErrorVariables = useNumericalXErrorVariables(x, {
        getValue: numericalXVariables.getX,
        dimensions,
        measures,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(interactiveFiltersConfig, { dimensionsById });
    const limitsVariables = useLimitsVariables(limits);
    const { getY, getYAsDate } = bandYVariables;
    const { getX } = numericalXVariables;
    const sortData = useCallback((data) => {
        var _a;
        const { sortingOrder, sortingType } = (_a = y.sorting) !== null && _a !== void 0 ? _a : {};
        const yGetter = isTemporalEntityDimension(yDimension) ? getYAsDate : getY;
        if (sortingOrder === "desc" && sortingType === "byDimensionLabel") {
            return [...data].sort((a, b) => descending(yGetter(a), yGetter(b)));
        }
        else if (sortingOrder === "asc" && sortingType === "byDimensionLabel") {
            return [...data].sort((a, b) => ascending(yGetter(a), yGetter(b)));
        }
        else if (sortingOrder === "desc" && sortingType === "byMeasure") {
            return [...data].sort((a, b) => { var _a, _b; return descending((_a = getX(a)) !== null && _a !== void 0 ? _a : -1, (_b = getX(b)) !== null && _b !== void 0 ? _b : -1); });
        }
        else if (sortingOrder === "asc" && sortingType === "byMeasure") {
            return [...data].sort((a, b) => { var _a, _b; return ascending((_a = getX(a)) !== null && _a !== void 0 ? _a : -1, (_b = getX(b)) !== null && _b !== void 0 ? _b : -1); });
        }
        else {
            return [...data].sort((a, b) => ascending(yGetter(a), yGetter(b)));
        }
    }, [getX, getYAsDate, getY, y.sorting, yDimension]);
    const segmentVariables = useSegmentVariables(segment, {
        dimensionsById,
        observations,
    });
    const getRenderingKey = useRenderingKeyVariable(dimensions, filters, animation);
    return {
        ...segmentVariables,
        ...baseVariables,
        sortData,
        ...bandYVariables,
        ...numericalXVariables,
        ...numericalXErrorVariables,
        ...interactiveFiltersVariables,
        ...limitsVariables,
        getRenderingKey,
    };
};
export const useBarsStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { sortData, yDimension, getYAsDate, getX, getTimeRangeDate } = variables;
    const plottableData = usePlottableData(observations, {
        getX,
    });
    return useChartData(plottableData, {
        sortData,
        chartConfig,
        timeRangeDimensionId: yDimension.id,
        getAxisValueAsDate: getYAsDate,
        getTimeRangeDate,
    });
};
