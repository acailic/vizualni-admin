import { axisLeft, axisRight } from "d3-axis";
import { useCallback, useEffect, useRef, useState } from "react";
import { AxisHeightTitle } from "@/charts/shared/axis-height-title";
import { useChartState } from "@/charts/shared/chart-state";
import { maybeTransition, renderContainer, } from "@/charts/shared/rendering-utils";
import { getTickNumber } from "@/charts/shared/ticks";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { useFormatNumber } from "@/formatters";
import { useChartInteractiveFilters } from "@/stores/interactive-filters";
import { useTransitionStore } from "@/stores/transition";
export const TICK_PADDING = 6;
export const AxisHeightLinear = () => {
    const { gridColor, labelColor } = useChartTheme();
    const [ref, setRef] = useState(null);
    const { yScale, bounds } = useChartState();
    useRenderAxisHeightLinear(ref, {
        id: "axis-height-linear",
        orientation: "left",
        scale: yScale,
        width: bounds.chartWidth,
        height: bounds.chartHeight,
        margins: bounds.margins,
        lineColor: gridColor,
        textColor: labelColor,
    });
    return (<>
      <AxisHeightTitle />
      <g ref={(newRef) => setRef(newRef)}/>
    </>);
};
export const useRenderAxisHeightLinear = (container, { id, orientation, scale, width, height, margins, lineColor, textColor, }) => {
    const leftAligned = orientation === "left";
    const enableTransition = useTransitionStore((state) => state.enable);
    const transitionDuration = useTransitionStore((state) => state.duration);
    const { labelFontSize, fontFamily } = useChartTheme();
    const formatNumber = useFormatNumber({ decimals: "auto" });
    const calculationType = useChartInteractiveFilters((d) => d.calculation.type);
    const normalized = calculationType === "percent";
    const ticks = getTickNumber(height);
    const tickFormat = useCallback((d) => {
        return normalized ? `${formatNumber(d)}%` : formatNumber(d);
    }, [formatNumber, normalized]);
    useEffect(() => {
        if (!container) {
            return;
        }
        const axis = (leftAligned ? axisLeft : axisRight)(scale)
            .ticks(ticks)
            .tickSizeInner((leftAligned ? -1 : 1) * width)
            .tickFormat(tickFormat)
            .tickPadding(TICK_PADDING);
        const g = renderContainer(container, {
            id,
            transform: `translate(${margins.left}, ${margins.top})`,
            transition: { enable: enableTransition, duration: transitionDuration },
            render: (g) => g.call(axis),
            renderUpdate: (g, opts) => maybeTransition(g, {
                transition: opts.transition,
                s: (g) => g.call(axis),
            }),
        });
        g.select(".domain").remove();
        g.selectAll(".tick line").attr("stroke", lineColor).attr("stroke-width", 1);
        g.selectAll(".tick text")
            .attr("dy", 3)
            .attr("fill", textColor)
            .attr("font-family", fontFamily)
            .style("font-size", labelFontSize)
            .attr("text-anchor", leftAligned ? "end" : "start");
    }, [
        container,
        enableTransition,
        fontFamily,
        id,
        labelFontSize,
        leftAligned,
        lineColor,
        margins.left,
        margins.top,
        scale,
        textColor,
        tickFormat,
        ticks,
        transitionDuration,
        width,
    ]);
};
export const AxisHeightLinearDomain = () => {
    const ref = useRef(null);
    const enableTransition = useTransitionStore((state) => state.enable);
    const transitionDuration = useTransitionStore((state) => state.duration);
    const { xScale, yScale, bounds } = useChartState();
    const { margins } = bounds;
    const { domainColor } = useChartTheme();
    useEffect(() => {
        if (ref.current) {
            const axis = axisLeft(yScale).tickSizeOuter(0);
            const g = renderContainer(ref.current, {
                id: "axis-height-linear-domain",
                transform: `translate(${margins.left} ${margins.top})`,
                transition: { enable: enableTransition, duration: transitionDuration },
                render: (g) => g.call(axis),
                renderUpdate: (g, opts) => maybeTransition(g, {
                    transition: opts.transition,
                    s: (g) => g.call(axis),
                }),
            });
            g.select(".domain")
                .attr("data-name", "height-axis-domain")
                .attr("transform", `translate(${xScale(0)}, 0)`)
                .attr("stroke", domainColor);
            g.selectAll(".tick line").remove();
            g.selectAll(".tick text").remove();
        }
    }, [
        domainColor,
        enableTransition,
        margins.left,
        margins.top,
        transitionDuration,
        xScale,
        yScale,
    ]);
    return <g ref={ref}/>;
};
