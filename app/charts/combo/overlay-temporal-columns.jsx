import { useCallback } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { useAnnotationInteractions } from "@/charts/shared/use-annotation-interactions";
export const InteractionTemporalColumns = () => {
    const { chartData, bounds: { chartHeight, margins }, getXAsDate, formatXDate, xScaleInteraction, } = useChartState();
    const { onClick, onHover, onHoverOut } = useAnnotationInteractions({
        focusingSegment: false,
    });
    const getXValue = useCallback((d) => {
        return formatXDate(getXAsDate(d));
    }, [formatXDate, getXAsDate]);
    const bandwidth = xScaleInteraction.bandwidth();
    return (<g transform={`translate(${margins.left} ${margins.top})`}>
      {chartData.map((d, i) => {
            const x = getXValue(d);
            const xScaled = xScaleInteraction(x);
            return (<rect key={i} x={xScaled} y={0} width={bandwidth} height={Math.max(0, chartHeight)} fill="hotpink" fillOpacity={0} stroke="none" onMouseOver={() => onHover(d, { segment: undefined })} onMouseOut={onHoverOut} onClick={() => onClick(d, { segment: undefined })}/>);
        })}
    </g>);
};
