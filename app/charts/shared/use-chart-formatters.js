import { useMemo } from "react";
import { useDimensionFormatters } from "@/formatters";
export const useChartFormatters = (chartProps) => {
    const { dimensions, measures } = chartProps;
    const components = useMemo(() => [...dimensions, ...measures], [dimensions, measures]);
    return useDimensionFormatters(components);
};
