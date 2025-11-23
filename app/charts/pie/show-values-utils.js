import { useMemo } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { maybeTransition, } from "@/charts/shared/rendering-utils";
import { getIsOverlapping, useValueLabelFormatter, } from "@/charts/shared/show-values-utils";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { truthy } from "@/domain/types";
import { getTextWidth } from "@/utils/get-text-width";
export const useShowPieValueLabelsVariables = (y, { dimensions, measures, }) => {
    const { showValues = false } = y;
    const yMeasure = measures.find((d) => d.id === y.componentId);
    if (!yMeasure) {
        throw Error(`No dimension <${y.componentId}> in cube! (useShowTemporalValueLabelsVariables)`);
    }
    const valueLabelFormatter = useValueLabelFormatter({
        measureId: yMeasure.id,
        dimensions,
        measures,
    });
    return {
        showValues,
        valueLabelFormatter,
    };
};
export const useRenderPieValueLabelsData = ({ renderData, outerRadius, }) => {
    const { bounds: { width, height }, showValues, valueLabelFormatter, } = useChartState();
    const { labelFontSize: fontSize } = useChartTheme();
    const valueLabelWidthsByIndex = useMemo(() => {
        return renderData.reduce((acc, d, i) => {
            const formattedValue = valueLabelFormatter(d.value);
            const width = getTextWidth(formattedValue, { fontSize });
            acc[i] = width;
            return acc;
        }, {});
    }, [renderData, valueLabelFormatter, fontSize]);
    const valueLabelsData = useMemo(() => {
        if (!showValues || !width || !height) {
            return [];
        }
        const previousArray = [];
        const connectorOffset = 8;
        return renderData
            .map((d, i) => {
            var _a;
            const labelWidth = (_a = valueLabelWidthsByIndex[i]) !== null && _a !== void 0 ? _a : 0;
            const a = (d.arcDatum.startAngle + d.arcDatum.endAngle - Math.PI) / 2;
            const aSin = Math.sin(a);
            const aCos = Math.cos(a);
            const offset = outerRadius + Math.min(36, Math.max(12 + labelWidth, 24)) * 1.5;
            const x = offset * aCos;
            const y = offset * aSin;
            const valueLabel = valueLabelFormatter(d.value);
            const datum = {
                key: d.key,
                x,
                y,
                valueLabel,
                width: labelWidth,
                connector: {
                    x1: (outerRadius + connectorOffset) * aCos,
                    y1: (outerRadius + connectorOffset) * aSin,
                },
            };
            const isOverlapping = getIsOverlapping({
                previousArray,
                current: datum,
                labelHeight: fontSize,
            }) ||
                x - labelWidth / 2 < -width / 2 ||
                x + labelWidth / 2 > width / 2;
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
        renderData,
        valueLabelWidthsByIndex,
        outerRadius,
        valueLabelFormatter,
        fontSize,
    ]);
    return valueLabelsData;
};
export const renderPieValueLabelConnectors = (g, data, options) => {
    const { transition } = options;
    g.selectAll("line")
        .data(data, (d) => d.key)
        .join((enter) => enter
        .append("line")
        .attr("x1", (d) => d.connector.x1)
        .attr("y1", (d) => d.connector.y1)
        .attr("x2", (d) => d.connector.x1)
        .attr("y2", (d) => d.connector.y1)
        .attr("stroke", "black")
        .style("opacity", 0)
        .call((enter) => maybeTransition(enter, {
        transition,
        s: (g) => g
            .attr("x1", (d) => d.connector.x1)
            .attr("y1", (d) => d.connector.y1)
            .attr("x2", (d) => d.x)
            .attr("y2", (d) => d.y - 4)
            .style("opacity", 1),
    })), (update) => maybeTransition(update, {
        s: (g) => g
            .attr("x1", (d) => d.connector.x1)
            .attr("y1", (d) => d.connector.y1)
            .attr("x2", (d) => d.x)
            .attr("y2", (d) => d.y - 4)
            .style("opacity", 1),
        transition,
    }), (exit) => maybeTransition(exit, {
        transition,
        s: (g) => g.style("opacity", 0).remove(),
    }));
};
