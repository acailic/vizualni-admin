import { Delaunay } from "d3-delaunay";
import { pointer } from "d3-selection";
import { memo, useCallback, useMemo, useRef } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { useAnnotationInteractions } from "@/charts/shared/use-annotation-interactions";
export const InteractionVoronoi = memo(function InteractionVoronoi({ debug, }) {
    const ref = useRef(null);
    const chartState = useChartState();
    const { bounds: { chartWidth, chartHeight, margins }, getSegment, colors, } = chartState;
    const { onClick, onHover, onHoverOut } = useAnnotationInteractions({
        focusingSegment: true,
    });
    const voronoiPoints = useMemo(() => {
        return getVoronoiPoints(chartState);
    }, [chartState]);
    const delaunay = useMemo(() => {
        return Delaunay.from(voronoiPoints, (d) => d.x, (d) => d.y);
    }, [voronoiPoints]);
    const voronoi = useMemo(() => {
        return delaunay.voronoi([
            0,
            0,
            atLeastZero(chartWidth),
            atLeastZero(chartHeight),
        ]);
    }, [chartWidth, chartHeight, delaunay]);
    const findVoronoiPoint = useCallback((e) => {
        if (!ref.current) {
            return;
        }
        const [x, y] = pointer(e, ref.current);
        const i = delaunay.find(x, y);
        return voronoiPoints[i];
    }, [voronoiPoints, delaunay]);
    const handleHover = useCallback((e) => {
        const point = findVoronoiPoint(e);
        if (point) {
            onHover(point.observation, { segment: point.segment });
        }
    }, [findVoronoiPoint, onHover]);
    const handleClick = useCallback((e) => {
        const point = findVoronoiPoint(e);
        if (point) {
            onClick(point.observation, { segment: point.segment });
        }
    }, [findVoronoiPoint, onClick]);
    return (<g ref={ref} transform={`translate(${margins.left} ${margins.top})`}>
      {debug &&
            voronoiPoints.map(({ observation }, i) => (<path key={i} d={voronoi.renderCell(i)} stroke="white" strokeOpacity={1} fill={colors(getSegment(observation))} fillOpacity={0.2}/>))}
      <rect width={chartWidth} height={chartHeight} fillOpacity={0} onMouseOver={handleHover} onMouseMove={handleHover} onMouseOut={onHoverOut} onClick={handleClick}/>
    </g>);
});
const getVoronoiPoints = (chartState) => {
    const { chartData, xScale, getX, yScale, getY, getSegment } = chartState;
    switch (chartState.chartType) {
        case "area": {
            const { series } = chartState;
            return series.flatMap((s) => {
                const segment = s.key;
                return s
                    .map((d) => {
                    var _a;
                    const observation = d.data;
                    const x = xScale((_a = getX(observation)) !== null && _a !== void 0 ? _a : NaN);
                    const y = yScale(series.length === 1 ? d[0] : (d[0] + d[1]) * 0.5);
                    return {
                        x,
                        y,
                        observation,
                        segment,
                    };
                })
                    .filter((point) => !Number.isNaN(point.x) && !Number.isNaN(point.y));
            });
        }
        case "line":
        case "scatterplot": {
            return chartData
                .map((d) => {
                var _a, _b;
                const segment = getSegment(d);
                return {
                    observation: d,
                    x: xScale((_a = getX(d)) !== null && _a !== void 0 ? _a : NaN),
                    y: yScale((_b = getY(d)) !== null && _b !== void 0 ? _b : NaN),
                    segment,
                };
            })
                .filter((point) => !Number.isNaN(point.x) && !Number.isNaN(point.y));
        }
        default:
            const _exhaustiveCheck = chartState;
            return _exhaustiveCheck;
    }
};
const atLeastZero = (n) => (n < 0 ? 0 : n);
