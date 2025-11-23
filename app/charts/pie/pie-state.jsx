import { ascending, sum } from "d3-array";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { arc, pie } from "d3-shape";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { usePieStateData, usePieStateVariables, } from "@/charts/pie/pie-state-props";
import { useShowPieValueLabelsVariables, } from "@/charts/pie/show-values-utils";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, } from "@/charts/shared/chart-dimensions";
import { ChartContext, } from "@/charts/shared/chart-state";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";
import { getPalette } from "@/palettes";
import { getSortingOrders, makeDimensionValueSorters, } from "@/utils/sorting-values";
const usePieState = (chartProps, variables, data) => {
    var _a;
    const { chartConfig, dimensions, measures } = chartProps;
    const { yMeasure, getY, segmentDimension: _segmentDimension, segmentsByAbbreviationOrLabel, getSegment, getSegmentAbbreviationOrLabel, getSegmentLabel, yAxisLabel, } = variables;
    // Segment dimension is guaranteed to be present, because it is required.
    const segmentDimension = _segmentDimension;
    const { chartData, segmentData, allData } = data;
    const { fields } = chartConfig;
    const { y } = fields;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber();
    const formatters = useChartFormatters(chartProps);
    const segmentsByValue = useMemo(() => {
        return new Map(segmentDimension.values.map((d) => [d.value, d]));
    }, [segmentDimension.values]);
    // Map ordered segments to colors
    const segmentFilter = (_a = chartConfig.cubes.find((d) => d.iri === segmentDimension.cubeIri)) === null || _a === void 0 ? void 0 : _a.filters[segmentDimension.id];
    const { colors, allSegments, segments, ySum } = useMemo(() => {
        const colors = scaleOrdinal();
        const measureBySegment = Object.fromEntries(segmentData.map((d) => [getSegment(d), getY(d)]));
        const allUniqueSegments = Object.entries(measureBySegment)
            .filter((x) => typeof x[1] === "number")
            .map((x) => x[0]);
        const uniqueSegments = Array.from(new Set(chartData.map(getSegment)));
        const sorting = fields.segment.sorting;
        const sorters = makeDimensionValueSorters(segmentDimension, {
            sorting,
            measureBySegment,
            useAbbreviations: fields.segment.useAbbreviations,
            dimensionFilter: segmentFilter,
        });
        const allSegments = orderBy(allUniqueSegments, sorters, getSortingOrders(sorters, sorting));
        const segments = allSegments.filter((d) => uniqueSegments.includes(d));
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
        // Do not let the scale be implicitly extended by children calling it
        // on unknown values
        colors.unknown(() => undefined);
        const ySum = sum(chartData, getY);
        return {
            colors,
            allSegments,
            segments,
            ySum,
        };
    }, [
        fields.color,
        fields.segment,
        getSegment,
        getY,
        segmentData,
        segmentDimension,
        segmentsByAbbreviationOrLabel,
        segmentsByValue,
        segmentFilter,
        chartData,
    ]);
    // Dimensions
    const showValuesVariables = useShowPieValueLabelsVariables(y, {
        dimensions,
        measures,
    });
    const left = 40;
    const right = left;
    const leftAxisLabelSize = useAxisLabelSizeVariables({
        label: yAxisLabel,
        width,
    });
    const baseYMargin = showValuesVariables.showValues ? 90 : 50;
    const margins = {
        top: baseYMargin + leftAxisLabelSize.offset,
        right,
        bottom: baseYMargin,
        left,
    };
    const chartWidth = getChartWidth({ width, left, right });
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    // Pie data
    // Sort the pie according to the segments
    const pieSorter = useMemo(() => {
        const segments = colors.domain();
        const segmentIndex = Object.fromEntries(segments.map((s, i) => [s, i]));
        return (a, b) => {
            var _a, _b;
            // We do not actually use segment sort order here, because the ascending/descending
            // has already been done when segments where sorted
            return ascending((_a = segmentIndex[getSegment(a)]) !== null && _a !== void 0 ? _a : -1, (_b = segmentIndex[getSegment(b)]) !== null && _b !== void 0 ? _b : -1);
        };
    }, [colors, getSegment]);
    const getPieData = pie()
        .value((d) => { var _a; return (_a = getY(d)) !== null && _a !== void 0 ? _a : 0; })
        .sort(pieSorter);
    const valueFormatter = (value) => {
        var _a;
        if (value === null) {
            return "-";
        }
        const formattedValue = formatNumberWithUnit(value, (_a = formatters[yMeasure.id]) !== null && _a !== void 0 ? _a : formatNumber, yMeasure.unit);
        const percentage = value / ySum;
        const rounded = Math.round(percentage * 100);
        return `${rounded}% (${formattedValue})`;
    };
    const maxSide = Math.min(chartWidth, bounds.chartHeight) / 2;
    const innerRadius = 0;
    const outerRadius = maxSide;
    const arcs = getPieData(chartData);
    const arcGenerator = arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    const getAnnotationInfo = useCallback((observation, { segment }) => {
        const arc = arcs.find((d) => d.data === observation);
        if (!arc) {
            return {
                x: 0,
                y: 0,
                color: colors(segment),
            };
        }
        const startAngle = arc.startAngle;
        const endAngle = arc.endAngle;
        const midAngle = (startAngle + endAngle) / 2;
        const x = Math.cos(midAngle - Math.PI / 2) * outerRadius + chartWidth / 2;
        const y = Math.sin(midAngle - Math.PI / 2) * outerRadius +
            bounds.chartHeight / 2 -
            4;
        return {
            x,
            y,
            color: colors(segment),
        };
    }, [arcs, bounds.chartHeight, chartWidth, colors, outerRadius]);
    const getTooltipInfo = (datum) => {
        const xAnchor = chartWidth / 2;
        const yAnchor = -4;
        const xPlacement = "center";
        const yPlacement = "top";
        return {
            xAnchor,
            yAnchor,
            placement: { x: xPlacement, y: yPlacement },
            value: getSegmentAbbreviationOrLabel(datum),
            datum: {
                value: valueFormatter(getY(datum)),
                color: colors(getSegment(datum)),
            },
            values: undefined,
            withTriangle: false,
        };
    };
    /** To correctly animate entering / exiting pie slices during the animation,
     * there is a need to artificially keep all segments in the data, even if they
     * are not present in the current data. This is done by adding a slice with
     * value 0 for each missing segment.
     */
    const chartDataWithMissingSegments = useMemo(() => {
        return chartData.concat(allSegments
            .filter((d) => !segments.includes(d))
            .map((d) => {
            return {
                [segmentDimension.id]: d,
                [yMeasure.id]: 0,
            };
        }));
    }, [chartData, allSegments, segmentDimension, segments, yMeasure.id]);
    return {
        chartType: "pie",
        bounds,
        chartData: chartDataWithMissingSegments,
        allData,
        arcs,
        arcGenerator,
        outerRadius,
        segments,
        colors,
        getColorLabel: getSegmentLabel,
        getAnnotationInfo,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: 0,
        ...showValuesVariables,
        ...variables,
    };
};
const PieChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = usePieStateVariables(chartProps);
    const data = usePieStateData(chartProps, variables);
    const state = usePieState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const PieChart = (props) => {
    return (<InteractionProvider>
      <PieChartProvider {...props}/>
    </InteractionProvider>);
};
