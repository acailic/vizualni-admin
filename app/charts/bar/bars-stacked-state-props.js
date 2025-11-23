import { ascending, descending, group } from "d3-array";
import { useCallback, useMemo } from "react";
import { getWideData, usePlottableData } from "@/charts/shared/chart-helpers";
import { useBandYVariables, useBaseVariables, useChartData, useInteractiveFiltersVariables, useNumericalXVariables, useSegmentVariables, } from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";
import { isTemporalEntityDimension } from "@/domain/data";
import { sortByIndex } from "@/utils/array";
export const useBarsStackedStateVariables = (props) => {
    const { chartConfig, observations, dimensions, dimensionsById, measuresById, } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x, y, segment, animation } = fields;
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
    const segmentVariables = useSegmentVariables(segment, {
        dimensionsById,
        observations,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(interactiveFiltersConfig, { dimensionsById });
    const { getY, getYAsDate } = bandYVariables;
    const sortData = useCallback((data, { plottableDataWide }) => {
        var _a;
        const { sortingOrder, sortingType } = (_a = y.sorting) !== null && _a !== void 0 ? _a : {};
        const yGetter = isTemporalEntityDimension(yDimension)
            ? (d) => getYAsDate(d).getTime().toString()
            : getY;
        const yOrder = plottableDataWide
            .sort((a, b) => { var _a, _b; return ascending((_a = a.total) !== null && _a !== void 0 ? _a : undefined, (_b = b.total) !== null && _b !== void 0 ? _b : undefined); })
            .map(yGetter);
        if (sortingOrder === "desc" && sortingType === "byDimensionLabel") {
            return [...data].sort((a, b) => descending(yGetter(a), yGetter(b)));
        }
        else if (sortingOrder === "asc" && sortingType === "byDimensionLabel") {
            return [...data].sort((a, b) => ascending(yGetter(a), yGetter(b)));
        }
        else if (sortingType === "byMeasure") {
            return sortByIndex({
                data,
                order: yOrder,
                getCategory: yGetter,
                sortingOrder,
            });
        }
        else {
            return [...data].sort((a, b) => ascending(yGetter(a), yGetter(b)));
        }
    }, [getY, getYAsDate, y.sorting, yDimension]);
    const getRenderingKey = useRenderingKeyVariable(dimensions, filters, animation);
    return {
        ...baseVariables,
        sortData,
        ...bandYVariables,
        ...numericalXVariables,
        ...segmentVariables,
        ...interactiveFiltersVariables,
        getRenderingKey,
    };
};
export const useBarsStackedStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { fields } = chartConfig;
    const { y } = fields;
    const { sortData, yDimension, getX, getYAsDate, getY, getSegment, getSegmentAbbreviationOrLabel, getTimeRangeDate, } = variables;
    const plottableData = usePlottableData(observations, {
        getX,
    });
    const plottableDataWide = useMemo(() => {
        const plottableDataByY = group(plottableData, getY);
        return getWideData({
            dataGrouped: plottableDataByY,
            key: y.componentId,
            getAxisValue: getX,
            getSegment,
        });
    }, [plottableData, getX, y.componentId, getY, getSegment]);
    const sortPlottableData = useCallback((data) => {
        return sortData(data, { plottableDataWide });
    }, [plottableDataWide, sortData]);
    const data = useChartData(plottableData, {
        sortData: sortPlottableData,
        chartConfig,
        timeRangeDimensionId: yDimension.id,
        getAxisValueAsDate: getYAsDate,
        getSegmentAbbreviationOrLabel,
        getTimeRangeDate,
    });
    return {
        ...data,
        plottableDataWide,
    };
};
