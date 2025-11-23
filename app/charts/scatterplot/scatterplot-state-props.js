import { usePlottableData } from "@/charts/shared/chart-helpers";
import { useBaseVariables, useChartData, useNumericalXVariables, useNumericalYVariables, useSegmentVariables, } from "@/charts/shared/chart-state";
import { useRenderingKeyVariable } from "@/charts/shared/rendering-utils";
import { useChartConfigFilters } from "@/config-utils";
export const useScatterplotStateVariables = (props) => {
    const { chartConfig, observations, dimensions, dimensionsById, measuresById, } = props;
    const { fields } = chartConfig;
    const { x, y, segment, animation } = fields;
    const filters = useChartConfigFilters(chartConfig);
    const baseVariables = useBaseVariables(chartConfig);
    const numericalXVariables = useNumericalXVariables("scatterplot", x, {
        measuresById,
    });
    const numericalYVariables = useNumericalYVariables("scatterplot", y, {
        measuresById,
    });
    const segmentVariables = useSegmentVariables(segment, {
        dimensionsById,
        observations,
    });
    const getRenderingKey = useRenderingKeyVariable(dimensions, filters, animation);
    return {
        ...baseVariables,
        ...numericalXVariables,
        ...numericalYVariables,
        ...segmentVariables,
        getRenderingKey,
    };
};
export const useScatterplotStateData = (chartProps, variables) => {
    const { chartConfig, observations } = chartProps;
    const { getX, getY, getSegmentAbbreviationOrLabel } = variables;
    const plottableData = usePlottableData(observations, {
        getX,
        getY,
    });
    return useChartData(plottableData, {
        chartConfig,
        timeRangeDimensionId: undefined,
        getSegmentAbbreviationOrLabel,
    });
};
