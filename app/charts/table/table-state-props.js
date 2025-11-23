import { usePlottableData } from "@/charts/shared/chart-helpers";
import { useBaseVariables, useChartData, useTemporalMaybeXVariables, } from "@/charts/shared/chart-state";
export const useTableStateVariables = (props) => {
    const { chartConfig, dimensionsById } = props;
    const baseVariables = useBaseVariables(chartConfig);
    const { timeRange } = chartConfig.interactiveFiltersConfig;
    const timeRangeDimensionId = timeRange.active
        ? timeRange.componentId
        : undefined;
    const temporalMaybeXVariables = useTemporalMaybeXVariables({ componentId: timeRangeDimensionId }, { dimensionsById });
    return { ...baseVariables, ...temporalMaybeXVariables };
};
export const useTableStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { xDimension, getX } = variables;
    const plottableData = usePlottableData(observations, {});
    return useChartData(plottableData, {
        chartConfig,
        timeRangeDimensionId: xDimension === null || xDimension === void 0 ? void 0 : xDimension.id,
        axisDimensionId: xDimension === null || xDimension === void 0 ? void 0 : xDimension.id,
        getAxisValueAsDate: getX,
        getTimeRangeDate: getX,
    });
};
