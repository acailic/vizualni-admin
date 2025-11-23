import { memo } from "react";
import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { Columns, ErrorWhiskers } from "@/charts/column/columns";
import { ColumnsGrouped, ErrorWhiskers as ErrorWhiskersGrouped, } from "@/charts/column/columns-grouped";
import { GroupedColumnChart } from "@/charts/column/columns-grouped-state";
import { ColumnsStacked } from "@/charts/column/columns-stacked";
import { StackedColumnsChart } from "@/charts/column/columns-stacked-state";
import { ColumnChart } from "@/charts/column/columns-state";
import { InteractionColumns, InteractionColumnsStacked, StackedColumnAnnotationHighlight, } from "@/charts/column/overlay-columns";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { Annotations } from "@/charts/shared/annotations";
import { AxisHeightLinear } from "@/charts/shared/axis-height-linear";
import { AxisHideXOverflowRect } from "@/charts/shared/axis-hide-overflow-rect";
import { AxisWidthBand, AxisWidthBandDomain, } from "@/charts/shared/axis-width-band";
import { BrushTime, shouldShowBrush } from "@/charts/shared/brush";
import { ChartContainer, ChartControlsContainer, ChartSvg, } from "@/charts/shared/containers";
import { HoverAnnotationDot } from "@/charts/shared/interaction/hover-annotation-dot";
import { Tooltip } from "@/charts/shared/interaction/tooltip";
import { LegendColor } from "@/charts/shared/legend-color";
import { VerticalLimits } from "@/charts/shared/limits/vertical";
import { useChartConfigFilters, useLimits } from "@/config-utils";
import { hasChartConfigs } from "@/configurator";
import { useConfiguratorState } from "@/configurator/configurator-state";
import { TimeSlider } from "@/configurator/interactive-filters/time-slider";
export const ChartColumnsVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartColumns}/>;
};
const ChartColumns = memo((props) => {
    var _a, _b;
    const { chartConfig, dimensions, measures, dimensionsById } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const filters = useChartConfigFilters(chartConfig);
    const [{ dashboardFilters }] = useConfiguratorState(hasChartConfigs);
    const showTimeBrush = shouldShowBrush(interactiveFiltersConfig, dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.timeRange);
    const limits = useLimits({
        chartConfig,
        dimensions,
        measures,
    });
    const isEditingAnnotation = useIsEditingAnnotation();
    return (<>
      {((_a = fields.segment) === null || _a === void 0 ? void 0 : _a.componentId) && fields.segment.type === "stacked" ? (<StackedColumnsChart {...props}>
          <ChartContainer>
            <ChartSvg>
              <AxisHeightLinear />
              <AxisHideXOverflowRect />
              <AxisWidthBand />
              <AxisWidthBandDomain />
              <ColumnsStacked />
              {isEditingAnnotation ? (<>
                  <InteractionColumns disableGaps={false}/>
                  <InteractionColumnsStacked />
                  <StackedColumnAnnotationHighlight />
                </>) : (<InteractionColumns />)}
              {showTimeBrush && <BrushTime />}
            </ChartSvg>
            {isEditingAnnotation ? (<HoverAnnotationDot />) : (<Tooltip type="multiple"/>)}
          </ChartContainer>
          <Annotations />
          <ChartControlsContainer>
            {fields.animation && (<TimeSlider filters={filters} dimensions={dimensions} {...fields.animation}/>)}
            <LegendColor dimensionsById={dimensionsById} chartConfig={chartConfig} symbol="square" interactive={interactiveFiltersConfig.legend.active} showTitle={fields.segment.showTitle}/>
          </ChartControlsContainer>
        </StackedColumnsChart>) : ((_b = fields.segment) === null || _b === void 0 ? void 0 : _b.componentId) && fields.segment.type === "grouped" ? (<GroupedColumnChart {...props}>
          <ChartContainer>
            <ChartSvg>
              <AxisHeightLinear />
              <AxisHideXOverflowRect />
              <AxisWidthBand />
              <AxisWidthBandDomain />
              <ColumnsGrouped />
              <ErrorWhiskersGrouped />
              <InteractionColumns />
              {showTimeBrush && <BrushTime />}
            </ChartSvg>
            <Tooltip type="multiple"/>
          </ChartContainer>
          <ChartControlsContainer>
            {fields.animation && (<TimeSlider filters={filters} dimensions={dimensions} {...fields.animation}/>)}
            <LegendColor dimensionsById={dimensionsById} chartConfig={chartConfig} symbol="square" interactive={interactiveFiltersConfig.legend.active} showTitle={fields.segment.showTitle}/>
          </ChartControlsContainer>
        </GroupedColumnChart>) : (<ColumnChart {...props} limits={limits}>
          <ChartContainer>
            <ChartSvg>
              <AxisHeightLinear />
              <AxisHideXOverflowRect />
              <AxisWidthBand />
              <AxisWidthBandDomain />
              <Columns />
              <ErrorWhiskers />
              <VerticalLimits {...limits}/>
              <InteractionColumns />
              {showTimeBrush && <BrushTime />}
            </ChartSvg>
            {isEditingAnnotation ? (<HoverAnnotationDot />) : (<Tooltip type="single"/>)}
          </ChartContainer>
          <Annotations />
          {fields.animation || limits.limits.length > 0 ? (<ChartControlsContainer>
              {limits.limits.length > 0 && (<LegendColor limits={limits} dimensionsById={dimensionsById} chartConfig={chartConfig} symbol="square"/>)}
              {fields.animation && (<TimeSlider filters={filters} dimensions={dimensions} {...fields.animation}/>)}
            </ChartControlsContainer>) : null}
        </ColumnChart>)}
    </>);
});
