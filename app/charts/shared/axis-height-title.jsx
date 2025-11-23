import { useChartState } from "@/charts/shared/chart-state";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { OpenMetadataPanelWrapper } from "@/components/metadata-panel";
export const AxisHeightTitle = () => {
    const { axisLabelFontSize } = useChartTheme();
    const { chartType, yAxisLabel, leftAxisLabelSize, leftAxisLabelOffsetTop } = useChartState();
    // Axis title can also be used in combo line single charts.
    const { yMeasure } = useChartState();
    return (<>
      {chartType === "comboLineSingle" ? (<text y={axisLabelFontSize} style={{ fontSize: axisLabelFontSize, fill: "black" }}>
          {yAxisLabel}
        </text>) : (<foreignObject y={leftAxisLabelOffsetTop} width={leftAxisLabelSize.width} height={leftAxisLabelSize.height} style={{ display: "flex" }}>
          <OpenMetadataPanelWrapper component={yMeasure}>
            <span style={{ fontSize: axisLabelFontSize, lineHeight: 1.5 }}>
              {yAxisLabel}
            </span>
          </OpenMetadataPanelWrapper>
        </foreignObject>)}
    </>);
};
