import { getContrastingColor } from "@uiw/react-color";
import { select } from "d3-selection";
import { useCallback } from "react";
import { hasSegmentAnnotation } from "@/charts/shared/annotation-utils";
import { useChartState } from "@/charts/shared/chart-state";
import { setSegmentValueLabelProps, setSegmentWrapperValueLabelProps, } from "@/charts/shared/render-value-labels";
import { maybeTransition, toggleFocusBorder, } from "@/charts/shared/rendering-utils";
import { getChartConfig, useDefinitiveFilters } from "@/config-utils";
import { useConfiguratorState } from "@/configurator/configurator-state";
import { getTextWidth } from "@/utils/get-text-width";
export const useGetRenderStackedBarDatum = () => {
    const { colors, showValuesBySegmentMapping, valueLabelFormatter, xScale, yScale, getY, getRenderingKey, } = useChartState();
    const [state] = useConfiguratorState();
    const chartConfig = getChartConfig(state);
    const definitiveFilters = useDefinitiveFilters();
    const bandwidth = yScale.bandwidth();
    return useCallback((s) => {
        const segment = s.key;
        const color = colors(segment);
        return s.map((d) => {
            const observation = d.data;
            const value = observation[segment];
            const valueLabel = segment && showValuesBySegmentMapping[segment]
                ? valueLabelFormatter(value)
                : undefined;
            const valueLabelColor = valueLabel
                ? getContrastingColor(color)
                : undefined;
            const x = xScale(d[0]);
            const yRaw = getY(observation);
            const y = yScale(yRaw);
            const hasAnnotation = hasSegmentAnnotation(observation, segment, chartConfig, definitiveFilters);
            const valueLabelOffset = hasAnnotation && valueLabel
                ? -(getTextWidth(valueLabel, { fontSize: 12 }) + 2)
                : 0;
            return {
                key: getRenderingKey(observation, segment),
                y,
                x,
                height: bandwidth,
                width: Math.min(0, x - xScale(d[1])) * -1,
                color,
                valueLabel,
                valueLabelColor,
                observation,
                segment,
                valueLabelOffset,
            };
        });
    }, [
        bandwidth,
        colors,
        getRenderingKey,
        getY,
        showValuesBySegmentMapping,
        valueLabelFormatter,
        xScale,
        yScale,
        chartConfig,
        definitiveFilters,
    ]);
};
export const renderBars = (g, data, options) => {
    const { transition, x0 } = options;
    g.selectAll("g.bar")
        .data(data, (d) => d.key)
        .join((enter) => enter
        .append("g")
        .attr("class", "bar")
        .call((g) => g
        .append("rect")
        .attr("data-index", (_, i) => i)
        .attr("y", (d) => d.y)
        .attr("x", x0)
        .attr("width", 0)
        .attr("height", (d) => d.height)
        .attr("fill", (d) => d.color)
        .call((enter) => maybeTransition(enter, {
        transition,
        s: (g) => g.attr("x", (d) => d.x).attr("width", (d) => d.width),
    })))
        .call((g) => g
        .append("foreignObject")
        .attr("x", x0)
        .attr("y", (d) => d.y)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .call((g) => maybeTransition(g, {
        transition,
        s: (g) => g.attr("x", (d) => { var _a; return d.x + ((_a = d.valueLabelOffset) !== null && _a !== void 0 ? _a : 0); }),
    }))
        .append("xhtml:div")
        .call(setSegmentWrapperValueLabelProps)
        .append("xhtml:p")
        .call(setSegmentValueLabelProps)
        .style("color", function (d) {
        var _a;
        return (_a = d.valueLabelColor) !== null && _a !== void 0 ? _a : select(this).style("color");
    })
        .text((d) => { var _a; return (_a = d.valueLabel) !== null && _a !== void 0 ? _a : ""; })), (update) => {
        toggleFocusBorder(update.select("rect"));
        return maybeTransition(update, {
            s: (g) => g
                .call((g) => g
                .select("rect")
                .attr("x", (d) => d.x)
                .attr("y", (d) => d.y)
                .attr("width", (d) => d.width)
                .attr("height", (d) => d.height)
                .attr("fill", (d) => d.color))
                .call((g) => g
                .select("foreignObject")
                .attr("x", (d) => { var _a; return d.x + ((_a = d.valueLabelOffset) !== null && _a !== void 0 ? _a : 0); })
                .attr("y", (d) => d.y)
                .attr("width", (d) => d.width)
                .attr("height", (d) => d.height)
                .select("p")
                .style("color", function (d) {
                var _a;
                return (_a = d.valueLabelColor) !== null && _a !== void 0 ? _a : select(this).style("color");
            })
                .text((d) => { var _a; return (_a = d.valueLabel) !== null && _a !== void 0 ? _a : ""; })),
            transition,
        });
    }, (exit) => maybeTransition(exit, {
        transition,
        s: (g) => g
            .call((g) => g.select("rect").attr("x", x0).attr("width", 0))
            .remove(),
    }));
};
