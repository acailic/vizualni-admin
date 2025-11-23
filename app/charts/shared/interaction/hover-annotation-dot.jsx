import { AnnotationCircle } from "@/charts/shared/annotation-circle";
import { useChartState } from "@/charts/shared/chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";
export const HoverAnnotationDot = () => {
    var _a;
    const [interaction] = useInteraction();
    const { getAnnotationInfo, bounds: { margins }, } = useChartState();
    if (interaction.type !== "annotation" ||
        !interaction.visible ||
        !interaction.observation) {
        return null;
    }
    const { x, y, color } = getAnnotationInfo(interaction.observation, {
        segment: (_a = interaction.segment) !== null && _a !== void 0 ? _a : "",
        focusingSegment: !!interaction.focusingSegment,
    });
    return (<AnnotationCircle x={x + margins.left} y={y + margins.top} color={color} focused/>);
};
