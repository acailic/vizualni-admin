import { useMemo } from "react";
import { Limits, } from "@/charts/shared/limits/rendering-utils";
export const createLimitsComponent = ({ isHorizontal, getChartState, }) => {
    const Component = ({ axisDimension, limits, }) => {
        const { bounds: { margins, chartWidth, chartHeight }, xScale, yScale, getX, getY, } = getChartState();
        const getAxisValue = isHorizontal ? getY : getX;
        const axisDimensionScale = isHorizontal ? yScale : xScale;
        const measureScale = isHorizontal ? xScale : yScale;
        const chartSize = isHorizontal ? chartHeight : chartWidth;
        const renderData = useMemo(() => {
            if (!limits.length) {
                return [];
            }
            const isBandScale = "bandwidth" in axisDimensionScale;
            const limitSize = isBandScale ? axisDimensionScale.bandwidth() : 15;
            return limits.flatMap(({ configLimit, measureLimit, relatedAxisDimensionValueLabel }) => {
                var _a;
                const observationKey = (_a = axisDimension === null || axisDimension === void 0 ? void 0 : axisDimension.id) !== null && _a !== void 0 ? _a : "";
                const observationLabel = relatedAxisDimensionValueLabel !== null && relatedAxisDimensionValueLabel !== void 0 ? relatedAxisDimensionValueLabel : "";
                const { axis1Value, axis2Value, measure1Value, measure2Value } = getLimitValues({
                    measureLimit,
                    getAxisValue,
                    observationKey,
                    observationLabel,
                    axisDimensionId: axisDimension === null || axisDimension === void 0 ? void 0 : axisDimension.id,
                });
                const axis1 = axisDimensionScale(axis1Value);
                const axis2 = axisDimensionScale(axis2Value);
                const measure1 = measureScale(measure1Value);
                const measure2 = measureScale(measure2Value);
                const key = configLimit.related
                    .map((d) => d.dimensionId + d.value)
                    .join();
                const size = axis1 === undefined
                    ? chartSize
                    : measureLimit.type === "time-range"
                        ? 0
                        : limitSize;
                const axisOffset = isBandScale ? size / 2 : 0;
                const hasValidAxis = axis1 !== undefined && axis2 !== undefined;
                const hasNoAxis = relatedAxisDimensionValueLabel === undefined;
                let x1;
                let x2;
                let y1;
                let y2;
                if (isHorizontal) {
                    y1 = axis1 ? axis1 + axisOffset : 0;
                    y2 = axis2 ? axis2 + axisOffset : chartSize;
                    x1 = measure1 !== null && measure1 !== void 0 ? measure1 : 0;
                    x2 = measure2 !== null && measure2 !== void 0 ? measure2 : 0;
                }
                else {
                    x1 = axis1 ? axis1 + axisOffset : 0;
                    x2 = axis2 ? axis2 + axisOffset : chartSize;
                    y1 = measure1 !== null && measure1 !== void 0 ? measure1 : 0;
                    y2 = measure2 !== null && measure2 !== void 0 ? measure2 : 0;
                }
                const datum = {
                    key,
                    x1,
                    x2,
                    y1,
                    y2,
                    size,
                    fill: configLimit.color,
                    lineType: configLimit.lineType,
                    symbolType: configLimit.symbolType,
                };
                return hasValidAxis || hasNoAxis ? [datum] : [];
            });
        }, [
            limits,
            axisDimension === null || axisDimension === void 0 ? void 0 : axisDimension.id,
            getAxisValue,
            axisDimensionScale,
            measureScale,
            chartSize,
        ]);
        return (<Limits renderData={renderData} margins={margins} isHorizontal={isHorizontal}/>);
    };
    Component.displayName = isHorizontal
        ? "HorizontalLimitsInner"
        : "VerticalLimitsInner";
    return Component;
};
const getLimitValues = ({ measureLimit, getAxisValue, observationKey, observationLabel, axisDimensionId, }) => {
    var _a, _b, _c, _d;
    let axis1Value;
    let axis2Value;
    let measure1Value;
    let measure2Value;
    switch (measureLimit.type) {
        case "single": {
            axis1Value = axis2Value = getAxisValue({
                [observationKey]: observationLabel,
            });
            measure1Value = measure2Value = measureLimit.value;
            break;
        }
        case "value-range": {
            axis1Value = axis2Value = getAxisValue({
                [observationKey]: observationLabel,
            });
            measure1Value = measureLimit.min;
            measure2Value = measureLimit.max;
            break;
        }
        case "time-range": {
            const { related } = measureLimit;
            const timeFrom = (_b = (_a = related.find((d) => d.type === "time-from" && d.dimensionId === axisDimensionId)) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "";
            const timeTo = (_d = (_c = related.find((d) => d.type === "time-to" && d.dimensionId === axisDimensionId)) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : "";
            axis1Value = getAxisValue({ [observationKey]: timeFrom });
            axis2Value = getAxisValue({ [observationKey]: timeTo });
            measure1Value = measure2Value = measureLimit.value;
            break;
        }
        default: {
            const _exhaustiveCheck = measureLimit;
            return _exhaustiveCheck;
        }
    }
    return {
        axis1Value,
        axis2Value,
        measure1Value,
        measure2Value,
    };
};
