import { extent, max, rollup, sum } from "d3-array";
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useBarsStateData, useBarsStateVariables, } from "@/charts/bar/bars-state-props";
import { MIN_BAR_HEIGHT, PADDING_INNER, PADDING_OUTER, } from "@/charts/bar/constants";
import { DEFAULT_ANNOTATION_CIRCLE_COLOR } from "@/charts/shared/annotation-circle";
import { ANNOTATION_SINGLE_SEGMENT_OFFSET, } from "@/charts/shared/annotations";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { ChartContext, } from "@/charts/shared/chart-state";
import { getCenteredTooltipPlacement, MOBILE_TOOLTIP_PLACEMENT, } from "@/charts/shared/interaction/tooltip-box";
import { DEFAULT_MARGIN_TOP } from "@/charts/shared/margins";
import { useShowBandValueLabelsVariables, } from "@/charts/shared/show-values-utils";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { isTemporalDimension } from "@/domain/data";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";
import { getPalette } from "@/palettes";
import { getSortingOrders, makeDimensionValueSorters, } from "@/utils/sorting-values";
import { useIsMobile } from "@/utils/use-is-mobile";
const useBarsState = (chartProps, variables, data) => {
    const { chartConfig, dimensions, measures } = chartProps;
    const { yDimension, getX, getYAsDate, getYAbbreviationOrLabel, getYLabel, formatYDate, xMeasure, getY, getMinX, getXErrorRange, getFormattedXUncertainty, getSegmentLabel, xAxisLabel, yAxisLabel, minLimitValue, maxLimitValue, } = variables;
    const { chartData, scalesData, timeRangeData, paddingData, allData } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x } = fields;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const formatters = useChartFormatters(chartProps);
    const sumsByY = useMemo(() => {
        return Object.fromEntries(rollup(chartData, (v) => sum(v, (x) => getX(x)), (x) => getY(x)));
    }, [chartData, getX, getY]);
    const { xScale, paddingXScale, yScale, minY, yScaleTimeRange, yScaleInteraction, yTimeRangeDomainLabels, } = useMemo(() => {
        var _a, _b, _c;
        const sorters = makeDimensionValueSorters(yDimension, {
            sorting: fields.y.sorting,
            measureBySegment: sumsByY,
            useAbbreviations: fields.y.useAbbreviations,
            dimensionFilter: (yDimension === null || yDimension === void 0 ? void 0 : yDimension.id)
                ? (_a = chartConfig.cubes.find((d) => d.iri === yDimension.cubeIri)) === null || _a === void 0 ? void 0 : _a.filters[yDimension.id]
                : undefined,
        });
        const sortingOrders = getSortingOrders(sorters, fields.y.sorting);
        const bandDomain = orderBy([...new Set(scalesData.map(getY))], sorters, sortingOrders);
        const yTimeRangeValues = [...new Set(timeRangeData.map(getY))];
        const yTimeRangeDomainLabels = yTimeRangeValues.map(getYLabel);
        const yScale = scaleBand()
            .domain(bandDomain)
            .paddingInner(PADDING_INNER)
            .paddingOuter(PADDING_OUTER);
        const yScaleInteraction = scaleBand()
            .domain(bandDomain)
            .paddingInner(0)
            .paddingOuter(0);
        const yScaleTimeRangeDomain = extent(timeRangeData, (d) => getYAsDate(d));
        const yScaleTimeRange = scaleTime().domain(yScaleTimeRangeDomain);
        const xScale = scaleLinear();
        const paddingXScale = scaleLinear();
        if (x.customDomain) {
            xScale.domain(x.customDomain);
            paddingXScale.domain(x.customDomain);
        }
        else {
            const minValue = getMinX(scalesData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getX(d);
            });
            const maxValue = Math.max((_b = max(scalesData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getX(d);
            })) !== null && _b !== void 0 ? _b : 0, 0);
            xScale
                .domain([
                minLimitValue !== undefined
                    ? Math.min(minLimitValue, minValue)
                    : minValue,
                maxLimitValue !== undefined
                    ? Math.max(maxLimitValue, maxValue)
                    : maxValue,
            ])
                .nice();
            const paddingMinValue = getMinX(paddingData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getX(d);
            });
            const paddingMaxValue = Math.max((_c = max(paddingData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getX(d);
            })) !== null && _c !== void 0 ? _c : 0, 0);
            paddingXScale
                .domain([
                minLimitValue !== undefined
                    ? Math.min(minLimitValue, paddingMinValue)
                    : paddingMinValue,
                maxLimitValue !== undefined
                    ? Math.max(maxLimitValue, paddingMaxValue)
                    : paddingMaxValue,
            ])
                .nice();
        }
        return {
            xScale,
            yScale,
            minY: bandDomain[0],
            paddingXScale,
            yScaleTimeRange,
            yScaleInteraction,
            yTimeRangeDomainLabels,
        };
    }, [
        yDimension,
        fields.y.sorting,
        fields.y.useAbbreviations,
        sumsByY,
        chartConfig.cubes,
        scalesData,
        getY,
        timeRangeData,
        getYLabel,
        getMinX,
        minLimitValue,
        maxLimitValue,
        paddingData,
        getYAsDate,
        getXErrorRange,
        getX,
        x.customDomain,
    ]);
    const { top, left, bottom } = useChartPadding({
        xLabelPresent: !!xMeasure.label,
        yScale: paddingXScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
        bandDomain: yTimeRangeDomainLabels.every((d) => d === undefined)
            ? yScale.domain()
            : yTimeRangeDomainLabels,
        isFlipped: true,
    });
    const right = 40;
    const leftAxisLabelSize = useAxisLabelSizeVariables({
        label: yAxisLabel,
        width,
    });
    const bottomAxisLabelSize = useAxisLabelSizeVariables({
        label: xAxisLabel,
        width,
    });
    const margins = {
        top: DEFAULT_MARGIN_TOP + top + leftAxisLabelSize.offset,
        right,
        bottom: bottom + 45,
        left,
    };
    const { offset: xValueLabelsOffset, ...showValuesVariables } = useShowBandValueLabelsVariables(x, {
        chartData,
        dimensions,
        measures,
        getValue: getX,
        getErrorRange: getXErrorRange,
        scale: xScale,
    });
    const chartWidth = getChartWidth({ width, left, right });
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    const { chartHeight } = bounds;
    // Here we adjust the height to make sure the bars have a minimum height and are legible
    const barCount = yScale.domain().length;
    const adjustedChartHeight = barCount * MIN_BAR_HEIGHT > chartHeight
        ? barCount * MIN_BAR_HEIGHT
        : chartHeight;
    xScale.range([0, chartWidth - xValueLabelsOffset]);
    yScaleInteraction.range([0, adjustedChartHeight]);
    yScaleTimeRange.range([0, adjustedChartHeight]);
    yScale.range([0, adjustedChartHeight]);
    const isMobile = useIsMobile();
    const formatYAxisTick = useCallback((tick) => {
        return isTemporalDimension(yDimension)
            ? formatYDate(tick)
            : getYLabel(tick);
    }, [yDimension, formatYDate, getYLabel]);
    const getAnnotationInfo = useCallback((observation) => {
        var _a;
        const hasValueLabels = showValuesVariables.showValues;
        const xOffset = hasValueLabels ? xValueLabelsOffset + 8 : 0;
        const x = xScale(Math.max((_a = getX(observation)) !== null && _a !== void 0 ? _a : NaN, 0)) +
            ANNOTATION_SINGLE_SEGMENT_OFFSET +
            xOffset;
        const y = yScale(getY(observation)) + yScale.bandwidth() * 0.5;
        return {
            x,
            y,
            color: DEFAULT_ANNOTATION_CIRCLE_COLOR,
        };
    }, [
        showValuesVariables.showValues,
        xValueLabelsOffset,
        xScale,
        getX,
        yScale,
        getY,
    ]);
    const getTooltipInfo = (datum) => {
        var _a;
        const yAnchor = yScale(getY(datum)) + yScale.bandwidth() * 0.5;
        const xAnchor = isMobile
            ? chartHeight
            : xScale(Math.max((_a = getX(datum)) !== null && _a !== void 0 ? _a : NaN, 0));
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor: yAnchor,
                topAnchor: !fields.segment,
            });
        const yLabel = getYAbbreviationOrLabel(datum);
        const xValueFormatter = (value) => {
            var _a;
            return formatNumberWithUnit(value, (_a = formatters[xMeasure.id]) !== null && _a !== void 0 ? _a : formatNumber, xMeasure.unit);
        };
        const x = getX(datum);
        return {
            xAnchor,
            yAnchor,
            placement,
            value: formatYAxisTick(yLabel),
            datum: {
                label: undefined,
                value: x !== null && isNaN(x) ? "-" : `${xValueFormatter(getX(datum))}`,
                error: getFormattedXUncertainty(datum),
                color: "",
            },
            values: undefined,
        };
    };
    const { segments, colors } = useMemo(() => {
        const segments = [];
        const colors = scaleOrdinal();
        colors.range(getPalette({
            paletteId: fields.color.paletteId,
            colorField: fields.color,
        }));
        return {
            segments,
            colors,
        };
    }, [fields.color]);
    return {
        chartType: "bar",
        bounds: {
            ...bounds,
            chartHeight: adjustedChartHeight,
        },
        chartData,
        allData,
        xScale,
        minY,
        yScaleTimeRange,
        yScaleInteraction,
        yScale,
        getAnnotationInfo,
        getTooltipInfo,
        getColorLabel: getSegmentLabel,
        segments,
        colors,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        formatYAxisTick,
        ...showValuesVariables,
        ...variables,
    };
};
const BarChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useBarsStateVariables(chartProps);
    const data = useBarsStateData(chartProps, variables);
    const state = useBarsState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const BarChart = (props) => {
    return (<InteractionProvider>
      <BarChartProvider {...props}/>
    </InteractionProvider>);
};
