import { min } from "d3-array";
import { useCallback } from "react";
import { sortComboData } from "@/charts/combo/combo-state-props";
import { getLabelWithUnit, usePlottableData, } from "@/charts/shared/chart-helpers";
import { shouldUseDynamicMinScaleValue, useBandXVariables, useBaseVariables, useChartData, useInteractiveFiltersVariables, } from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";
export const useComboLineColumnStateVariables = (props) => {
    const { chartConfig, dimensions, dimensionsById, measuresById, observations, } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x } = fields;
    const filters = useChartConfigFilters(chartConfig);
    const baseVariables = useBaseVariables(chartConfig);
    const bandXVariables = useBandXVariables(x, {
        dimensionsById,
        observations,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(interactiveFiltersConfig, { dimensionsById });
    const lineId = chartConfig.fields.y.lineComponentId;
    const lineAxisOrientation = chartConfig.fields.y.lineAxisOrientation;
    const columnId = chartConfig.fields.y.columnComponentId;
    let numericalYVariables;
    const lineYGetter = {
        chartType: "line",
        orientation: lineAxisOrientation,
        dimension: measuresById[lineId],
        id: lineId,
        label: getLabelWithUnit(measuresById[lineId]),
        color: fields.color.colorMapping[lineId],
        getY: (d) => (d[lineId] !== null ? Number(d[lineId]) : null),
        getMinY: (data) => {
            var _a;
            const minY = (_a = min(data, (d) => (d[lineId] !== null ? Number(d[lineId]) : null))) !== null && _a !== void 0 ? _a : 0;
            return shouldUseDynamicMinScaleValue(measuresById[lineId].scaleType)
                ? minY
                : Math.min(0, minY);
        },
    };
    const columnYGetter = {
        chartType: "column",
        orientation: lineAxisOrientation === "left" ? "right" : "left",
        dimension: measuresById[columnId],
        id: columnId,
        label: getLabelWithUnit(measuresById[columnId]),
        color: fields.color.colorMapping[columnId],
        getY: (d) => (d[columnId] !== null ? Number(d[columnId]) : null),
        getMinY: (data) => {
            var _a;
            const minY = (_a = min(data, (d) => (d[columnId] !== null ? Number(d[columnId]) : null))) !== null && _a !== void 0 ? _a : 0;
            return Math.min(0, minY);
        },
    };
    numericalYVariables =
        lineAxisOrientation === "left"
            ? {
                y: {
                    left: lineYGetter,
                    right: columnYGetter,
                },
            }
            : {
                y: {
                    left: columnYGetter,
                    right: lineYGetter,
                },
            };
    const { getXAsDate } = bandXVariables;
    const sortData = useCallback((data) => {
        return sortComboData(data, {
            getX: getXAsDate,
        });
    }, [getXAsDate]);
    const getRenderingKey = useRenderingKeyVariable(dimensions, filters, undefined);
    return {
        ...baseVariables,
        sortData,
        ...bandXVariables,
        ...numericalYVariables,
        ...interactiveFiltersVariables,
        getRenderingKey,
    };
};
export const useComboLineColumnStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { sortData, xDimension, getX, getXAsDate, y, getTimeRangeDate } = variables;
    const plottableData = usePlottableData(observations, {
        getX,
        getY: (d) => {
            for (const { getY } of [y.left, y.right]) {
                const y = getY(d);
                if (y !== null) {
                    return y;
                }
            }
        },
    });
    return useChartData(plottableData, {
        sortData,
        chartConfig,
        timeRangeDimensionId: xDimension.id,
        getAxisValueAsDate: getXAsDate,
        getTimeRangeDate,
    });
};
