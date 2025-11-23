import { ascending, descending } from "d3-array";
import { useCallback } from "react";
import { usePlottableData } from "@/charts/shared/chart-helpers";
import { useBandXVariables, useBaseVariables, useChartData, useInteractiveFiltersVariables, useLimitsVariables, useNumericalYErrorVariables, useNumericalYVariables, useSegmentVariables, } from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";
import { isTemporalEntityDimension } from "@/domain/data";
export const useColumnsStateVariables = (props) => {
    const { chartConfig, observations, dimensions, dimensionsById, measures, measuresById, limits, } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x, y, animation } = fields;
    const xDimension = dimensionsById[x.componentId];
    const filters = useChartConfigFilters(chartConfig);
    const baseVariables = useBaseVariables(chartConfig);
    const bandXVariables = useBandXVariables(x, {
        dimensionsById,
        observations,
    });
    const numericalYVariables = useNumericalYVariables("column", y, {
        measuresById,
    });
    const numericalYErrorVariables = useNumericalYErrorVariables(y, {
        getValue: numericalYVariables.getY,
        dimensions,
        measures,
    });
    const segmentVariables = useSegmentVariables(undefined, {
        dimensionsById,
        observations,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(interactiveFiltersConfig, { dimensionsById });
    const limitsVariables = useLimitsVariables(limits);
    const { getX, getXAsDate } = bandXVariables;
    const { getY } = numericalYVariables;
    const sortData = useCallback((data) => {
        var _a;
        const { sortingOrder, sortingType } = (_a = x.sorting) !== null && _a !== void 0 ? _a : {};
        const xGetter = isTemporalEntityDimension(xDimension) ? getXAsDate : getX;
        if (sortingOrder === "desc" && sortingType === "byDimensionLabel") {
            return [...data].sort((a, b) => descending(xGetter(a), xGetter(b)));
        }
        else if (sortingOrder === "asc" && sortingType === "byDimensionLabel") {
            return [...data].sort((a, b) => ascending(xGetter(a), xGetter(b)));
        }
        else if (sortingOrder === "desc" && sortingType === "byMeasure") {
            return [...data].sort((a, b) => { var _a, _b; return descending((_a = getY(a)) !== null && _a !== void 0 ? _a : -1, (_b = getY(b)) !== null && _b !== void 0 ? _b : -1); });
        }
        else if (sortingOrder === "asc" && sortingType === "byMeasure") {
            return [...data].sort((a, b) => { var _a, _b; return ascending((_a = getY(a)) !== null && _a !== void 0 ? _a : -1, (_b = getY(b)) !== null && _b !== void 0 ? _b : -1); });
        }
        else {
            return [...data].sort((a, b) => ascending(xGetter(a), xGetter(b)));
        }
    }, [getX, getXAsDate, getY, x.sorting, xDimension]);
    const getRenderingKey = useRenderingKeyVariable(dimensions, filters, animation);
    return {
        ...baseVariables,
        sortData,
        ...bandXVariables,
        ...numericalYVariables,
        ...numericalYErrorVariables,
        ...segmentVariables,
        ...interactiveFiltersVariables,
        ...limitsVariables,
        getRenderingKey,
    };
};
export const useColumnsStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { sortData, xDimension, getXAsDate, getY, getTimeRangeDate } = variables;
    const plottableData = usePlottableData(observations, {
        getY,
    });
    return useChartData(plottableData, {
        sortData,
        chartConfig,
        timeRangeDimensionId: xDimension.id,
        getAxisValueAsDate: getXAsDate,
        getTimeRangeDate,
    });
};
