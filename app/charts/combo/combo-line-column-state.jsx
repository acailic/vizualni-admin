import { max, mean, min } from "d3-array";
import { scaleBand, scaleLinear, } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { PADDING_INNER, PADDING_OUTER } from "@/charts/column/constants";
import { useComboLineColumnStateData, useComboLineColumnStateVariables, } from "@/charts/combo/combo-line-column-state-props";
import { adjustScales, useCommonComboState, useDualAxisMargins, useYScales, } from "@/charts/combo/combo-state";
import { TICK_PADDING } from "@/charts/shared/axis-height-linear";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { ChartContext, } from "@/charts/shared/chart-state";
import { getCenteredTooltipPlacement, MOBILE_TOOLTIP_PLACEMENT, } from "@/charts/shared/interaction/tooltip-box";
import { getTickNumber } from "@/charts/shared/ticks";
import { TICK_FONT_SIZE } from "@/charts/shared/use-chart-theme";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { truthy } from "@/domain/types";
import { getTimeInterval } from "@/intervals";
import { getTextWidth } from "@/utils/get-text-width";
import { useIsMobile } from "@/utils/use-is-mobile";
const useComboLineColumnState = (chartProps, variables, data) => {
    var _a, _b;
    const { chartConfig } = chartProps;
    const { getX, getXAsDate, xAxisLabel, formatXDate } = variables;
    const { chartData, scalesData, timeRangeData, paddingData, allData } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const xKey = fields.x.componentId;
    const { width, height, formatNumber, timeFormatUnit, chartWideData, xScaleTime, xScaleTimeRange, colors, } = useCommonComboState({
        chartData,
        timeRangeData,
        getXAsDate,
        getXAsString: getX,
        xKey,
        yGetters: [variables.y.left, variables.y.right],
        computeTotal: false,
    });
    // x
    const xTimeUnit = variables.xTimeUnit;
    const interval = getTimeInterval(xTimeUnit);
    const [xMin, xMax] = xScaleTime.domain();
    const xDomain = interval.range(xMin, xMax).concat(xMax).map(formatXDate);
    const xScale = scaleBand()
        .domain(xDomain)
        .paddingInner(PADDING_INNER)
        .paddingOuter(PADDING_OUTER);
    // y
    const { yScale: yScaleLeft, paddingYScale: paddingLeftYScale } = useYScales({
        scalesData,
        paddingData,
        getY: variables.y.left.getY,
        getMinY: variables.y.left.getMinY,
    });
    const { yScale: yScaleRight, paddingYScale: paddingRightYScale } = useYScales({
        scalesData,
        paddingData,
        getY: variables.y.right.getY,
        getMinY: variables.y.right.getMinY,
    });
    const [minLeftValue, maxLeftValue] = yScaleLeft.domain();
    const [minRightValue, maxRightValue] = yScaleRight.domain();
    const minValue = (_a = min([minLeftValue, minRightValue])) !== null && _a !== void 0 ? _a : 0;
    const maxValue = (_b = max([maxLeftValue, maxRightValue])) !== null && _b !== void 0 ? _b : 0;
    const yScale = scaleLinear().domain([minValue, maxValue]).nice();
    const yOrientationScales = {
        left: yScaleLeft,
        right: yScaleRight,
    };
    // Dimensions
    const { left, bottom } = useChartPadding({
        xLabelPresent: !!xAxisLabel,
        yScale: paddingLeftYScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
        bandDomain: xDomain,
    });
    const fakeRightTicks = paddingRightYScale.ticks(getTickNumber(height));
    const maxRightTickWidth = Math.max(...fakeRightTicks.map((d) => getTextWidth(formatNumber(d), { fontSize: TICK_FONT_SIZE }) +
        TICK_PADDING));
    const margins = useDualAxisMargins({
        width,
        left,
        bottom,
        maxRightTickWidth,
        leftAxisTitle: variables.y.left.label,
        rightAxisTitle: variables.y.right.label,
    });
    const leftAxisLabelSize = useAxisLabelSizeVariables({
        label: variables.y.left.label,
        width,
    });
    const rightAxisLabelSize = useAxisLabelSizeVariables({
        label: variables.y.right.label,
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
    const xScales = [xScale, xScaleTime, xScaleTimeRange];
    const yScales = [yScale, yScaleLeft, yScaleRight];
    adjustScales(xScales, yScales, { chartWidth, chartHeight });
    const isMobile = useIsMobile();
    const getTooltipInfo = (datum) => {
        const x = getXAsDate(datum);
        const xScaled = xScale(formatXDate(x)) + xScale.bandwidth() * 0.5;
        const values = [variables.y.left, variables.y.right]
            .map(({ orientation, getY, id, label, chartType }) => {
            const yRaw = getY(datum);
            if (!Number.isFinite(yRaw) || yRaw === null) {
                return null;
            }
            const axisOffset = yOrientationScales[orientation](yRaw !== null && yRaw !== void 0 ? yRaw : 0);
            return {
                label,
                value: `${yRaw}`,
                color: colors(id),
                axis: "y",
                axisOffset,
                symbol: chartType === "line" ? "line" : "square",
            };
        })
            .filter(truthy);
        const yAnchor = isMobile
            ? chartHeight
            : mean(values.map((d) => d.axisOffset));
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor: xScaled,
                topAnchor: false,
            });
        return {
            datum: {
                label: "",
                value: "0",
                color: schemeCategory10[0],
            },
            xAnchor: xScaled,
            yAnchor,
            value: timeFormatUnit(x, xTimeUnit),
            placement,
            values,
        };
    };
    return {
        chartType: "comboLineColumn",
        xKey,
        bounds,
        maxRightTickWidth,
        chartData,
        allData,
        xScale,
        xScaleInteraction: xScale.copy().padding(0),
        xScaleTime,
        xScaleTimeRange,
        yScale,
        yOrientationScales,
        colors,
        getColorLabel: (label) => label,
        chartWideData,
        getTooltipInfo,
        leftAxisLabelSize: {
            width: Math.max(leftAxisLabelSize.width, rightAxisLabelSize.width),
            height: Math.max(leftAxisLabelSize.height, rightAxisLabelSize.height),
            offset: Math.max(leftAxisLabelSize.offset, rightAxisLabelSize.offset),
        },
        bottomAxisLabelSize,
        ...variables,
    };
};
const ComboLineColumnChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useComboLineColumnStateVariables(chartProps);
    const data = useComboLineColumnStateData(chartProps, variables);
    const state = useComboLineColumnState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const ComboLineColumnChart = (props) => {
    return (<InteractionProvider>
      <ComboLineColumnChartProvider {...props}/>
    </InteractionProvider>);
};
