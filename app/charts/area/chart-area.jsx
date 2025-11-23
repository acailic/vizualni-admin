import { memo } from "react";
import { Areas } from "@/charts/area/areas";
import { AreaChart } from "@/charts/area/areas-state";
import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { useIsEditingAnnotation } from "@/charts/shared/annotation-utils";
import { Annotations } from "@/charts/shared/annotations";
import { AxisHeightLinear } from "@/charts/shared/axis-height-linear";
import { AxisHideXOverflowRect } from "@/charts/shared/axis-hide-overflow-rect";
import { AxisTime, AxisTimeDomain } from "@/charts/shared/axis-width-time";
import { BrushTime } from "@/charts/shared/brush";
import { ChartContainer, ChartControlsContainer, ChartSvg, } from "@/charts/shared/containers";
import { HoverAnnotationDot } from "@/charts/shared/interaction/hover-annotation-dot";
import { Ruler } from "@/charts/shared/interaction/ruler";
import { Tooltip } from "@/charts/shared/interaction/tooltip";
import { LegendColor } from "@/charts/shared/legend-color";
import { VerticalLimits } from "@/charts/shared/limits/vertical";
import { InteractionHorizontal } from "@/charts/shared/overlay-horizontal";
import { InteractionVoronoi } from "@/charts/shared/overlay-voronoi";
import { useLimits } from "@/config-utils";
export const ChartAreasVisualization = (props) => {
    return <ChartDataWrapper {...props} Component={ChartAreas}/>;
};
const ChartAreas = memo((props) => {
    var _a;
    const { chartConfig, dimensions, measures, dimensionsById } = props;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const limits = useLimits({
        chartConfig,
        dimensions,
        measures,
    });
    const isEditingAnnotation = useIsEditingAnnotation();
    return (<AreaChart {...props} limits={limits}>
      <ChartContainer>
        <ChartSvg>
          <AxisHeightLinear />
          <AxisHideXOverflowRect />
          <AxisTime />
          <AxisTimeDomain />
          <Areas />
          <VerticalLimits {...limits}/>
          {isEditingAnnotation ? (<InteractionVoronoi />) : (<InteractionHorizontal />)}
          {interactiveFiltersConfig.timeRange.active && <BrushTime />}
        </ChartSvg>
        {isEditingAnnotation ? (<HoverAnnotationDot />) : (<Tooltip type={fields.segment ? "multiple" : "single"}/>)}
        <Ruler />
      </ChartContainer>
      <Annotations />
      {(fields.segment || limits.limits.length > 0) && (<ChartControlsContainer>
          <LegendColor chartConfig={chartConfig} symbol="square" interactive={interactiveFiltersConfig.legend.active} showTitle={(_a = fields.segment) === null || _a === void 0 ? void 0 : _a.showTitle} dimensionsById={dimensionsById} limits={limits}/>
        </ChartControlsContainer>)}
    </AreaChart>);
});
