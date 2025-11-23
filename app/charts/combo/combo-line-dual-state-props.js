import { min } from "d3-array";
import { useCallback } from "react";
import { sortComboData } from "@/charts/combo/combo-state-props";
import { getLabelWithUnit, usePlottableData, } from "@/charts/shared/chart-helpers";
import { shouldUseDynamicMinScaleValue, useBaseVariables, useChartData, useInteractiveFiltersVariables, useTemporalXVariables, } from "@/charts/shared/chart-state";
export const useComboLineDualStateVariables = (props) => {
    const { chartConfig, dimensionsById, measuresById } = props;
    const { fields } = chartConfig;
    const { x } = fields;
    const baseVariables = useBaseVariables(chartConfig);
    const temporalXVariables = useTemporalXVariables(x, {
        dimensionsById,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(chartConfig.interactiveFiltersConfig, { dimensionsById });
    const leftId = chartConfig.fields.y.leftAxisComponentId;
    const rightId = chartConfig.fields.y.rightAxisComponentId;
    const numericalYVariables = {
        y: {
            left: {
                orientation: "left",
                dimension: measuresById[leftId],
                id: leftId,
                label: getLabelWithUnit(measuresById[leftId]),
                color: fields.color.colorMapping[leftId],
                getY: (d) => (d[leftId] !== null ? Number(d[leftId]) : null),
                getMinY: (data) => {
                    var _a;
                    const minY = (_a = min(data, (d) => (d[leftId] !== null ? Number(d[leftId]) : null))) !== null && _a !== void 0 ? _a : 0;
                    return shouldUseDynamicMinScaleValue(measuresById[leftId].scaleType)
                        ? minY
                        : Math.min(0, minY);
                },
            },
            right: {
                orientation: "right",
                dimension: measuresById[rightId],
                id: rightId,
                label: getLabelWithUnit(measuresById[rightId]),
                color: fields.color.colorMapping[rightId],
                getY: (d) => (d[rightId] !== null ? Number(d[rightId]) : null),
                getMinY: (data) => {
                    var _a;
                    const minY = (_a = min(data, (d) => d[rightId] !== null ? Number(d[rightId]) : null)) !== null && _a !== void 0 ? _a : 0;
                    return shouldUseDynamicMinScaleValue(measuresById[rightId].scaleType)
                        ? minY
                        : Math.min(0, minY);
                },
            },
        },
    };
    const { getX } = temporalXVariables;
    const sortData = useCallback((data) => {
        return sortComboData(data, {
            getX,
        });
    }, [getX]);
    return {
        ...baseVariables,
        sortData,
        ...temporalXVariables,
        ...numericalYVariables,
        ...interactiveFiltersVariables,
    };
};
export const useComboLineDualStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { sortData, xDimension, getX, y, getTimeRangeDate } = variables;
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
        getAxisValueAsDate: getX,
        getTimeRangeDate,
    });
};
