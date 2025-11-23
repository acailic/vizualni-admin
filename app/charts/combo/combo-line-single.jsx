import { line } from "d3-shape";
import { memo } from "react";
import { useChartState } from "@/charts/shared/chart-state";
export const ComboLineSingle = () => {
    const { chartData, xScale, getX, yScale, y, colors, bounds } = useChartState();
    return (<g transform={`translate(${bounds.margins.left} ${bounds.margins.top})`}>
      {y.lines.map(({ id, getY }) => {
            const pathGenerator = line()
                .defined((d) => {
                const y = getY(d);
                return y !== null && !isNaN(y);
            })
                .x((d) => xScale(getX(d)))
                .y((d) => yScale(getY(d)));
            return (<Line key={id} path={pathGenerator(chartData)} color={colors(id)}/>);
        })}
    </g>);
};
const Line = memo(function Line(props) {
    const { path, color } = props;
    return <path d={path} stroke={color} fill="none"/>;
});
