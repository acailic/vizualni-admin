import { ascending } from "d3-array";
import { useCallback } from "react";
import { usePlottableData } from "@/charts/shared/chart-helpers";
import { useBaseVariables, useChartData, useInteractiveFiltersVariables, useLimitsVariables, useNumericalYErrorVariables, useNumericalYVariables, useSegmentVariables, useTemporalXVariables, } from "@/charts/shared/chart-state";
export const useLinesStateVariables = (props) => {
    const { chartConfig, observations, dimensions, dimensionsById, measures, measuresById, limits, } = props;
    const { fields } = chartConfig;
    const { x, y, segment } = fields;
    const baseVariables = useBaseVariables(chartConfig);
    const temporalXVariables = useTemporalXVariables(x, {
        dimensionsById,
    });
    const numericalYVariables = useNumericalYVariables("line", y, {
        measuresById,
    });
    const numericalYErrorVariables = useNumericalYErrorVariables(y, {
        getValue: numericalYVariables.getY,
        dimensions,
        measures,
    });
    const segmentVariables = useSegmentVariables(segment, {
        dimensionsById,
        observations,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(chartConfig.interactiveFiltersConfig, { dimensionsById });
    const limitsVariables = useLimitsVariables(limits);
    const { getX } = temporalXVariables;
    const sortData = useCallback((data) => {
        return [...data].sort((a, b) => {
            return ascending(getX(a), getX(b));
        });
    }, [getX]);
    return {
        ...baseVariables,
        sortData,
        ...temporalXVariables,
        ...numericalYVariables,
        ...numericalYErrorVariables,
        ...segmentVariables,
        ...interactiveFiltersVariables,
        ...limitsVariables,
    };
};
export const useLinesStateData = (chartProps, variables) => {
    const { chartConfig, observations, limits } = chartProps;
    const { sortData, xDimension, getX, getY, getSegmentAbbreviationOrLabel, getTimeRangeDate, } = variables;
    const plottableData = usePlottableData(observations, {
        getY,
    });
    return useChartData(plottableData, {
        sortData,
        chartConfig,
        axisDimensionId: xDimension.id,
        limits: limits.limits.map((limit) => limit.measureLimit),
        timeRangeDimensionId: xDimension.id,
        getAxisValueAsDate: getX,
        getSegmentAbbreviationOrLabel,
        getTimeRangeDate,
    });
};
