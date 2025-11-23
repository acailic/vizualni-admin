import { extent, group, max, rollup, sum } from "d3-array";
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useColumnsGroupedStateData, useColumnsGroupedStateVariables, } from "@/charts/column/columns-grouped-state-props";
import { PADDING_INNER, PADDING_OUTER, PADDING_WITHIN, } from "@/charts/column/constants";
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
const useColumnsGroupedState = (chartProps, variables, data) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { chartConfig } = chartProps;
    const { xDimension, getX, getXAsDate, getXAbbreviationOrLabel, getXLabel, formatXDate, yMeasure, getY, getMinY, getYErrorRange, getFormattedYUncertainty, segmentDimension, segmentsByAbbreviationOrLabel, getSegment, getSegmentAbbreviationOrLabel, getSegmentLabel, xAxisLabel, yAxisLabel, } = variables;
    const { chartData, scalesData, segmentData, timeRangeData, paddingData, allData, } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { y } = fields;
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
        return Object.fromEntries(rollup(segmentData, (v) => sum(v, (x) => getY(x)), (x) => getSegment(x)));
    }, [segmentData, getY, getSegment]);
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
    const xFilter = (_f = chartConfig.cubes.find((d) => d.iri === xDimension.cubeIri)) === null || _f === void 0 ? void 0 : _f.filters[xDimension.id];
    const sumsByX = useMemo(() => {
        return Object.fromEntries(rollup(chartData, (v) => sum(v, (d) => getY(d)), (x) => getX(x)));
    }, [chartData, getX, getY]);
    const { xTimeRangeDomainLabels, colors, yScale, paddingYScale, xScaleTimeRange, xScale, xScaleIn, xScaleInteraction, } = useMemo(() => {
        var _a, _b, _c, _d, _e, _f;
        const colors = scaleOrdinal();
        if (fields.segment &&
            segmentDimension &&
            ((_a = fields.color) === null || _a === void 0 ? void 0 : _a.type) === "segment") {
            const segmentColor = fields.color;
            const orderedSegmentLabelsAndColors = allSegments.map((segment) => {
                var _a, _b, _c;
                const dvIri = ((_a = segmentsByAbbreviationOrLabel.get(segment)) === null || _a === void 0 ? void 0 : _a.value) ||
                    ((_b = segmentsByValue.get(segment)) === null || _b === void 0 ? void 0 : _b.value) ||
                    "";
                return {
                    label: segment,
                    color: (_c = segmentColor.colorMapping[dvIri]) !== null && _c !== void 0 ? _c : schemeCategory10[0],
                };
            });
            colors.domain(orderedSegmentLabelsAndColors.map((s) => s.label));
            colors.range(orderedSegmentLabelsAndColors.map((s) => s.color));
        }
        else {
            colors.domain(allSegments);
            colors.range(getPalette({
                paletteId: (_b = fields.color) === null || _b === void 0 ? void 0 : _b.paletteId,
                colorField: fields.color,
            }));
        }
        colors.unknown(() => undefined);
        const xValues = [...new Set(scalesData.map(getX))];
        const xTimeRangeValues = [...new Set(timeRangeData.map(getX))];
        const xSorting = (_c = fields.x) === null || _c === void 0 ? void 0 : _c.sorting;
        const xSorters = makeDimensionValueSorters(xDimension, {
            sorting: xSorting,
            useAbbreviations: (_d = fields.x) === null || _d === void 0 ? void 0 : _d.useAbbreviations,
            measureBySegment: sumsByX,
            dimensionFilter: xFilter,
        });
        const xDomain = orderBy(xValues, xSorters, getSortingOrders(xSorters, xSorting));
        const xTimeRangeDomainLabels = xTimeRangeValues.map(getXLabel);
        const xScale = scaleBand()
            .domain(xDomain)
            .paddingInner(PADDING_INNER)
            .paddingOuter(PADDING_OUTER);
        const xScaleInteraction = scaleBand()
            .domain(xDomain)
            .paddingInner(0)
            .paddingOuter(0);
        const xScaleIn = scaleBand().domain(segments).padding(PADDING_WITHIN);
        const xScaleTimeRangeDomain = extent(timeRangeData, (d) => getXAsDate(d));
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
            const maxValue = Math.max((_e = max(scalesData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getY(d);
            })) !== null && _e !== void 0 ? _e : 0, 0);
            yScale.domain([minValue, maxValue]).nice();
            const minPaddingValue = getMinY(paddingData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[0]) !== null && _a !== void 0 ? _a : getY(d);
            });
            const maxPaddingValue = Math.max((_f = max(paddingData, (d) => {
                var _a;
                return (_a = getYErrorRange === null || getYErrorRange === void 0 ? void 0 : getYErrorRange(d)[1]) !== null && _a !== void 0 ? _a : getY(d);
            })) !== null && _f !== void 0 ? _f : 0, 0);
            paddingYScale.domain([minPaddingValue, maxPaddingValue]).nice();
        }
        return {
            colors,
            yScale,
            paddingYScale,
            xScaleTimeRange,
            xScale,
            xScaleIn,
            xScaleInteraction,
            xTimeRangeDomainLabels,
        };
    }, [
        fields.segment,
        fields.color,
        (_g = fields.x) === null || _g === void 0 ? void 0 : _g.sorting,
        (_h = fields.x) === null || _h === void 0 ? void 0 : _h.useAbbreviations,
        segmentDimension,
        scalesData,
        getX,
        xDimension,
        sumsByX,
        xFilter,
        getXLabel,
        segments,
        timeRangeData,
        paddingData,
        allSegments,
        segmentsByAbbreviationOrLabel,
        segmentsByValue,
        getXAsDate,
        getYErrorRange,
        getY,
        getMinY,
        y.customDomain,
    ]);
    // Group
    const grouped = useMemo(() => {
        const xKeys = xScale.domain();
        const groupedMap = group(chartData, getX);
        const grouped = groupedMap.size < xKeys.length
            ? xKeys.map((d) => {
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
    }, [getSegment, getX, chartData, segmentSortingOrder, segments, xScale]);
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
        bottom,
        left,
    };
    const chartWidth = getChartWidth({ width, left, right });
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    const { chartHeight } = bounds;
    // Adjust scales based on chart dimensions
    xScale.range([0, chartWidth]);
    xScaleInteraction.range([0, chartWidth]);
    xScaleIn.range([0, xScale.bandwidth()]);
    xScaleTimeRange.range([0, chartWidth]);
    yScale.range([chartHeight, 0]);
    const isMobile = useIsMobile();
    const formatXAxisTick = useCallback((tick) => {
        return isTemporalDimension(xDimension)
            ? formatXDate(tick)
            : getXLabel(tick);
    }, [xDimension, formatXDate, getXLabel]);
    const getTooltipInfo = (datum) => {
        const bw = xScale.bandwidth();
        const x = getX(datum);
        const tooltipValues = chartData.filter((d) => getX(d) === x);
        const yValues = tooltipValues.map(getY);
        const sortedTooltipValues = sortByIndex({
            data: tooltipValues,
            order: segments,
            getCategory: getSegment,
            // Always ascending to match visual order of colors of the stack
            sortingOrder: "asc",
        });
        const yValueFormatter = (value) => {
            var _a;
            return formatNumberWithUnit(value, (_a = formatters[yMeasure.id]) !== null && _a !== void 0 ? _a : formatNumber, yMeasure.unit);
        };
        const xAnchorRaw = xScale(x) + bw * 0.5;
        const [yMin, yMax] = extent(yValues, (d) => d !== null && d !== void 0 ? d : 0);
        const yAnchor = isMobile ? chartHeight : yScale((yMin + yMax) * 0.5);
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor: xAnchorRaw,
                topAnchor: !fields.segment,
            });
        const xLabel = getXAbbreviationOrLabel(datum);
        return {
            xAnchor: xAnchorRaw + (placement.x === "right" ? 0.5 : -0.5) * bw,
            yAnchor,
            placement,
            value: formatXAxisTick(xLabel),
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
                    label: getSegmentAbbreviationOrLabel(d),
                    value: yMeasure.unit
                        ? `${formatNumber(getY(d))} ${yMeasure.unit}`
                        : formatNumber(getY(d)),
                    axis: "y",
                    axisOffset: yScale((_a = getY(d)) !== null && _a !== void 0 ? _a : 0),
                    error: getFormattedYUncertainty(d),
                    color: colors(segment),
                };
            }),
        };
    };
    return {
        chartType: "column",
        bounds,
        chartData,
        allData,
        xScale,
        xScaleInteraction,
        xScaleIn,
        xScaleTimeRange,
        yScale,
        segments,
        colors,
        getColorLabel: getSegmentLabel,
        grouped,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        formatXAxisTick,
        ...variables,
    };
};
const GroupedColumnChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useColumnsGroupedStateVariables(chartProps);
    const data = useColumnsGroupedStateData(chartProps, variables);
    const state = useColumnsGroupedState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const GroupedColumnChart = (props) => {
    return (<InteractionProvider>
      <GroupedColumnChartProvider {...props}/>
    </InteractionProvider>);
};
