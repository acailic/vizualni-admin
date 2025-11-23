import orderBy from "lodash/orderBy";
import { useMemo } from "react";
import { VISUALIZE_MOST_RECENT_VALUE } from "@/domain/most-recent-value";
import { makeDimensionValueSorters } from "@/utils/sorting-values";
export const resolveMostRecentValue = (value, dimension) => {
    var _a;
    if (value === VISUALIZE_MOST_RECENT_VALUE && (dimension === null || dimension === void 0 ? void 0 : dimension.values.length)) {
        const sorters = makeDimensionValueSorters(dimension);
        const sortedValues = orderBy(dimension.values, sorters.map((s) => (dv) => s(dv.label)));
        return (_a = sortedValues[sortedValues.length - 1]) === null || _a === void 0 ? void 0 : _a.value;
    }
    return value;
};
export const useResolveMostRecentValue = (value, dimension) => {
    return useMemo(() => {
        return resolveMostRecentValue(value, dimension);
    }, [value, dimension]);
};
