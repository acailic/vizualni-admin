import { min } from "d3-array";
import { useCallback } from "react";
import { sortComboData } from "@/charts/combo/combo-state-props";
import { shouldUseDynamicMinScaleValue, useBaseVariables, useChartData, useInteractiveFiltersVariables, useTemporalXVariables, } from "@/charts/shared/chart-state";
import { usePlottableData } from "../shared/chart-helpers";
export const useComboLineSingleStateVariables = (props) => {
    const { chartConfig, dimensionsById, measuresById } = props;
    const { fields } = chartConfig;
    const { x } = fields;
    const baseVariables = useBaseVariables(chartConfig);
    const temporalXVariables = useTemporalXVariables(x, {
        dimensionsById,
    });
    const interactiveFiltersVariables = useInteractiveFiltersVariables(chartConfig.interactiveFiltersConfig, { dimensionsById });
    const numericalYVariables = {
        y: {
            lines: chartConfig.fields.y.componentIds.map((id) => ({
                dimension: measuresById[id],
                id,
                label: measuresById[id].label,
                color: fields.color.colorMapping[id],
                getY: (d) => (d[id] !== null ? Number(d[id]) : null),
                getMinY: (data) => {
                    var _a;
                    const minY = (_a = min(data, (d) => (d[id] !== null ? Number(d[id]) : null))) !== null && _a !== void 0 ? _a : 0;
                    return shouldUseDynamicMinScaleValue(measuresById[id].scaleType)
                        ? minY
                        : Math.min(0, minY);
                },
            })),
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
export const useComboLineSingleStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { sortData, xDimension, getX, y, getTimeRangeDate } = variables;
    const plottableData = usePlottableData(observations, {
        getX,
        getY: (d) => {
            for (const { getY } of y.lines) {
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
