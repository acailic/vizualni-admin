import { max } from "d3-array";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import orderBy from "lodash/orderBy";
import { useCallback, useMemo } from "react";
import { useScatterplotStateData, useScatterplotStateVariables, } from "@/charts/scatterplot//scatterplot-state-props";
import { getChartWidth, useAxisLabelSizeVariables, useChartBounds, useChartPadding, } from "@/charts/shared/chart-dimensions";
import { ChartContext, } from "@/charts/shared/chart-state";
import { TooltipScatterplot } from "@/charts/shared/interaction/tooltip-content";
import { DEFAULT_MARGIN_TOP } from "@/charts/shared/margins";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { useFormatNumber } from "@/formatters";
import { getPalette } from "@/palettes";
import { getSortingOrders, makeDimensionValueSorters, } from "@/utils/sorting-values";
import { useIsMobile } from "@/utils/use-is-mobile";
const useScatterplotState = (chartProps, variables, data) => {
    var _a, _b, _c, _d, _e;
    const { chartConfig } = chartProps;
    const { getX, getMinX, xAxisLabel, getY, getMinY, yAxisLabel, segmentDimension, segmentsByAbbreviationOrLabel, getSegment, getSegmentAbbreviationOrLabel, getSegmentLabel, } = variables;
    const { chartData, scalesData, segmentData, paddingData, allData } = data;
    const { fields, interactiveFiltersConfig } = chartConfig;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const segmentsByValue = useMemo(() => {
        const values = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values) || [];
        return new Map(values.map((d) => [d.value, d]));
    }, [segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values]);
    const xMinValue = getMinX(scalesData, getX);
    const xMaxValue = (_a = max(scalesData, (d) => getX(d))) !== null && _a !== void 0 ? _a : 0;
    const xDomain = [xMinValue, xMaxValue];
    const xScale = scaleLinear().domain(xDomain).nice();
    const yMinValue = getMinY(scalesData, getY);
    const yMaxValue = (_b = max(scalesData, getY)) !== null && _b !== void 0 ? _b : 0;
    const yDomain = [yMinValue, yMaxValue];
    const yScale = scaleLinear().domain(yDomain).nice();
    const paddingYMinValue = getMinY(paddingData, getY);
    const paddingYMaxValue = (_c = max(paddingData, getY)) !== null && _c !== void 0 ? _c : 0;
    const paddingYScale = scaleLinear()
        .domain([paddingYMinValue, paddingYMaxValue])
        .nice();
    const segmentFilter = (segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.id)
        ? (_d = chartConfig.cubes.find((d) => d.iri === segmentDimension.cubeIri)) === null || _d === void 0 ? void 0 : _d.filters[segmentDimension.id]
        : undefined;
    // TODO: Verify is segments creation logic is correct
    // (it's not consistent with other charts).
    const allSegments = useMemo(() => {
        var _a;
        const allUniqueSegments = Array.from(new Set(segmentData.map(getSegment)));
        const sorting = {
            sortingType: "byAuto",
            sortingOrder: "asc",
        };
        const sorters = makeDimensionValueSorters(segmentDimension, {
            sorting,
            useAbbreviations: (_a = fields.segment) === null || _a === void 0 ? void 0 : _a.useAbbreviations,
            dimensionFilter: segmentFilter,
        });
        return orderBy(allUniqueSegments, sorters, getSortingOrders(sorters, sorting));
    }, [
        (_e = fields.segment) === null || _e === void 0 ? void 0 : _e.useAbbreviations,
        getSegment,
        segmentData,
        segmentDimension,
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
            paletteId: fields.color.paletteId,
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
        bottom: bottom + bottomAxisLabelSize.offset,
        left,
    };
    const chartWidth = getChartWidth({ width, left, right });
    const bounds = useChartBounds({ width, chartWidth, height, margins });
    const { chartHeight } = bounds;
    xScale.range([0, chartWidth]);
    yScale.range([chartHeight, 0]);
    const isMobile = useIsMobile();
    const getAnnotationInfo = useCallback((observation, { segment }) => {
        var _a, _b;
        const x = xScale((_a = getX(observation)) !== null && _a !== void 0 ? _a : 0);
        const y = yScale((_b = getY(observation)) !== null && _b !== void 0 ? _b : 0);
        return {
            x,
            y,
            color: colors(segment),
        };
    }, [xScale, getX, yScale, getY, colors]);
    const getTooltipInfo = (datum) => {
        var _a, _b;
        const xRef = xScale((_a = getX(datum)) !== null && _a !== void 0 ? _a : NaN);
        const yRef = yScale((_b = getY(datum)) !== null && _b !== void 0 ? _b : NaN);
        const xAnchor = xRef;
        const yAnchor = isMobile ? 0 : yRef;
        const xPlacement = xAnchor < chartWidth * 0.33
            ? "right"
            : xAnchor > chartWidth * 0.66
                ? "left"
                : "center";
        const yPlacement = yAnchor > chartHeight * 0.33
            ? "top"
            : yAnchor < chartHeight * 0.66
                ? "bottom"
                : "middle";
        const placement = isMobile
            ? { x: "center", y: "top" }
            : { x: xPlacement, y: yPlacement };
        return {
            xAnchor,
            yAnchor,
            placement,
            value: formatNumber(getX(datum)),
            tooltipContent: (<TooltipScatterplot firstLine={fields.segment && getSegmentAbbreviationOrLabel(datum)} secondLine={`${xAxisLabel}: ${formatNumber(getX(datum))}`} thirdLine={`${yAxisLabel}: ${formatNumber(getY(datum))}`}/>),
            datum: {
                label: fields.segment && getSegmentAbbreviationOrLabel(datum),
                value: formatNumber(getY(datum)),
                color: colors(getSegment(datum)),
            },
            values: undefined,
        };
    };
    return {
        chartType: "scatterplot",
        bounds,
        chartData,
        allData,
        xScale,
        yScale,
        segments: allSegments,
        colors,
        getColorLabel: getSegmentLabel,
        getAnnotationInfo,
        getTooltipInfo,
        leftAxisLabelSize,
        leftAxisLabelOffsetTop: top,
        bottomAxisLabelSize,
        ...variables,
    };
};
const ScatterplotChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useScatterplotStateVariables(chartProps);
    const data = useScatterplotStateData(chartProps, variables);
    const state = useScatterplotState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const ScatterplotChart = (props) => {
    return (<InteractionProvider>
      <ScatterplotChartProvider {...props}/>
    </InteractionProvider>);
};
