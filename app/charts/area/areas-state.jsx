import { extent, group, rollup, sum } from "d3-array";
import { scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { stack, stackOrderAscending, stackOrderDescending, stackOrderReverse, } from "d3-shape";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useAreasStateData, useAreasStateVariables, } from "@/charts/area/areas-state-props";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { getWideData, normalizeData, stackOffsetDivergingPositiveZeros, useGetIdentityY, } from "@/charts/shared/chart-helpers";
import { ChartContext, } from "@/charts/shared/chart-state";
import { getCenteredTooltipPlacement, MOBILE_TOOLTIP_PLACEMENT, } from "@/charts/shared/interaction/tooltip-box";
import { DEFAULT_MARGIN_TOP } from "@/charts/shared/margins";
import { useShowTemporalValueLabelsVariables, } from "@/charts/shared/show-values-utils";
import { getStackedPosition, getStackedTooltipValueFormatter, getStackedYScale, } from "@/charts/shared/stacked-helpers";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { useFormatNumber, useTimeFormatUnit } from "@/formatters";
import { getPalette } from "@/palettes";
import { useChartInteractiveFilters } from "@/stores/interactive-filters";
import { sortByIndex } from "@/utils/array";
import { getSortingOrders, makeDimensionValueSorters, } from "@/utils/sorting-values";
import { useIsMobile } from "@/utils/use-is-mobile";
const useAreasState = (chartProps, variables, data) => {
    var _a, _b, _c;
    const { chartConfig, dimensions, measures } = chartProps;
    const { xDimension, getX, getXAsString, yMeasure, getY, segmentDimension, segmentsByAbbreviationOrLabel, getSegment, getSegmentAbbreviationOrLabel, getSegmentLabel, xAxisLabel, yAxisLabel, minLimitValue, maxLimitValue, } = variables;
    const getIdentityY = useGetIdentityY(yMeasure.id);
    const { chartData, scalesData, segmentData, timeRangeData, paddingData, allData, } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { y } = fields;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const formatters = useChartFormatters(chartProps);
    const timeFormatUnit = useTimeFormatUnit();
    const calculationType = useChartInteractiveFilters((d) => d.calculation.type);
    const segmentsByValue = useMemo(() => {
        var _a;
        const values = (_a = segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values) !== null && _a !== void 0 ? _a : [];
        return new Map(values.map((d) => [d.value, d]));
    }, [segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values]);
    /** Ordered segments */
    const segmentSorting = (_a = fields.segment) === null || _a === void 0 ? void 0 : _a.sorting;
    const segmentSortingType = segmentSorting === null || segmentSorting === void 0 ? void 0 : segmentSorting.sortingType;
    const segmentSortingOrder = segmentSorting === null || segmentSorting === void 0 ? void 0 : segmentSorting.sortingOrder;
    const segmentFilter = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.id)
        ? (_b = chartConfig.cubes.find((d) => d.iri === segmentDimension.cubeIri)) === null || _b === void 0 ? void 0 : _b.filters[segmentDimension.id]
        : undefined;
    const sumsBySegment = useMemo(() => {
        return Object.fromEntries(rollup(segmentData, (v) => sum(v, (x) => getY(x)), (x) => getSegment(x)));
    }, [segmentData, getY, getSegment]);
    const { allSegments, segments } = useMemo(() => {
        var _a;
        const allUniqueSegments = Array.from(new Set(segmentData.map((d) => getSegment(d))));
        const uniqueSegments = Array.from(new Set(scalesData.map((d) => getSegment(d))));
        const sorters = makeDimensionValueSorters(segmentDimension, {
            sorting: segmentSorting,
            sumsBySegment,
            useAbbreviations: (_a = fields.segment) === null || _a === void 0 ? void 0 : _a.useAbbreviations,
            dimensionFilter: segmentFilter,
        });
        const allSegments = orderBy(allUniqueSegments, sorters, getSortingOrders(sorters, segmentSorting));
        return {
            allSegments,
            segments: allSegments.filter((d) => uniqueSegments.includes(d)),
        };
    }, [
        segmentData,
        scalesData,
        sumsBySegment,
        segmentDimension,
        segmentSorting,
        segmentFilter,
        getSegment,
        (_c = fields.segment) === null || _c === void 0 ? void 0 : _c.useAbbreviations,
    ]);
    const xKey = fields.x.componentId;
    const sumsByX = useMemo(() => {
        return Object.fromEntries(rollup(chartData, (v) => sum(v, (x) => getY(x)), (x) => getXAsString(x)));
    }, [chartData, getXAsString, getY]);
    const normalize = calculationType === "percent";
    const chartDataGroupedByX = useMemo(() => {
        if (normalize) {
            return group(normalizeData(chartData, {
                key: yMeasure.id,
                getAxisValue: getY,
                getTotalGroupValue: (d) => {
                    return sumsByX[getXAsString(d)];
                },
            }), getXAsString);
        }
        return group(chartData, getXAsString);
    }, [normalize, chartData, getXAsString, yMeasure.id, getY, sumsByX]);
    const chartWideData = useMemo(() => {
        return getWideData({
            dataGrouped: chartDataGroupedByX,
            key: xKey,
            getAxisValue: getY,
            getSegment,
            allSegments: segments,
            imputationType: fields.y.imputationType,
        });
    }, [
        getSegment,
        getY,
        chartDataGroupedByX,
        segments,
        xKey,
        fields.y.imputationType,
    ]);
    /** Transform data  */
    const series = useMemo(() => {
        const stackOrder = segmentSortingType === "byTotalSize" && segmentSortingOrder === "asc"
            ? stackOrderAscending
            : segmentSortingType === "byTotalSize" && segmentSortingOrder === "desc"
                ? stackOrderDescending
                : stackOrderReverse;
        const stacked = stack()
            .order(stackOrder)
            .offset(stackOffsetDivergingPositiveZeros)
            .keys(segments);
        return stacked(chartWideData);
    }, [chartWideData, segmentSortingOrder, segmentSortingType, segments]);
    /** Scales */
    const { colors, xScale, xScaleTimeRange } = useMemo(() => {
        var _a, _b;
        const xDomain = extent(scalesData, (d) => getX(d));
        const xScale = scaleTime().domain(xDomain);
        const xScaleTimeRangeDomain = extent(timeRangeData, (d) => getX(d));
        const xScaleTimeRange = scaleTime().domain(xScaleTimeRangeDomain);
        const colors = scaleOrdinal();
        if (segmentDimension && ((_a = fields.color) === null || _a === void 0 ? void 0 : _a.type) === "segment") {
            const segmentColor = fields.color;
            const orderedSegmentLabelsAndColors = allSegments.map((segment) => {
                var _a, _b, _c, _d, _e;
                const dvIri = (_d = (_b = (_a = segmentsByAbbreviationOrLabel.get(segment)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : (_c = segmentsByValue.get(segment)) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "";
                return {
                    label: segment,
                    color: (_e = segmentColor.colorMapping[dvIri]) !== null && _e !== void 0 ? _e : schemeCategory10[0],
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
        return {
            colors,
            xScale,
            xScaleTimeRange,
        };
    }, [
        fields.color,
        getX,
        scalesData,
        timeRangeData,
        segmentsByAbbreviationOrLabel,
        segmentsByValue,
        allSegments,
        segmentDimension,
    ]);
    const yScale = useMemo(() => {
        return getStackedYScale(scalesData, {
            normalize,
            getX: getXAsString,
            getY,
            minLimitValue,
            maxLimitValue,
            customDomain: y.customDomain,
        });
    }, [
        scalesData,
        normalize,
        getXAsString,
        getY,
        minLimitValue,
        maxLimitValue,
        y.customDomain,
    ]);
    const paddingYScale = useMemo(() => {
        //  When the user can toggle between absolute and relative values, we use the
        // absolute values to calculate the yScale domain, so that the yScale doesn't
        // change when the user toggles between absolute and relative values.
        if (interactiveFiltersConfig.calculation.active) {
            const scale = getStackedYScale(paddingData, {
                normalize: false,
                getX: getXAsString,
                getY,
                minLimitValue,
                maxLimitValue,
                customDomain: y.customDomain,
            });
            if (scale.domain()[1] < 100 && scale.domain()[0] > -100) {
                return scaleLinear().domain([0, 100]);
            }
            return scale;
        }
        return getStackedYScale(paddingData, {
            normalize,
            getX: getXAsString,
            getY,
            minLimitValue,
            maxLimitValue,
            customDomain: y.customDomain,
        });
    }, [
        interactiveFiltersConfig.calculation.active,
        paddingData,
        normalize,
        getXAsString,
        getY,
        minLimitValue,
        maxLimitValue,
        y.customDomain,
    ]);
    /** Dimensions */
    const { top, left, bottom } = useChartPadding({
        xLabelPresent: !!xAxisLabel,
        yScale: paddingYScale,
        width,
        height,
        interactiveFiltersConfig,
        formatNumber,
        normalize,
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
    const getAnnotationInfo = useCallback((observation, { segment }) => {
        var _a;
        const x = xScale(getX(observation));
        const y = getStackedPosition({
            observation,
            series,
            key: xKey,
            getAxisValue: getXAsString,
            measureScale: yScale,
            fallbackMeasureValue: yScale((_a = getY(observation)) !== null && _a !== void 0 ? _a : 0),
            segment,
        });
        return {
            x,
            y,
            color: segment ? colors(segment) : undefined,
        };
    }, [xScale, getX, series, xKey, getXAsString, yScale, getY, colors]);
    const getTooltipInfo = useCallback((datum) => {
        var _a;
        const x = getXAsString(datum);
        const tooltipValues = (_a = chartDataGroupedByX.get(x)) !== null && _a !== void 0 ? _a : [];
        const yValues = tooltipValues.map(getY);
        const sortedTooltipValues = sortByIndex({
            data: tooltipValues,
            order: segments,
            getCategory: getSegment,
            sortingOrder: "asc",
        });
        const yValueFormatter = getStackedTooltipValueFormatter({
            normalize,
            measureId: yMeasure.id,
            measureUnit: yMeasure.unit,
            formatters,
            formatNumber,
        });
        const xAnchor = xScale(getX(datum));
        const allNaN = yValues.every((d) => Number.isNaN(d));
        const yDesktopAnchor = allNaN
            ? NaN
            : normalize
                ? yScale.range()[0] * 0.5
                : yScale(sum(yValues) * (fields.segment ? 0.5 : 1));
        const yAnchor = isMobile ? chartHeight : yDesktopAnchor;
        const placement = isMobile
            ? MOBILE_TOOLTIP_PLACEMENT
            : getCenteredTooltipPlacement({
                chartWidth,
                xAnchor,
                topAnchor: !fields.segment,
            });
        return {
            xAnchor,
            yAnchor,
            placement,
            value: timeFormatUnit(getX(datum), xDimension.timeUnit),
            datum: {
                label: fields.segment && getSegmentAbbreviationOrLabel(datum),
                value: yValueFormatter(getY(datum), getIdentityY(datum)),
                color: colors(getSegment(datum)),
            },
            values: sortedTooltipValues.map((d) => {
                var _a;
                const segment = getSegment(d);
                const y = getStackedPosition({
                    observation: d,
                    series,
                    key: xKey,
                    getAxisValue: getXAsString,
                    measureScale: yScale,
                    fallbackMeasureValue: yScale((_a = getY(d)) !== null && _a !== void 0 ? _a : 0),
                    segment,
                });
                return {
                    label: getSegmentAbbreviationOrLabel(d),
                    value: yValueFormatter(getY(d), getIdentityY(d)),
                    axis: "y",
                    axisOffset: y,
                    color: colors(segment),
                };
            }),
        };
    }, [
        getXAsString,
        chartDataGroupedByX,
        getY,
        segments,
        getSegment,
        normalize,
        yMeasure.id,
        yMeasure.unit,
        formatters,
        formatNumber,
        xScale,
        getX,
        yScale,
        fields.segment,
        isMobile,
        chartHeight,
        chartWidth,
        timeFormatUnit,
        xDimension.timeUnit,
        getSegmentAbbreviationOrLabel,
        getIdentityY,
        colors,
        series,
        xKey,
    ]);
    return {
        chartType: "area",
        bounds,
        chartData,
        allData,
        xScale,
        xScaleTimeRange,
        yScale,
        segments,
        colors,
        getColorLabel: getSegmentLabel,
        chartWideData,
        series,
        getAnnotationInfo,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        ...showValuesVariables,
        ...variables,
    };
};
const AreaChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useAreasStateVariables(chartProps);
    const data = useAreasStateData(chartProps, variables);
    const state = useAreasState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const AreaChart = (props) => {
    return (<InteractionProvider>
      <AreaChartProvider {...props}/>
    </InteractionProvider>);
};
