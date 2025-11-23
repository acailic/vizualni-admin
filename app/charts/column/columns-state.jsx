import { extent, max, rollup, sum } from "d3-array";
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useColumnsStateData, useColumnsStateVariables, } from "@/charts/column/columns-state-props";
import { PADDING_INNER, PADDING_OUTER } from "@/charts/column/constants";
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
const useColumnsState = (chartProps, variables, data) => {
    const { chartConfig, dimensions, measures } = chartProps;
    const { xDimension, getX, getXAsDate, getXAbbreviationOrLabel, getXLabel, formatXDate, yMeasure, getY, getMinY, getYErrorRange, getFormattedYUncertainty, getSegmentLabel, xAxisLabel, yAxisLabel, minLimitValue, maxLimitValue, } = variables;
    const { chartData, scalesData, timeRangeData, paddingData, allData } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { y } = fields;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const formatters = useChartFormatters(chartProps);
    const sumsByX = useMemo(() => {
        return Object.fromEntries(rollup(chartData, (v) => sum(v, (x) => getY(x)), (x) => getX(x)));
    }, [chartData, getX, getY]);
    const { segments, xScale, colors, yScale, paddingYScale, xScaleTimeRange, xScaleInteraction, xTimeRangeDomainLabels, } = useMemo(() => {
        var _a, _b, _c;
        const segments = [];
        const colors = scaleOrdinal();
        if (fields.color.type === "single") {
            colors.range(getPalette({
                paletteId: fields.color.paletteId,
                colorField: fields.color,
            }));
        }
        const sorters = makeDimensionValueSorters(xDimension, {
            sorting: fields.x.sorting,
            measureBySegment: sumsByX,
            useAbbreviations: fields.x.useAbbreviations,
            dimensionFilter: (xDimension === null || xDimension === void 0 ? void 0 : xDimension.id)
                ? (_a = chartConfig.cubes.find((d) => d.iri === xDimension.cubeIri)) === null || _a === void 0 ? void 0 : _a.filters[xDimension.id]
                : undefined,
        });
        const sortingOrders = getSortingOrders(sorters, fields.x.sorting);
        const bandDomain = orderBy([...new Set(scalesData.map(getX))], sorters, sortingOrders);
        const xTimeRangeValues = [...new Set(timeRangeData.map(getX))];
        const xTimeRangeDomainLabels = xTimeRangeValues.map(getXLabel);
        const xScale = scaleBand()
            .domain(bandDomain)
            .paddingInner(PADDING_INNER)
            .paddingOuter(PADDING_OUTER);
        const xScaleInteraction = scaleBand()
            .domain(bandDomain)
            .paddingInner(0)
            .paddingOuter(0);
        const xScaleTimeRangeDomain = extent(timeRangeData, (d) => getXAsDate(d));
        const xScaleTimeRange = scaleTime().domain(xScaleTimeRangeDomain);
        const yScale = scaleLinear();
        const paddingYScale = scaleLinear();
        if (y.customDomain) {
            yScale.domain(y.customDomain);
            paddingYScale.domain(y.customDomain);
        }
        else {
            const minValue = getMinY(scalesData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getY(d);
            });
            const maxValue = Math.max((_b = max(scalesData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getY(d);
            })) !== null && _b !== void 0 ? _b : 0, 0);
            yScale
                .domain([
                minLimitValue !== undefined
                    ? Math.min(minValue, minLimitValue)
                    : minValue,
                maxLimitValue !== undefined
                    ? Math.max(maxValue, maxLimitValue)
                    : maxValue,
            ])
                .nice();
            const paddingMinValue = getMinY(paddingData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getY(d);
            });
            const paddingMaxValue = Math.max((_c = max(paddingData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getY(d);
            })) !== null && _c !== void 0 ? _c : 0, 0);
            paddingYScale
                .domain([
                minLimitValue !== undefined
                    ? Math.min(paddingMinValue, minLimitValue)
                    : paddingMinValue,
                maxLimitValue !== undefined
                    ? Math.max(paddingMaxValue, maxLimitValue)
                    : paddingMaxValue,
            ])
                .nice();
        }
        return {
            segments,
            colors,
            xScale,
            yScale,
            paddingYScale,
            xScaleTimeRange,
            xScaleInteraction,
            xTimeRangeDomainLabels,
        };
    }, [
        fields.color,
        fields.x.sorting,
        fields.x.useAbbreviations,
        xDimension,
        sumsByX,
        chartConfig.cubes,
        scalesData,
        getX,
        timeRangeData,
        getXLabel,
        getMinY,
        minLimitValue,
        maxLimitValue,
        paddingData,
        getXAsDate,
        getYErrorRange,
        getY,
        y.customDomain,
    ]);
    const { top, left, bottom } = useChartPadding({
        xLabelPresent: !!xAxisLabel,
        yScale: paddingYScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
        bandDomain: xTimeRangeDomainLabels.every((d) => d === undefined)
            ? xScale.domain()
            : xTimeRangeDomainLabels,
    });
    const right = 40;
    const chartWidth = getChartWidth({ width, left, right });
    xScale.range([0, chartWidth]);
    xScaleInteraction.range([0, chartWidth]);
    xScaleTimeRange.range([0, chartWidth]);
    const leftAxisLabelSize = useAxisLabelSizeVariables({
        label: yAxisLabel,
        width,
    });
    const bottomAxisLabelSize = useAxisLabelSizeVariables({
        label: xAxisLabel,
        width,
    });
    const { offset: yValueLabelsOffset, ...showValuesVariables } = useShowBandValueLabelsVariables(y, {
        chartData,
        dimensions,
        measures,
        getValue: getY,
        getErrorRange: getYErrorRange,
        scale: yScale,
        bandwidth: xScale.bandwidth(),
    });
    const margins = {
        top: DEFAULT_MARGIN_TOP + top + leftAxisLabelSize.offset + yValueLabelsOffset,
        right,
        bottom,
        left,
    };
    const bounds = useChartBounds({ width, height, chartWidth, margins });
    const { chartHeight } = bounds;
    yScale.range([chartHeight, 0]);
    const isMobile = useIsMobile();
    const formatXAxisTick = useCallback((tick) => {
        return isTemporalDimension(xDimension)
            ? formatXDate(tick)
            : getXLabel(tick);
    }, [xDimension, formatXDate, getXLabel]);
    const getAnnotationInfo = useCallback((observation) => {
        var _a;
        const x = xScale(getX(observation)) + xScale.bandwidth() * 0.5;
        const hasValueLabels = showValuesVariables.showValues;
        const yOffset = hasValueLabels ? yValueLabelsOffset + 8 : 0;
        const y = yScale(Math.max((_a = getY(observation)) !== null && _a !== void 0 ? _a : NaN, 0)) -
            ANNOTATION_SINGLE_SEGMENT_OFFSET -
            yOffset;
        return {
            x,
            y,
            color: DEFAULT_ANNOTATION_CIRCLE_COLOR,
        };
    }, [
        xScale,
        getX,
        showValuesVariables.showValues,
        yValueLabelsOffset,
        yScale,
        getY,
    ]);
    const getTooltipInfo = (datum) => {
        var _a;
        const xAnchor = xScale(getX(datum)) + xScale.bandwidth() * 0.5;
        const yAnchor = isMobile
            ? chartHeight
            : yScale(Math.max((_a = getY(datum)) !== null && _a !== void 0 ? _a : NaN, 0));
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor,
                topAnchor: !fields.segment,
            });
        const xLabel = getXAbbreviationOrLabel(datum);
        const y = getY(datum);
        const yValueUnitFormatter = (value) => {
            var _a;
            return formatNumberWithUnit(value, (_a = formatters[yMeasure.id]) !== null && _a !== void 0 ? _a : formatNumber, yMeasure.unit);
        };
        return {
            xAnchor,
            yAnchor,
            placement,
            value: formatXAxisTick(xLabel),
            datum: {
                label: undefined,
                value: y !== null && isNaN(y) ? "-" : `${yValueUnitFormatter(getY(datum))}`,
                error: getFormattedYUncertainty(datum),
                color: "",
            },
            values: undefined,
        };
    };
    return {
        colors,
        getColorLabel: getSegmentLabel,
        chartType: "column",
        bounds,
        chartData,
        allData,
        xScale,
        xScaleTimeRange,
        xScaleInteraction,
        yScale,
        segments,
        getAnnotationInfo,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        formatXAxisTick,
        ...showValuesVariables,
        ...variables,
    };
};
const ColumnChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useColumnsStateVariables(chartProps);
    const data = useColumnsStateData(chartProps, variables);
    const state = useColumnsState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const ColumnChart = (props) => {
    return (<InteractionProvider>
      <ColumnChartProvider {...props}/>
    </InteractionProvider>);
};
