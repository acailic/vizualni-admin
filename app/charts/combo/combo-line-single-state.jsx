import { mean } from "d3-array";
import { schemeCategory10 } from "d3-scale-chromatic";
import { useComboLineSingleStateData, useComboLineSingleStateVariables, } from "@/charts/combo/combo-line-single-state-props";
import { adjustScales, getMargins, useCommonComboState, useYScales, } from "@/charts/combo/combo-state";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { ChartContext, } from "@/charts/shared/chart-state";
import { getCenteredTooltipPlacement, MOBILE_TOOLTIP_PLACEMENT, } from "@/charts/shared/interaction/tooltip-box";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { truthy } from "@/domain/types";
import { useIsMobile } from "@/utils/use-is-mobile";
const useComboLineSingleState = (chartProps, variables, data) => {
    var _a;
    const { chartConfig, measuresById } = chartProps;
    const { xDimension, getX, getXAsString, xAxisLabel } = variables;
    const { chartData, scalesData, timeRangeData, paddingData, allData } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const yUnits = Array.from(new Set(variables.y.lines.map((d) => {
        return measuresById[d.id].unit;
    })));
    if (yUnits.length > 1) {
        throw Error("Multiple units are not supported in ComboLineSingle chart!");
    }
    const yAxisLabel = (_a = yUnits[0]) !== null && _a !== void 0 ? _a : "";
    const xKey = fields.x.componentId;
    const { width, height, formatNumber, timeFormatUnit, chartWideData, xScaleTime: xScale, xScaleTimeRange, colors, } = useCommonComboState({
        chartData,
        timeRangeData,
        xKey,
        getXAsDate: getX,
        getXAsString,
        yGetters: variables.y.lines,
        computeTotal: true,
    });
    // y
    const { yScale, paddingYScale } = useYScales({
        scalesData,
        paddingData,
        getY: variables.y.lines.map((d) => d.getY),
        getMinY: variables.y.lines.map((d) => d.getMinY),
    });
    // Dimensions
    const { top, left, bottom } = useChartPadding({
        xLabelPresent: !!xAxisLabel,
        yScale: paddingYScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
    });
    const margins = getMargins({ top, left, bottom });
    const leftAxisLabelSize = useAxisLabelSizeVariables({
        label: yAxisLabel,
        width,
    });
    const bottomAxisLabelSize = useAxisLabelSizeVariables({
        label: xAxisLabel,
        width,
    });
    const chartWidth = getChartWidth({
        width,
        left: margins.left,
        right: margins.right,
    });
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    const { chartHeight } = bounds;
    const xScales = [xScale, xScaleTimeRange];
    const yScales = [yScale];
    adjustScales(xScales, yScales, { chartWidth, chartHeight });
    const isMobile = useIsMobile();
    const getTooltipInfo = (datum) => {
        var _a;
        const x = getX(datum);
        const xScaled = xScale(x);
        const values = variables.y.lines
            .map(({ getY, id, label }) => {
            const yRaw = getY(datum);
            if (!Number.isFinite(yRaw) || yRaw === null) {
                return null;
            }
            return {
                label,
                value: `${yRaw}`,
                color: colors(id),
                axis: "y",
                axisOffset: yScale(yRaw !== null && yRaw !== void 0 ? yRaw : 0),
                symbol: "line",
            };
        })
            .filter(truthy);
        const yAnchor = isMobile
            ? chartHeight
            : ((_a = mean(values.map((d) => d.axisOffset))) !== null && _a !== void 0 ? _a : chartHeight);
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor: xScaled,
                topAnchor: false,
            });
        return {
            datum: { label: "", value: "0", color: schemeCategory10[0] },
            xAnchor: xScaled,
            yAnchor: yAnchor,
            value: timeFormatUnit(x, xDimension.timeUnit),
            placement,
            values,
        };
    };
    return {
        chartType: "comboLineSingle",
        xKey,
        bounds,
        chartData,
        allData,
        xScale,
        xScaleTimeRange,
        yScale,
        yAxisLabel,
        colors,
        getColorLabel: (label) => label,
        chartWideData,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        ...variables,
    };
};
const ComboLineSingleChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useComboLineSingleStateVariables(chartProps);
    const data = useComboLineSingleStateData(chartProps, variables);
    const state = useComboLineSingleState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const ComboLineSingleChart = (props) => {
    return (<InteractionProvider>
      <ComboLineSingleChartProvider {...props}/>
    </InteractionProvider>);
};
