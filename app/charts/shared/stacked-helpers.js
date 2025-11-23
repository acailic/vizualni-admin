import { group, sum } from "d3-array";
import { scaleLinear } from "d3-scale";
import { formatNumberWithUnit } from "@/formatters";
const NORMALIZED_VALUE_DOMAIN = [0, 100];
export const getStackedYScale = (data, { normalize, getX, getY, getTime, minLimitValue, maxLimitValue, customDomain, }) => {
    const yScale = scaleLinear();
    if (normalize) {
        // We don't allow overwriting of 100% mode.
        yScale.domain(NORMALIZED_VALUE_DOMAIN);
    }
    else {
        if (customDomain) {
            return yScale.domain(customDomain);
        }
        const grouped = group(data, (d) => getX(d) + (getTime === null || getTime === void 0 ? void 0 : getTime(d)));
        let yMin = 0;
        let yMax = 0;
        for (const [, v] of grouped) {
            const values = v.map(getY).filter((d) => d !== null);
            const newYMin = sum(values.filter((d) => d < 0));
            const newYMax = sum(values.filter((d) => d >= 0));
            if (yMin === undefined || newYMin < yMin) {
                yMin = newYMin;
            }
            if (yMax === undefined || newYMax > yMax) {
                yMax = newYMax;
            }
        }
        yScale
            .domain([
            minLimitValue !== undefined ? Math.min(minLimitValue, yMin) : yMin,
            maxLimitValue !== undefined ? Math.max(maxLimitValue, yMax) : yMax,
        ])
            .nice();
    }
    return yScale;
};
export const getStackedXScale = (data, { normalize, getX, getY, getTime, customDomain, }) => {
    const xScale = scaleLinear();
    if (normalize) {
        // We don't allow overwriting of 100% mode.
        xScale.domain(NORMALIZED_VALUE_DOMAIN);
    }
    else {
        if (customDomain) {
            return xScale.domain(customDomain);
        }
        const grouped = group(data, (d) => getY(d) + (getTime === null || getTime === void 0 ? void 0 : getTime(d)));
        let xMin = 0;
        let xMax = 0;
        for (const [, v] of grouped) {
            const values = v.map(getX).filter((d) => d !== null);
            const newXMin = sum(values.filter((d) => d < 0));
            const newXMax = sum(values.filter((d) => d >= 0));
            if (xMin === undefined || newXMin < xMin) {
                xMin = newXMin;
            }
            if (xMax === undefined || newXMax > xMax) {
                xMax = newXMax;
            }
        }
        xScale.domain([xMin, xMax]).nice();
    }
    return xScale;
};
export const getStackedTooltipValueFormatter = ({ normalize, measureId, measureUnit, formatters, formatNumber, }) => {
    return (d, dIdentity) => {
        var _a;
        if (d === null && dIdentity === null) {
            return "-";
        }
        const format = (_a = formatters[measureId]) !== null && _a !== void 0 ? _a : formatNumber;
        if (normalize) {
            const rounded = Math.round(d);
            const fValue = formatNumberWithUnit(dIdentity, format, measureUnit);
            return `${rounded}% (${fValue})`;
        }
        return formatNumberWithUnit(d, format, measureUnit);
    };
};
export const getStackedPosition = ({ observation, series, key, getAxisValue, measureScale, fallbackMeasureValue, segment, }) => {
    const axisValue = getAxisValue(observation);
    const segmentSeries = series.find((s) => s.key === segment);
    const seriesPoint = segmentSeries === null || segmentSeries === void 0 ? void 0 : segmentSeries.find((s) => s.data[key] === axisValue);
    if (!seriesPoint) {
        return fallbackMeasureValue;
    }
    const [y0, y1] = seriesPoint;
    return measureScale(series.length === 1 ? y1 : (y0 + y1) * 0.5);
};
