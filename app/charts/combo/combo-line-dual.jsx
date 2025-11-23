import { line } from "d3-shape";
import { memo } from "react";
import { useChartState } from "@/charts/shared/chart-state";
export const ComboLineDual = () => {
    const { chartData, xScale, getX, yOrientationScales, y, colors, bounds } = useChartState();
    return (<g transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}>
      {[y.left, y.right].map(({ orientation, id, getY }) => {
            const pathGenerator = line()
                .defined((d) => {
                const y = getY(d);
                return y !== null && !isNaN(y);
            })
                .x((d) => xScale(getX(d)))
                .y((d) => yOrientationScales[orientation](getY(d)));
            return (<Line key={id} path={pathGenerator(chartData)} color={colors(id)}/>);
        })}
    </g>);
};
const Line = memo(function Line(props) {
    const { path, color } = props;
    return <path d={path} stroke={color} fill="none"/>;
});
