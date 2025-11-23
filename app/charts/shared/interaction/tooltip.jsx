import { useChartState } from "@/charts/shared/chart-state";
import { TooltipBox, } from "@/charts/shared/interaction/tooltip-box";
import { TooltipMultiple, TooltipSingle, } from "@/charts/shared/interaction/tooltip-content";
import { useInteraction } from "@/charts/shared/use-interaction";
export const Tooltip = ({ type = "single" }) => {
    const [{ type: interactionType, visible, observation }] = useInteraction();
    return interactionType === "tooltip" && visible && observation ? (<TooltipInner d={observation} type={type}/>) : null;
};
const TooltipInner = ({ d, type }) => {
    const { bounds, getTooltipInfo } = useChartState();
    const { margins } = bounds;
    const { xAnchor, yAnchor, placement, value, tooltipContent, datum, values, withTriangle, } = getTooltipInfo(d);
    if (Number.isNaN(yAnchor) || yAnchor === undefined) {
        return null;
    }
    return (<TooltipBox x={xAnchor} y={yAnchor} placement={placement} withTriangle={withTriangle} margins={margins}>
      {tooltipContent ? (tooltipContent) : type === "multiple" && values ? (<TooltipMultiple xValue={value} segmentValues={values}/>) : (<TooltipSingle xValue={value} segment={datum.label} yValue={datum.value} yError={datum.error}/>)}
    </TooltipBox>);
};
