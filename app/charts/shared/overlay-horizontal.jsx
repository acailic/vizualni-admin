import { bisector } from "d3-array";
import { pointer } from "d3-selection";
import { memo, useCallback, useRef } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";
import { useEvent } from "@/utils/use-event";
export const InteractionHorizontal = memo(function InteractionHorizontal() {
    const { chartData, chartWideData, xScale, getX, getTooltipInfo, bounds: { chartWidth, chartHeight, margins }, } = useChartState();
    const [interaction, dispatch] = useInteraction();
    const ref = useRef(null);
    const hideTooltip = useEvent(() => {
        dispatch({
            type: "INTERACTION_HIDE",
        });
    });
    const showTooltip = useCallback((e) => {
        var _a;
        if (!ref.current) {
            return;
        }
        const [x, y] = pointer(e, ref.current);
        const bisectDate = bisector((d, date) => getX(d).getTime() - date.getTime()).left;
        const thisDate = xScale.invert(x);
        const i = bisectDate(chartWideData, thisDate, 1);
        const dLeft = chartWideData[i - 1];
        const dRight = (_a = chartWideData[i]) !== null && _a !== void 0 ? _a : dLeft;
        const closestDatum = thisDate.getTime() - getX(dLeft).getTime() >
            getX(dRight).getTime() - thisDate.getTime()
            ? dRight
            : dLeft;
        const yAnchor = closestDatum
            ? getTooltipInfo(closestDatum).yAnchor
            : undefined;
        if (!closestDatum || Number.isNaN(yAnchor) || yAnchor === undefined) {
            if (interaction.visible) {
                hideTooltip();
            }
            return;
        }
        const closestDatumTime = getX(closestDatum).getTime();
        const observation = chartData.find((d) => closestDatumTime === getX(d).getTime());
        if (!interaction.observation ||
            closestDatumTime !== getX(interaction.observation).getTime() ||
            !interaction.visible) {
            dispatch({
                type: "INTERACTION_UPDATE",
                value: {
                    type: "tooltip",
                    visible: true,
                    observation,
                    mouse: { x, y },
                },
            });
        }
    }, [
        chartData,
        chartWideData,
        dispatch,
        getTooltipInfo,
        getX,
        hideTooltip,
        interaction.observation,
        interaction.visible,
        xScale,
    ]);
    return (<g ref={ref} transform={`translate(${margins.left} ${margins.top})`}>
      <rect width={chartWidth} height={chartHeight} fillOpacity={0} onMouseOut={hideTooltip} onMouseOver={showTooltip} onMouseMove={showTooltip}/>
    </g>);
});
