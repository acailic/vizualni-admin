import { makeStyles } from "@mui/styles";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { useQueryFilters } from "@/charts/shared/chart-helpers";
import { Observer } from "@/charts/shared/use-size";
import { useSyncInteractiveFilters } from "@/charts/shared/use-sync-interactive-filters";
const ChartAreasVisualization = dynamic(import("@/charts/area/chart-area").then((mod) => mod.ChartAreasVisualization, () => null));
const ChartColumnsVisualization = dynamic(import("@/charts/column/chart-column").then((mod) => mod.ChartColumnsVisualization, () => null));
const ChartBarsVisualization = dynamic(import("@/charts/bar/chart-bar").then((mod) => mod.ChartBarsVisualization, () => null));
const ChartComboLineSingleVisualization = dynamic(import("@/charts/combo/chart-combo-line-single").then((mod) => mod.ChartComboLineSingleVisualization, () => null));
const ChartComboLineDualVisualization = dynamic(import("@/charts/combo/chart-combo-line-dual").then((mod) => mod.ChartComboLineDualVisualization, () => null));
const ChartComboLineColumnVisualization = dynamic(import("@/charts/combo/chart-combo-line-column").then((mod) => mod.ChartComboLineColumnVisualization, () => null));
const ChartLinesVisualization = dynamic(import("@/charts/line/chart-lines").then((mod) => mod.ChartLinesVisualization, () => null));
const ChartMapVisualization = dynamic(import("@/charts/map/chart-map").then((mod) => mod.ChartMapVisualization, () => null));
const ChartPieVisualization = dynamic(import("@/charts/pie/chart-pie").then((mod) => mod.ChartPieVisualization, () => null));
const ChartScatterplotVisualization = dynamic(import("@/charts/scatterplot/chart-scatterplot").then((mod) => mod.ChartScatterplotVisualization, () => null));
const ChartTableVisualization = dynamic(import("@/charts/table/chart-table").then((mod) => mod.ChartTableVisualization, () => null));
const GenericChart = ({ dataSource, componentIds, chartConfig, dashboardFilters, embedParams, }) => {
    const observationQueryFilters = useQueryFilters({
        chartConfig,
        dashboardFilters,
        componentIds,
    });
    const commonProps = {
        dataSource,
        observationQueryFilters,
        componentIds,
        embedParams,
    };
    switch (chartConfig.chartType) {
        case "column":
            return (<ChartColumnsVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "bar":
            return (<ChartBarsVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "line":
            return (<ChartLinesVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "area":
            return (<ChartAreasVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "scatterplot":
            return (<ChartScatterplotVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "pie":
            return (<ChartPieVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "table":
            return (<ChartTableVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "map":
            return (<ChartMapVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "comboLineSingle":
            return (<ChartComboLineSingleVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "comboLineDual":
            return (<ChartComboLineDualVisualization {...commonProps} chartConfig={chartConfig}/>);
        case "comboLineColumn":
            return (<ChartComboLineColumnVisualization {...commonProps} chartConfig={chartConfig}/>);
        default:
            const _exhaustiveCheck = chartConfig;
            return _exhaustiveCheck;
    }
};
// Note: ChartWithFiltersProps is now imported from chart-props.tsx
export const useChartWithFiltersClasses = makeStyles(() => ({
    chartWithFilters: {
        width: "100%",
        height: "100%",
    },
}));
export const ChartWithFilters = forwardRef((props, ref) => {
    useSyncInteractiveFilters(props.chartConfig, props.dashboardFilters);
    const classes = useChartWithFiltersClasses();
    return (<div className={classes.chartWithFilters} ref={ref}>
      <Observer>
        <GenericChart {...props}/>
      </Observer>
    </div>);
});
ChartWithFilters.displayName = "ChartWithFilters";
