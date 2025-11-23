import { line } from "d3-shape";
import { memo, useEffect, useMemo, useRef } from "react";
import { renderColumns, } from "@/charts/column/rendering-utils";
import { useChartState } from "@/charts/shared/chart-state";
import { renderContainer } from "@/charts/shared/rendering-utils";
import { useTransitionStore } from "@/stores/transition";
const Columns = () => {
    const { chartData, bounds, xScale, getXAsDate, formatXDate, y, yOrientationScales, colors, getRenderingKey, } = useChartState();
    const { margins } = bounds;
    const ref = useRef(null);
    const enableTransition = useTransitionStore((state) => state.enable);
    const transitionDuration = useTransitionStore((state) => state.duration);
    const bandwidth = xScale.bandwidth();
    const yColumn = y.left.chartType === "column" ? y.left : y.right;
    const yScale = y.left.chartType === "column"
        ? yOrientationScales.left
        : yOrientationScales.right;
    const y0 = yScale(0);
    const renderData = useMemo(() => {
        return chartData.map((d) => {
            var _a;
            const key = getRenderingKey(d);
            const xDate = getXAsDate(d);
            const xScaled = xScale(formatXDate(xDate));
            const y = (_a = yColumn.getY(d)) !== null && _a !== void 0 ? _a : NaN;
            const yScaled = yScale(y);
            const yRender = yScale(Math.max(y, 0));
            const height = Math.max(0, Math.abs(yScaled - y0));
            const color = colors(yColumn.id);
            return {
                key,
                x: xScaled,
                y: yRender,
                width: bandwidth,
                height,
                color,
                observation: d,
            };
        });
    }, [
        chartData,
        getRenderingKey,
        xScale,
        getXAsDate,
        formatXDate,
        yColumn,
        yScale,
        y0,
        colors,
        bandwidth,
    ]);
    useEffect(() => {
        if (ref.current) {
            renderContainer(ref.current, {
                id: "columns",
                transform: `translate(${margins.left} ${margins.top})`,
                transition: { enable: enableTransition, duration: transitionDuration },
                render: (g, opts) => renderColumns(g, renderData, { ...opts, y0 }),
            });
        }
    }, [
        enableTransition,
        margins.left,
        margins.top,
        renderData,
        transitionDuration,
        y0,
    ]);
    return <g ref={ref}/>;
};
const Lines = () => {
    const { chartData, xScale, getXAsDate, formatXDate, yOrientationScales, y, colors, bounds, } = useChartState();
    const yLine = y.left.chartType === "line" ? y.left : y.right;
    const yScale = y.left.chartType === "line"
        ? yOrientationScales.left
        : yOrientationScales.right;
    const pathGenerator = line()
        // FIXME: add missing observations basing on the time interval, so we can
        // properly indicate the missing data.
        .defined((d) => {
        const y = yLine.getY(d);
        return y !== null && !isNaN(y);
    })
        .x((d) => xScale(formatXDate(getXAsDate(d))) +
        xScale.bandwidth() * 0.5)
        .y((d) => yScale(yLine.getY(d)));
    return (<g transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}>
      <Line path={pathGenerator(chartData)} color={colors(yLine.label)}/>
    </g>);
};
const Line = memo(function Line(props) {
    const { path, color } = props;
    return <path d={path} stroke={color} strokeWidth={4} fill="none"/>;
});
export const ComboLineColumn = () => {
    return (<>
      <Columns />
      <Lines />
    </>);
};
