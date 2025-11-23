import { useCallback, useState } from "react";
import { getChartConfig } from "@/config-utils";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { moveFields } from "@/configurator/table/table-config-state";
import { useDataCubesComponentsQuery } from "@/graphql/hooks";
import { useLocale } from "@/locales/use-locale";
export const useTableChartController = (state) => {
    const locale = useLocale();
    const [, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const [{ data: components }] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            sourceType: state.dataSource.type,
            sourceUrl: state.dataSource.url,
            locale,
            cubeFilters: chartConfig.cubes.map((cube) => ({
                iri: cube.iri,
                joinBy: cube.joinBy,
                loadValues: true,
            })),
        },
    });
    const [currentDraggableId, setCurrentDraggableId] = useState(null);
    const handleDragEnd = useCallback(({ source, destination, }) => {
        setCurrentDraggableId(null);
        if (!destination ||
            chartConfig.chartType !== "table" ||
            !(components === null || components === void 0 ? void 0 : components.dataCubesComponents)) {
            return;
        }
        const newChartConfig = moveFields(chartConfig, {
            source,
            destination,
        });
        dispatch({
            type: "CHART_CONFIG_REPLACED",
            value: {
                chartConfig: newChartConfig,
                dataCubesComponents: components.dataCubesComponents,
            },
        });
    }, [chartConfig, components === null || components === void 0 ? void 0 : components.dataCubesComponents, dispatch]);
    const handleDragStart = useCallback(({ draggableId }) => {
        setCurrentDraggableId(draggableId);
    }, []);
    return {
        dimensions: components === null || components === void 0 ? void 0 : components.dataCubesComponents.dimensions,
        measures: components === null || components === void 0 ? void 0 : components.dataCubesComponents.measures,
        currentDraggableId,
        handleDragStart,
        handleDragEnd,
        chartConfig,
    };
};
