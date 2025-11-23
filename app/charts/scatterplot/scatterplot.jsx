import { useEffect, useMemo, useRef } from "react";
import { renderCircles, } from "@/charts/scatterplot/rendering-utils";
import { useChartState } from "@/charts/shared/chart-state";
import { renderContainer } from "@/charts/shared/rendering-utils";
import { useTransitionStore } from "@/stores/transition";
export const Scatterplot = () => {
    const { chartData, bounds, getX, xScale, getY, yScale, getSegment, colors, getRenderingKey, } = useChartState();
    const { margins } = bounds;
    const ref = useRef(null);
    const enableTransition = useTransitionStore((state) => state.enable);
    const transitionDuration = useTransitionStore((state) => state.duration);
    const renderData = useMemo(() => {
        return chartData.map((d) => {
            var _a, _b;
            const segment = getSegment(d);
            return {
                key: getRenderingKey(d),
                cx: xScale((_a = getX(d)) !== null && _a !== void 0 ? _a : NaN),
                cy: yScale((_b = getY(d)) !== null && _b !== void 0 ? _b : NaN),
                color: colors(segment),
            };
        });
    }, [
        chartData,
        getSegment,
        getRenderingKey,
        xScale,
        getX,
        yScale,
        getY,
        colors,
    ]);
    useEffect(() => {
        if (ref.current && renderData) {
            renderContainer(ref.current, {
                id: "scatterplot",
                transform: `translate(${margins.left} ${margins.top})`,
                transition: { enable: enableTransition, duration: transitionDuration },
                render: (g, opts) => renderCircles(g, renderData, opts),
            });
        }
    }, [
        enableTransition,
        margins.left,
        margins.top,
        renderData,
        transitionDuration,
    ]);
    return <g ref={ref}/>;
};
