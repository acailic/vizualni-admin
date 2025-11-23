import { extent, group, max, rollup, sum } from "d3-array";
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useBarsGroupedStateData, useBarsGroupedStateVariables, } from "@/charts/bar/bars-grouped-state-props";
import { PADDING_INNER, PADDING_OUTER, PADDING_WITHIN, } from "@/charts/bar/constants";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { ChartContext, } from "@/charts/shared/chart-state";
import { getCenteredTooltipPlacement, MOBILE_TOOLTIP_PLACEMENT, } from "@/charts/shared/interaction/tooltip-box";
import { DEFAULT_MARGIN_TOP } from "@/charts/shared/margins";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { isTemporalDimension } from "@/domain/data";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";
import { getPalette } from "@/palettes";
import { sortByIndex } from "@/utils/array";
import { getSortingOrders, makeDimensionValueSorters, } from "@/utils/sorting-values";
import { useIsMobile } from "@/utils/use-is-mobile";
const useBarsGroupedState = (chartProps, variables, data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { chartConfig } = chartProps;
    const { yDimension, getX, getYAsDate, getYAbbreviationOrLabel, getYLabel, xMeasure, getY, formatYDate, getMinX, getXErrorRange, getFormattedXUncertainty, segmentDimension, segmentsByAbbreviationOrLabel, getSegment, getSegmentAbbreviationOrLabel, getSegmentLabel, xAxisLabel, yAxisLabel, } = variables;
    const { chartData, scalesData, segmentData, timeRangeData, paddingData, allData, } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { x } = fields;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const formatters = useChartFormatters(chartProps);
    const segmentsByValue = useMemo(() => {
        const values = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values) || [];
        return new Map(values.map((d) => [d.value, d]));
    }, [segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values]);
    // segments
    const segmentSortingOrder = (_b = (_a = fields.segment) === null || _a === void 0 ? void 0 : _a.sorting) === null || _b === void 0 ? void 0 : _b.sortingOrder;
    const sumsBySegment = useMemo(() => {
        return Object.fromEntries(rollup(segmentData, (v) => sum(v, (y) => getX(y)), (y) => getSegment(y)));
    }, [segmentData, getX, getSegment]);
    const segmentFilter = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.id)
        ? (_c = chartConfig.cubes.find((d) => d.iri === segmentDimension.cubeIri)) === null || _c === void 0 ? void 0 : _c.filters[segmentDimension.id]
        : undefined;
    const { allSegments, segments } = useMemo(() => {
        var _a, _b;
        const allUniqueSegments = Array.from(new Set(segmentData.map((d) => getSegment(d))));
        const uniqueSegments = Array.from(new Set(scalesData.map((d) => getSegment(d))));
        const sorting = (_a = fields === null || fields === void 0 ? void 0 : fields.segment) === null || _a === void 0 ? void 0 : _a.sorting;
        const sorters = makeDimensionValueSorters(segmentDimension, {
            sorting,
            sumsBySegment,
            useAbbreviations: (_b = fields.segment) === null || _b === void 0 ? void 0 : _b.useAbbreviations,
            dimensionFilter: segmentFilter,
        });
        const allSegments = orderBy(allUniqueSegments, sorters, getSortingOrders(sorters, sorting));
        return {
            allSegments,
            segments: allSegments.filter((d) => uniqueSegments.includes(d)),
        };
    }, [
        scalesData,
        segmentData,
        segmentDimension,
        (_d = fields.segment) === null || _d === void 0 ? void 0 : _d.sorting,
        (_e = fields.segment) === null || _e === void 0 ? void 0 : _e.useAbbreviations,
        sumsBySegment,
        segmentFilter,
        getSegment,
    ]);
    /* Scales */
    const yFilter = (_f = chartConfig.cubes.find((d) => d.iri === yDimension.cubeIri)) === null || _f === void 0 ? void 0 : _f.filters[yDimension.id];
    const sumsByY = useMemo(() => {
        return Object.fromEntries(rollup(chartData, (v) => sum(v, (d) => getX(d)), (y) => getY(y)));
    }, [chartData, getX, getY]);
    const { yTimeRangeDomainLabels, colors, xScale, paddingXScale, yScaleTimeRange, yScale, yScaleIn, yScaleInteraction, } = useMemo(() => {
        var _a, _b, _c, _d;
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
                paletteId: fields.color.paletteId,
                colorField: fields.color,
            }));
        }
        colors.unknown(() => undefined);
        const yValues = [...new Set(scalesData.map(getY))];
        const yTimeRangeValues = [...new Set(timeRangeData.map(getY))];
        const ySorting = (_a = fields.y) === null || _a === void 0 ? void 0 : _a.sorting;
        const ySorters = makeDimensionValueSorters(yDimension, {
            sorting: ySorting,
            useAbbreviations: (_b = fields.y) === null || _b === void 0 ? void 0 : _b.useAbbreviations,
            measureBySegment: sumsByY,
            dimensionFilter: yFilter,
        });
        const yDomain = orderBy(yValues, ySorters, getSortingOrders(ySorters, ySorting));
        const yTimeRangeDomainLabels = yTimeRangeValues.map(getYLabel);
        const yScale = scaleBand()
            .domain(yDomain)
            .paddingInner(PADDING_INNER)
            .paddingOuter(PADDING_OUTER);
        const yScaleInteraction = scaleBand()
            .domain(yDomain)
            .paddingInner(0)
            .paddingOuter(0);
        const yScaleIn = scaleBand().domain(segments).padding(PADDING_WITHIN);
        const yScaleTimeRangeDomain = extent(timeRangeData, (d) => getYAsDate(d));
        const yScaleTimeRange = scaleTime().domain(yScaleTimeRangeDomain);
        // x
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
            const maxValue = Math.max((_c = max(scalesData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getX(d);
            })) !== null && _c !== void 0 ? _c : 0, 0);
            xScale.domain([minValue, maxValue]).nice();
            const minPaddingValue = getMinX(paddingData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getX(d);
            });
            const maxPaddingValue = Math.max((_d = max(paddingData, (d) => {
                var _a;
                return (_a = getXErrorRange === null || getXErrorRange === void 0 ? void 0 : getXErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getX(d);
            })) !== null && _d !== void 0 ? _d : 0, 0);
            paddingXScale.domain([minPaddingValue, maxPaddingValue]).nice();
        }
        return {
            colors,
            xScale,
            paddingXScale,
            yScaleTimeRange,
            yScale,
            yScaleIn,
            yScaleInteraction,
            yTimeRangeDomainLabels,
        };
    }, [
        fields.color,
        fields.segment,
        (_g = fields.y) === null || _g === void 0 ? void 0 : _g.sorting,
        (_h = fields.y) === null || _h === void 0 ? void 0 : _h.useAbbreviations,
        segmentDimension,
        scalesData,
        getY,
        yDimension,
        sumsByY,
        yFilter,
        getYLabel,
        segments,
        timeRangeData,
        paddingData,
        allSegments,
        segmentsByAbbreviationOrLabel,
        segmentsByValue,
        getYAsDate,
        getXErrorRange,
        getX,
        getMinX,
        x.customDomain,
    ]);
    // Group
    const grouped = useMemo(() => {
        const yKeys = yScale.domain();
        const groupedMap = group(chartData, getY);
        const grouped = groupedMap.size < yKeys.length
            ? yKeys.map((d) => {
                if (groupedMap.has(d)) {
                    return [d, groupedMap.get(d)];
                }
                else {
                    return [d, []];
                }
            })
            : [...groupedMap];
        return grouped.map(([key, data]) => {
            return [
                key,
                sortByIndex({
                    data,
                    order: segments,
                    getCategory: getSegment,
                    sortingOrder: segmentSortingOrder,
                }),
            ];
        });
    }, [getSegment, getY, chartData, segmentSortingOrder, segments, yScale]);
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
    const chartWidth = getChartWidth({ width, left, right });
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    const { chartHeight } = bounds;
    // Adjust of scales based on chart dimensions
    yScale.range([0, chartHeight]);
    yScaleInteraction.range([0, chartHeight]);
    yScaleIn.range([0, yScale.bandwidth()]);
    yScaleTimeRange.range([0, chartHeight]);
    xScale.range([0, chartWidth]);
    const isMobile = useIsMobile();
    const formatYAxisTick = useCallback((tick) => {
        return isTemporalDimension(yDimension)
            ? formatYDate(tick)
            : getYLabel(tick);
    }, [yDimension, formatYDate, getYLabel]);
    const getTooltipInfo = (datum) => {
        const bw = yScale.bandwidth();
        const y = getY(datum);
        const tooltipValues = chartData.filter((d) => getY(d) === y);
        const xValues = tooltipValues.map(getX);
        const sortedTooltipValues = sortByIndex({
            data: tooltipValues,
            order: segments,
            getCategory: getSegment,
            // Always ascending to match visual order of colors of the stack
            sortingOrder: "asc",
        });
        const xValueFormatter = (value) => {
            var _a;
            return formatNumberWithUnit(value, (_a = formatters[xMeasure.id]) !== null && _a !== void 0 ? _a : formatNumber, xMeasure.unit);
        };
        const yAnchorRaw = yScale(y) + bw * 0.5;
        const [xMin, xMax] = extent(xValues, (d) => d !== null && d !== void 0 ? d : 0);
        const xAnchor = isMobile ? chartHeight : xScale(xMin + xMax);
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor,
                topAnchor: !fields.segment,
            });
        const yLabel = getYAbbreviationOrLabel(datum);
        return {
            yAnchor: yAnchorRaw + (placement.y === "bottom" ? 0.5 : -0.5) * bw,
            xAnchor,
            placement,
            value: formatYAxisTick(yLabel),
            datum: {
                label: fields.segment && getSegmentAbbreviationOrLabel(datum),
                value: xValueFormatter(getX(datum)),
                error: getFormattedXUncertainty(datum),
                color: colors(getSegment(datum)),
            },
            values: sortedTooltipValues.map((d) => {
                const segment = getSegment(d);
                return {
                    label: getSegmentAbbreviationOrLabel(d),
                    value: xMeasure.unit
                        ? `${formatNumber(getX(d))} ${xMeasure.unit}`
                        : formatNumber(getX(d)),
                    error: getFormattedXUncertainty(d),
                    color: colors(segment),
                };
            }),
        };
    };
    return {
        chartType: "bar",
        bounds,
        chartData,
        allData,
        yScale,
        yScaleInteraction,
        yScaleIn,
        yScaleTimeRange,
        xScale,
        segments,
        colors,
        getColorLabel: getSegmentLabel,
        grouped,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        formatYAxisTick,
        ...variables,
    };
};
const GroupedBarChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useBarsGroupedStateVariables(chartProps);
    const data = useBarsGroupedStateData(chartProps, variables);
    const state = useBarsGroupedState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const GroupedBarChart = (props) => {
    return (<InteractionProvider>
      <GroupedBarChartProvider {...props}/>
    </InteractionProvider>);
};
