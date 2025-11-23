import { extent, group, max } from "d3-array";
import { scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useLinesStateData, useLinesStateVariables, } from "@/charts/line/lines-state-props";
import { DEFAULT_ANNOTATION_CIRCLE_COLOR } from "@/charts/shared/annotation-circle";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { getWideData } from "@/charts/shared/chart-helpers";
import { ChartContext, } from "@/charts/shared/chart-state";
import { getCenteredTooltipPlacement, MOBILE_TOOLTIP_PLACEMENT, } from "@/charts/shared/interaction/tooltip-box";
import { DEFAULT_MARGIN_TOP } from "@/charts/shared/margins";
import { useShowTemporalValueLabelsVariables, } from "@/charts/shared/show-values-utils";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { formatNumberWithUnit, useFormatNumber, useTimeFormatUnit, } from "@/formatters";
import { getPalette } from "@/palettes";
import { sortByIndex } from "@/utils/array";
import { getSortingOrders, makeDimensionValueSorters, } from "@/utils/sorting-values";
import { useIsMobile } from "@/utils/use-is-mobile";
const useLinesState = (chartProps, variables, data) => {
    var _a, _b, _c, _d, _e, _f;
    const { chartConfig, dimensions, measures } = chartProps;
    const { xDimension, getX, getXAsString, yMeasure, getY, getYErrorRange, getFormattedYUncertainty, getMinY, xAxisLabel, segmentDimension, segmentsByAbbreviationOrLabel, getSegment, getSegmentAbbreviationOrLabel, getSegmentLabel, yAxisLabel, minLimitValue, maxLimitValue, } = variables;
    const { chartData, scalesData, segmentData, timeRangeData, paddingData, allData, } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { y } = fields;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const timeFormatUnit = useTimeFormatUnit();
    const formatters = useChartFormatters(chartProps);
    const xKey = xDimension.id;
    const segmentsByValue = useMemo(() => {
        const values = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values) || [];
        return new Map(values.map((d) => [d.value, d]));
    }, [segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values]);
    const preparedDataGroupedBySegment = useMemo(() => group(chartData, getSegment), [chartData, getSegment]);
    const preparedDataGroupedByX = useMemo(() => group(chartData, getXAsString), [chartData, getXAsString]);
    const chartWideData = getWideData({
        dataGrouped: preparedDataGroupedByX,
        key: xKey,
        getAxisValue: getY,
        getSegment,
    });
    // x
    const xDomain = extent(chartData, (d) => getX(d));
    const xScale = scaleTime().domain(xDomain);
    const xScaleTimeRangeDomain = useMemo(() => {
        return extent(timeRangeData, (d) => getX(d));
    }, [timeRangeData, getX]);
    const xScaleTimeRange = scaleTime().domain(xScaleTimeRangeDomain);
    // y
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
        const maxValue = (_a = max(scalesData, (d) => {
            var _a;
            return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getY(d);
        })) !== null && _a !== void 0 ? _a : 0;
        yScale
            .domain([
            minLimitValue !== undefined
                ? Math.min(minLimitValue, minValue)
                : minValue,
            maxLimitValue !== undefined
                ? Math.max(maxLimitValue, maxValue)
                : maxValue,
        ])
            .nice();
        const paddingMinValue = getMinY(paddingData, (d) => {
            var _a;
            return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getY(d);
        });
        const paddingMaxValue = (_b = max(paddingData, (d) => {
            var _a;
            return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getY(d);
        })) !== null && _b !== void 0 ? _b : 0;
        paddingYScale
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
    // segments
    const segmentFilter = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.id)
        ? (_c = chartConfig.cubes.find((d) => d.iri === segmentDimension.cubeIri)) === null || _c === void 0 ? void 0 : _c.filters[segmentDimension.id]
        : undefined;
    const { allSegments, segments } = useMemo(() => {
        var _a, _b, _c;
        const allUniqueSegments = Array.from(new Set(segmentData.map(getSegment)));
        const uniqueSegments = Array.from(new Set(scalesData.map(getSegment)));
        const sorting = (_a = fields === null || fields === void 0 ? void 0 : fields.segment) === null || _a === void 0 ? void 0 : _a.sorting;
        const sorters = makeDimensionValueSorters(segmentDimension, {
            sorting,
            useAbbreviations: (_b = fields.segment) === null || _b === void 0 ? void 0 : _b.useAbbreviations,
            dimensionFilter: segmentFilter,
        });
        const allSegments = orderBy(allUniqueSegments, sorters, getSortingOrders(sorters, (_c = fields.segment) === null || _c === void 0 ? void 0 : _c.sorting));
        return {
            allSegments,
            segments: allSegments.filter((d) => uniqueSegments.includes(d)),
        };
    }, [
        segmentDimension,
        getSegment,
        (_d = fields.segment) === null || _d === void 0 ? void 0 : _d.sorting,
        (_e = fields.segment) === null || _e === void 0 ? void 0 : _e.useAbbreviations,
        segmentData,
        scalesData,
        segmentFilter,
    ]);
    // Map ordered segments to colors
    const colors = scaleOrdinal();
    if (fields.segment && segmentDimension && fields.color) {
        const orderedSegmentLabelsAndColors = allSegments.map((segment) => {
            var _a, _b, _c;
            const dvIri = ((_a = segmentsByAbbreviationOrLabel.get(segment)) === null || _a === void 0 ? void 0 : _a.value) ||
                ((_b = segmentsByValue.get(segment)) === null || _b === void 0 ? void 0 : _b.value) ||
                "";
            return {
                label: segment,
                color: fields.color.type === "segment"
                    ? ((_c = fields.color.colorMapping[dvIri]) !== null && _c !== void 0 ? _c : schemeCategory10[0])
                    : schemeCategory10[0],
            };
        });
        colors.domain(orderedSegmentLabelsAndColors.map((s) => s.label));
        colors.range(orderedSegmentLabelsAndColors.map((s) => s.color));
    }
    else {
        colors.domain(allSegments);
        colors.range(getPalette({
            paletteId: (_f = fields.color) === null || _f === void 0 ? void 0 : _f.paletteId,
            colorField: fields.color,
        }));
    }
    // Dimensions
    const { top, left, bottom } = useChartPadding({
        xLabelPresent: !!xAxisLabel,
        yScale: paddingYScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
    });
    const right = 40;
    const chartWidth = getChartWidth({ width, left, right });
    xScale.range([0, chartWidth]);
    xScaleTimeRange.range([0, chartWidth]);
    const leftAxisLabelSize = useAxisLabelSizeVariables({
        label: yAxisLabel,
        width,
    });
    const bottomAxisLabelSize = useAxisLabelSizeVariables({
        label: xAxisLabel,
        width,
    });
    const { yOffset: yValueLabelsOffset, ...showValuesVariables } = useShowTemporalValueLabelsVariables(y, {
        dimensions,
        measures,
        segment: fields.segment,
    });
    const margins = {
        top: DEFAULT_MARGIN_TOP + top + leftAxisLabelSize.offset + yValueLabelsOffset,
        right,
        bottom,
        left,
    };
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    const { chartHeight } = bounds;
    yScale.range([chartHeight, 0]);
    const isMobile = useIsMobile();
    const getAnnotationInfo = useCallback((observation) => {
        var _a;
        const x = xScale(getX(observation));
        const y = yScale((_a = getY(observation)) !== null && _a !== void 0 ? _a : 0);
        return {
            x,
            y,
            color: DEFAULT_ANNOTATION_CIRCLE_COLOR,
        };
    }, [getX, getY, xScale, yScale]);
    const getTooltipInfo = (datum) => {
        const x = getX(datum);
        const tooltipValues = chartData.filter((d) => getX(d).getTime() === x.getTime());
        const sortedTooltipValues = sortByIndex({
            data: tooltipValues,
            order: segments,
            getCategory: getSegment,
            sortingOrder: "asc",
        });
        const xAnchor = xScale(x);
        const yValues = tooltipValues.map(getY);
        const [yMin, yMax] = extent(yValues, (d) => d !== null && d !== void 0 ? d : 0);
        const yAnchor = isMobile ? chartHeight : yScale((yMin + yMax) * 0.5);
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor,
                topAnchor: !fields.segment,
            });
        const yValueFormatter = (value) => {
            var _a;
            return formatNumberWithUnit(value, (_a = formatters[yMeasure.id]) !== null && _a !== void 0 ? _a : formatNumber, yMeasure.unit);
        };
        return {
            xAnchor,
            yAnchor,
            placement,
            value: timeFormatUnit(getX(datum), xDimension.timeUnit),
            datum: {
                label: fields.segment && getSegmentAbbreviationOrLabel(datum),
                value: yValueFormatter(getY(datum)),
                error: getFormattedYUncertainty(datum),
                color: colors(getSegment(datum)),
            },
            values: sortedTooltipValues.map((d) => {
                var _a;
                const segment = getSegment(d);
                return {
                    hide: getY(d) === null,
                    label: getSegmentAbbreviationOrLabel(d),
                    value: yValueFormatter(getY(d)),
                    axis: "y",
                    axisOffset: yScale((_a = getY(d)) !== null && _a !== void 0 ? _a : 0),
                    symbol: "line",
                    color: colors(segment),
                };
            }),
        };
    };
    return {
        chartType: "line",
        bounds,
        chartData,
        allData,
        xScale,
        xScaleTimeRange,
        yScale,
        segments,
        colors,
        getColorLabel: getSegmentLabel,
        grouped: preparedDataGroupedBySegment,
        chartWideData,
        xKey,
        getAnnotationInfo,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        ...showValuesVariables,
        ...variables,
    };
};
const LineChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useLinesStateVariables(chartProps);
    const data = useLinesStateData(chartProps, variables);
    const state = useLinesState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const LineChart = (props) => {
    return (<InteractionProvider>
      <LineChartProvider {...props}/>
    </InteractionProvider>);
};
