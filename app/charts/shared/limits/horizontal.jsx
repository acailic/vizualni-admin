import { useMemo } from "react";
import { useChartState } from "@/charts/shared/chart-state";
import { createLimitsComponent } from "@/charts/shared/limits/create-component";
export const HorizontalLimits = (props) => {
    const chartState = useChartState();
    const LimitsComponent = useMemo(() => {
        return createLimitsComponent({
            isHorizontal: true,
            getChartState: () => chartState,
        });
    }, [chartState]);
    return <LimitsComponent {...props}/>;
};
HorizontalLimits.displayName = "HorizontalLimits";
