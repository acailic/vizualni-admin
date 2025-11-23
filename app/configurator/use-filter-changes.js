import isEqual from "lodash/isEqual";
import { useChanges } from "@/utils/use-changes";
const isEqualFilter = (fa, fb) => {
    if ((fa === null || fa === void 0 ? void 0 : fa.type) === "single" && (fb === null || fb === void 0 ? void 0 : fb.type) === "single") {
        return fa.value === fb.value;
    }
    if ((fa === null || fa === void 0 ? void 0 : fa.type) === "range" && (fb === null || fb === void 0 ? void 0 : fb.type) === "range") {
        return fa.from === fb.from && fa.to === fb.to;
    }
    if ((fa === null || fa === void 0 ? void 0 : fa.type) === "multi" && (fb === null || fb === void 0 ? void 0 : fb.type) === "multi") {
        return isEqual(fa.values, fb.values);
    }
    return false;
};
const computeFilterChanges = (prev, cur) => {
    const allKeys = new Set([...Object.keys(prev), ...Object.keys(cur)]);
    const res = [];
    for (const key of allKeys) {
        if (!isEqualFilter(prev[key], cur[key])) {
            res.push([key, prev[key], cur[key]]);
        }
    }
    return res;
};
export const useFilterChanges = (cur) => {
    return useChanges(cur, computeFilterChanges);
};
