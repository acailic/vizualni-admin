import { useMemo } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { createLimitsComponent } from "@/charts/shared/limits/create-component";
export const VerticalLimits = (props) => {
    const chartState = useChartState();
    const LimitsComponent = useMemo(() => {
        return createLimitsComponent({
            isHorizontal: false,
            getChartState: () => chartState,
        });
    }, [chartState]);
    return <LimitsComponent {...props}/>;
};
VerticalLimits.displayName = "VerticalLimits";
