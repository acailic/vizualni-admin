import { useEffect, useMemo, useRef } from "react";
import { renderColumns, } from "@/charts/column/rendering-utils";
import { useColumnValueLabelsData } from "@/charts/column/show-values-utils";
import { useGetAnnotationRenderState } from "@/charts/shared/annotation-utils";
import { useChartState } from "@/charts/shared/chart-state";
import { renderTotalValueLabels } from "@/charts/shared/render-value-labels";
import { renderContainer, renderVerticalWhiskers, } from "@/charts/shared/rendering-utils";
import { useChartTheme } from "@/charts/shared/use-chart-theme";
import { useTransitionStore } from "@/stores/transition";
export const ErrorWhiskers = () => {
    const { getX, getY, getYErrorPresent, getYErrorRange, chartData, yScale, xScale, showYUncertainty, bounds, } = useChartState();
    const { margins, width, height } = bounds;
    const ref = useRef(null);
    const enableTransition = useTransitionStore((state) => state.enable);
    const transitionDuration = useTransitionStore((state) => state.duration);
    const bandwidth = xScale.bandwidth();
    const renderData = useMemo(() => {
        if (!getYErrorRange || !showYUncertainty) {
            return [];
        }
        return chartData.filter(getYErrorPresent).map((d, i) => {
            const x0 = xScale(getX(d));
            const barWidth = Math.min(bandwidth, 15);
            const y = getY(d);
            const [y1, y2] = getYErrorRange(d);
            return {
                key: `${i}`,
                x: x0 + bandwidth / 2 - barWidth / 2,
                y: yScale(y),
                y1: yScale(y1),
                y2: yScale(y2),
                width: barWidth,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        getYErrorRange,
        showYUncertainty,
        chartData,
        getYErrorPresent,
        xScale,
        getX,
        bandwidth,
        yScale,
        width,
        height,
    ]);
    useEffect(() => {
        if (ref.current) {
            renderContainer(ref.current, {
                id: "columns-error-whiskers",
                transform: `translate(${margins.left} ${margins.top})`,
                transition: { enable: enableTransition, duration: transitionDuration },
                render: (g, opts) => renderVerticalWhiskers(g, renderData, opts),
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
export const Columns = () => {
    const { chartData, bounds: { margins }, xDimension, getX, xScale, getY, yScale, getRenderingKey, colors, rotateValues, } = useChartState();
    const { labelFontSize, fontFamily } = useChartTheme();
    const ref = useRef(null);
    const enableTransition = useTransitionStore((state) => state.enable);
    const transitionDuration = useTransitionStore((state) => state.duration);
    const bandwidth = xScale.bandwidth();
    const y0 = yScale(0);
    const getAnnotationRenderState = useGetAnnotationRenderState();
    const columnsData = useMemo(() => {
        return chartData.map((d) => {
            const key = getRenderingKey(d);
            const valueRaw = getY(d);
            const x = getX(d);
            const xScaled = xScale(x);
            const value = valueRaw === null || isNaN(valueRaw) ? 0 : valueRaw;
            const y = yScale(value);
            const yRender = yScale(Math.max(value, 0));
            const height = Math.max(0, Math.abs(y - y0));
            const { color, focused } = getAnnotationRenderState(d, {
                axisComponentId: xDimension.id,
                axisValue: x,
            });
            return {
                key,
                x: xScaled,
                y: yRender,
                width: bandwidth,
                height,
                // Calling colors(key) directly results in every key being added to the domain,
                // which is not what we want.
                color: color !== null && color !== void 0 ? color : colors.copy()(key),
                focused,
                observation: d,
            };
        });
    }, [
        chartData,
        getRenderingKey,
        getY,
        getX,
        xScale,
        yScale,
        y0,
        getAnnotationRenderState,
        xDimension.id,
        bandwidth,
        colors,
    ]);
    const valueLabelsData = useColumnValueLabelsData();
    useEffect(() => {
        const g = ref.current;
        if (g) {
            const common = {
                id: "columns",
                transform: `translate(${margins.left} ${margins.top})`,
                transition: {
                    enable: enableTransition,
                    duration: transitionDuration,
                },
            };
            renderContainer(g, {
                ...common,
                render: (g, opts) => renderColumns(g, columnsData, { ...opts, y0 }),
            });
            renderContainer(g, {
                ...common,
                render: (g, opts) => renderTotalValueLabels(g, valueLabelsData, {
                    ...opts,
                    rotate: rotateValues,
                    fontFamily,
                    fontSize: labelFontSize,
                }),
            });
        }
    }, [
        enableTransition,
        margins.left,
        margins.top,
        columnsData,
        transitionDuration,
        y0,
        valueLabelsData,
        labelFontSize,
        rotateValues,
        fontFamily,
    ]);
    return <g ref={ref}/>;
};
