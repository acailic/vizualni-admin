import { ascending } from "d3-array";
export const getSortedComponents = (components) => {
    return [...components].sort((a, b) => {
        var _a, _b;
        return ascending((_a = a.order) !== null && _a !== void 0 ? _a : Infinity, (_b = b.order) !== null && _b !== void 0 ? _b : Infinity);
    });
};
