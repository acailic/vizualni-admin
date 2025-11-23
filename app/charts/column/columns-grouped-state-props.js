import { ascending, rollup, sum } from "d3-array";
import orderBy from "lodash/orderBy";
import { useCallback } from "react";
import { usePlottableData } from "@/charts/shared/chart-helpers";
import { useBandXVariables, useBaseVariables, useChartData, useInteractiveFiltersVariables, useNumericalYErrorVariables, useNumericalYVariables, useSegmentVariables, } from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";
import { isTemporalEntityDimension } from "@/domain/data";
import { sortByIndex } from "@/utils/array";
export const useColumnsGroupedStateVariables = (props) => {
    const { chartConfig, observations, dimensions, dimensionsById, measures, measuresById, } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x, y, segment, animation } = fields;
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
    const segmentVariables = useSegmentVariables(segment, {
        dimensionsById,
        observations,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(interactiveFiltersConfig, { dimensionsById });
    const { getX, getXAsDate } = bandXVariables;
    const { getY } = numericalYVariables;
    const sortData = useCallback((data) => {
        var _a;
        const { sortingOrder, sortingType } = (_a = x.sorting) !== null && _a !== void 0 ? _a : {};
        const xGetter = isTemporalEntityDimension(xDimension)
            ? (d) => getXAsDate(d).getTime().toString()
            : getX;
        const order = [
            ...rollup(data, (v) => sum(v, (d) => getY(d)), (d) => xGetter(d)),
        ]
            .sort((a, b) => ascending(a[1], b[1]))
            .map((d) => d[0]);
        if (sortingType === "byDimensionLabel") {
            return orderBy(data, xGetter, sortingOrder);
        }
        else if (sortingType === "byMeasure") {
            return sortByIndex({ data, order, getCategory: xGetter, sortingOrder });
        }
        else {
            return orderBy(data, xGetter, "asc");
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
        getRenderingKey,
    };
};
export const useColumnsGroupedStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { sortData, xDimension, getXAsDate, getY, getSegmentAbbreviationOrLabel, getTimeRangeDate, } = variables;
    const plottableData = usePlottableData(observations, {
        getY,
    });
    return useChartData(plottableData, {
        sortData,
        chartConfig,
        timeRangeDimensionId: xDimension.id,
        getAxisValueAsDate: getXAsDate,
        getSegmentAbbreviationOrLabel,
        getTimeRangeDate,
    });
};
