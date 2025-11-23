import { memo } from "react";
import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { BrushTime, shouldShowBrush } from "@/charts/shared/brush";
import { ChartContainer } from "@/charts/shared/containers";
import { Table, TABLE_TIME_RANGE_HEIGHT } from "@/charts/table/table";
import { TableChart } from "@/charts/table/table-state";
import { hasChartConfigs, useConfiguratorState } from "@/configurator";
export const ChartTableVisualization = (props) => {
    const { observationQueryFilters } = props;
    return (<ChartDataWrapper {...props} observationQueryFilters={observationQueryFilters} Component={ChartTable}/>);
};
const ChartTable = memo(function ChartTable(props) {
    const { chartConfig } = props;
    const { interactiveFiltersConfig } = chartConfig;
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    const showTimeBrush = shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange);
    return (<TableChart {...props}>
      <ChartContainer>
        {showTimeBrush && (<svg style={{
                width: "100%",
                height: TABLE_TIME_RANGE_HEIGHT,
                minHeight: TABLE_TIME_RANGE_HEIGHT,
            }}>
            <BrushTime yOffset={10}/>
          </svg>)}
        <Table />
      </ChartContainer>
    </TableChart>);
});
