import { memo } from "react";
import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { Pie } from "@/charts/pie/pie";
import { PieChart } from "@/charts/pie/pie-state";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { Annotations } from "@/charts/shared/annotations";
import { AxisHeightTitle } from "@/charts/shared/axis-height-title";
import { ChartContainer, ChartControlsContainer, ChartSvg, } from "@/charts/shared/containers";
import { HoverAnnotationDot } from "@/charts/shared/interaction/hover-annotation-dot";
import { Tooltip } from "@/charts/shared/interaction/tooltip";
import { LegendColor } from "@/charts/shared/legend-color";
import { OnlyNegativeDataHint } from "@/components/hint";
import { useChartConfigFilters } from "@/config-utils";
import { TimeSlider } from "@/configurator/interactive-filters/time-slider";
export const ChartPieVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartPie}/>;
};
const ChartPie = memo((props) => {
    const { chartConfig, observations, dimensions, dimensionsById } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const somePositive = observations.some((d) => { var _a; return d[(_a = fields === null || fields === void 0 ? void 0 : fields.y) === null || _a === void 0 ? void 0 : _a.componentId] > 0; });
    const filters = useChartConfigFilters(chartConfig);
    const isEditingAnnotation = useIsEditingAnnotation();
    if (!somePositive) {
        return <OnlyNegativeDataHint />;
    }
    return (<PieChart {...props}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightTitle />
          <Pie />
        </ChartSvg>
        {isEditingAnnotation ? (<HoverAnnotationDot />) : (<Tooltip type="single"/>)}
      </ChartContainer>
      <Annotations />
      <ChartControlsContainer>
        {fields.animation && (<TimeSlider filters={filters} dimensions={dimensions} {...fields.animation}/>)}
        <LegendColor dimensionsById={dimensionsById} chartConfig={chartConfig} symbol="square" interactive={fields.segment && interactiveFiltersConfig.legend.active} showTitle={fields.segment.showTitle}/>
      </ChartControlsContainer>
    </PieChart>);
});
