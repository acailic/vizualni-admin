import { extent, groups, max, min, sum } from "d3-array";
import { scaleLinear, scaleOrdinal, scaleTime, } from "d3-scale";
import { useMemo } from "react";
import { SINGLE_LINE_AXIS_LABEL_HEIGHT, useAxisTitleSize, } from "@/charts/combo/shared";
import { TICK_PADDING } from "@/charts/shared/axis-height-linear";
import { useSize } from "@/charts/shared/use-size";
import { useFormatNumber, useTimeFormatUnit } from "@/formatters";
export const useCommonComboState = (options) => {
    const { chartData, timeRangeData, xKey, getXAsDate, getXAsString, yGetters, computeTotal, } = options;
    const { width, height } = useSize();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const timeFormatUnit = useTimeFormatUnit();
    const chartDataByX = useMemo(() => {
        return groups(chartData.sort((a, b) => getXAsDate(a).getTime() - getXAsDate(b).getTime()), getXAsString);
    }, [chartData, getXAsDate, getXAsString]);
    const chartWideData = useMemo(() => {
        const chartWideData = [];
        for (const [date, observations] of chartDataByX) {
            const total = computeTotal
                ? sum(observations, (o) => sum(yGetters, (d) => d.getY(o)))
                : 0;
            const observation = Object.assign({
                [xKey]: date,
                [`${xKey}/__iri__`]: observations[0][`${xKey}/__iri__`],
                total,
            }, ...observations.flatMap((o) => yGetters.map((d) => ({ [d.label]: d.getY(o) }))));
            chartWideData.push(observation);
        }
        return chartWideData;
    }, [computeTotal, chartDataByX, xKey, yGetters]);
    const xScaleTime = useMemo(() => {
        const domain = extent(chartData, getXAsDate);
        return scaleTime().domain(domain);
    }, [chartData, getXAsDate]);
    const xScaleTimeRange = useMemo(() => {
        const domain = extent(timeRangeData, getXAsDate);
        return scaleTime().domain(domain);
    }, [getXAsDate, timeRangeData]);
    const colors = useMemo(() => {
        const domain = yGetters.map((d) => d.id);
        const range = yGetters.map((d) => d.color);
        return scaleOrdinal().domain(domain).range(range);
    }, [yGetters]);
    return {
        width,
        height,
        formatNumber,
        timeFormatUnit,
        chartWideData,
        xScaleTime,
        xScaleTimeRange,
        colors,
    };
};
export const useYScales = (options) => {
    var _a, _b;
    const { scalesData, paddingData, getY, getMinY: _getMinY } = options;
    const getMinY = (data) => {
        var _a;
        return Array.isArray(_getMinY)
            ? ((_a = min(_getMinY.map((gmy) => gmy(data)))) !== null && _a !== void 0 ? _a : 0)
            : _getMinY(data);
    };
    const getMaxY = (o) => {
        return Array.isArray(getY) ? max(getY, (d) => d(o)) : getY(o);
    };
    const minValue = getMinY(scalesData);
    const maxValue = (_a = max(scalesData, getMaxY)) !== null && _a !== void 0 ? _a : 0;
    const yScale = scaleLinear().domain([minValue, maxValue]).nice();
    const paddingMinValue = getMinY(paddingData);
    const paddingMaxValue = (_b = max(paddingData, getMaxY)) !== null && _b !== void 0 ? _b : 0;
    const paddingYScale = scaleLinear()
        .domain([paddingMinValue, paddingMaxValue])
        .nice();
    return { yScale, paddingYScale };
};
export const getMargins = (options) => {
    const { left, top, right, bottom } = options;
    return {
        top: top || 50,
        right: right || 40,
        bottom,
        left,
    };
};
export const useDualAxisMargins = ({ width, left, bottom, maxRightTickWidth, leftAxisTitle, rightAxisTitle, }) => {
    const axisTitleWidth = width * 0.5 - TICK_PADDING;
    const leftAxisTitleSize = useAxisTitleSize(leftAxisTitle, {
        width: axisTitleWidth,
    });
    const rightAxisTitleSize = useAxisTitleSize(rightAxisTitle, {
        width: width * 0.5 - TICK_PADDING,
    });
    const top = Math.max(leftAxisTitleSize.height, rightAxisTitleSize.height) +
        SINGLE_LINE_AXIS_LABEL_HEIGHT;
    const right = Math.max(maxRightTickWidth, 40);
    return getMargins({
        left,
        right,
        bottom,
        top,
    });
};
export const adjustScales = (xScales, yScales, options) => {
    const { chartWidth, chartHeight } = options;
    xScales.forEach((scale) => scale.range([0, chartWidth]));
    yScales.forEach((scale) => scale.range([chartHeight, 0]));
};
