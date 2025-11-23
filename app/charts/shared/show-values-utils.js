import { useCallback, useMemo } from "react";
import { useChartState, } from "@/charts/shared/chart-state";
import { useChartFormatters } from "@/charts/shared/use-chart-formatters";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { truthy } from "@/domain/types";
import { formatNumberWithUnit, useFormatNumber } from "@/formatters";
import { getTextWidth } from "@/utils/get-text-width";
export const useShowBandValueLabelsVariables = (measureField, { chartData, dimensions, measures, getValue, getErrorRange, scale, bandwidth, }) => {
    const { showValues = false } = measureField;
    const measure = measures.find((d) => d.id === measureField.componentId);
    if (!measure) {
        throw Error(`No dimension <${measureField.componentId}> in cube! (useShowBandValueLabelsVariables)`);
    }
    const disableRotation = !bandwidth;
    const horizontal = disableRotation;
    const { labelFontSize: fontSize } = useChartTheme();
    const renderEveryNthValue = disableRotation || bandwidth > fontSize
        ? 1
        : Math.ceil(fontSize / bandwidth);
    const valueLabelFormatter = useValueLabelFormatter({
        measureId: measure.id,
        dimensions,
        measures,
    });
    const getValueOffset = useCallback((observation) => {
        const value = getValue(observation);
        if (value === null) {
            return 0;
        }
        const errorEnd = getErrorRange === null || getErrorRange === void 0 ? void 0 : getErrorRange(observation)[1];
        if (errorEnd === undefined) {
            return 0;
        }
        if (horizontal) {
            return scale(errorEnd - value);
        }
        return scale(errorEnd) - scale(value);
    }, [getValue, getErrorRange, horizontal, scale]);
    const { offset, rotateValues } = useMemo(() => {
        let offset = 0;
        let rotateValues = false;
        if (showValues) {
            let maxWidth = 0;
            chartData.forEach((d) => {
                const value = getValue(d);
                const formattedValue = valueLabelFormatter(value);
                const width = getTextWidth(formattedValue, { fontSize });
                if (!disableRotation && width - 2 > bandwidth) {
                    rotateValues = true;
                }
                if (width > maxWidth) {
                    maxWidth = width;
                }
            });
            if (disableRotation || rotateValues) {
                offset = maxWidth;
            }
            else {
                offset = fontSize;
            }
        }
        return {
            offset,
            rotateValues,
        };
    }, [
        showValues,
        chartData,
        disableRotation,
        getValue,
        valueLabelFormatter,
        fontSize,
        bandwidth,
    ]);
    return {
        offset,
        getValueOffset,
        showValues,
        rotateValues,
        renderEveryNthValue,
        valueLabelFormatter,
    };
};
export const useShowTemporalValueLabelsVariables = (y, { dimensions, measures, segment, }) => {
    const { showValues: _showValues = false } = y;
    const yMeasure = measures.find((d) => d.id === y.componentId);
    if (!yMeasure) {
        throw Error(`No dimension <${y.componentId}> in cube! (useShowLineValueLabelsVariables)`);
    }
    const { labelFontSize: fontSize } = useChartTheme();
    const valueLabelFormatter = useValueLabelFormatter({
        measureId: yMeasure.id,
        dimensions,
        measures,
    });
    const showValues = _showValues && !segment;
    return {
        yOffset: showValues ? fontSize : 0,
        showValues,
        valueLabelFormatter,
    };
};
export const useRenderTemporalValueLabelsData = () => {
    const { bounds: { width, height, margins: { left, right }, }, showValues, chartData, xScale, getX, getXAsString, yScale, getY, valueLabelFormatter, } = useChartState();
    const { labelFontSize: fontSize } = useChartTheme();
    const valueLabelWidthsByIndex = useMemo(() => {
        return chartData.reduce((acc, d, i) => {
            const formattedValue = valueLabelFormatter(getY(d));
            const width = getTextWidth(formattedValue, { fontSize });
            acc[i] = width;
            return acc;
        }, {});
    }, [chartData, valueLabelFormatter, getY, fontSize]);
    const valueLabelsData = useMemo(() => {
        if (!showValues || !width || !height) {
            return [];
        }
        const previousArray = [];
        return chartData
            .map((d, i) => {
            var _a;
            const labelWidth = (_a = valueLabelWidthsByIndex[i]) !== null && _a !== void 0 ? _a : 0;
            const key = getXAsString(d);
            const valueRaw = getY(d);
            const xScaled = xScale(getX(d));
            const value = valueRaw === null || isNaN(valueRaw) ? 0 : valueRaw;
            const yRender = yScale(Math.max(value, 0));
            const valueLabel = valueLabelFormatter(value);
            const padding = 8;
            const xScaledInBounds = Math.min(Math.max(Math.min(left - labelWidth / 2 + padding, labelWidth / 2), xScaled), width - right - left - labelWidth / 2 + padding);
            const datum = {
                key,
                x: xScaledInBounds,
                y: yRender,
                valueLabel,
                width: labelWidth,
            };
            const isOverlapping = getIsOverlapping({
                previousArray,
                current: datum,
                labelHeight: fontSize,
            });
            if (isOverlapping) {
                return null;
            }
            previousArray.push(datum);
            return datum;
        })
            .filter(truthy);
    }, [
        showValues,
        width,
        height,
        chartData,
        valueLabelWidthsByIndex,
        getXAsString,
        getY,
        xScale,
        getX,
        yScale,
        valueLabelFormatter,
        left,
        right,
        fontSize,
    ]);
    return valueLabelsData;
};
export const getIsOverlapping = ({ previousArray, current, labelHeight, horizontalOffset = 8, }) => {
    return previousArray.some((previous) => {
        return (Math.abs(current.x - previous.x) - horizontalOffset <
            previous.width / 2 + current.width / 2 &&
            Math.abs(current.y - previous.y) < labelHeight);
    });
};
export const useValueLabelFormatter = ({ measureId, dimensions, measures, normalize, }) => {
    var _a;
    const formatPercent = useFormatNumber({ decimals: 0 });
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const formatters = useChartFormatters({ dimensions, measures });
    const valueFormatter = normalize
        ? formatPercent
        : ((_a = formatters[measureId]) !== null && _a !== void 0 ? _a : formatNumber);
    return useCallback((value) => {
        return formatNumberWithUnit(value, valueFormatter);
    }, [valueFormatter]);
};
