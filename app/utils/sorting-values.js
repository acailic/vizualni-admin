import { isMeasure, isNumericalMeasure, isTemporalDimension, } from "@/domain/data";
import { bfs } from "@/utils/bfs";
import { uniqueMapBy } from "@/utils/unique-map-by";
export const maybeInt = (value) => {
    if (value === undefined) {
        return Infinity;
    }
    if (typeof value === "number") {
        return value;
    }
    const maybeInt = parseInt(value, 10);
    if (isNaN(maybeInt)) {
        return value;
    }
    return maybeInt;
};
export const makeDimensionValueSorters = (component, options = {
    dimensionFilter: undefined,
}) => {
    var _a;
    if (!component) {
        return [];
    }
    if (isNumericalMeasure(component) ||
        isTemporalDimension(component) ||
        (component === null || component === void 0 ? void 0 : component.isNumerical)) {
        return [
            (d) => {
                const maybeNumber = +d;
                return isNaN(maybeNumber) ? d : maybeNumber;
            },
        ];
    }
    const { sorting, sumsBySegment, measureBySegment, useAbbreviations, dimensionFilter, } = options;
    const sortingType = sorting === null || sorting === void 0 ? void 0 : sorting.sortingType;
    const addAlternateName = (d) => {
        var _a;
        return ({
            ...d,
            label: (_a = d.alternateName) !== null && _a !== void 0 ? _a : d.label,
        });
    };
    let values = useAbbreviations
        ? component.values.map(addAlternateName)
        : component.values;
    if ((dimensionFilter === null || dimensionFilter === void 0 ? void 0 : dimensionFilter.type) === "multi") {
        const filterValues = dimensionFilter.values;
        values = values.filter((dv) => filterValues[dv.value]);
    }
    const allHierarchyValues = isMeasure(component)
        ? []
        : bfs((_a = component.hierarchy) !== null && _a !== void 0 ? _a : [], (node) => node);
    const hierarchyValuesByValue = uniqueMapBy(allHierarchyValues, (dv) => dv.value);
    const valuesByValue = uniqueMapBy(values, (dv) => dv.value);
    // Warning: if two values have the same label and have an identifier / position
    // there could be problems as we could select the "wrong" value for the order
    const valuesByLabel = uniqueMapBy(values, (dv) => dv.label);
    const getByValueOrLabel = (valueOrLabel) => {
        var _a;
        return (_a = valuesByValue.get(valueOrLabel)) !== null && _a !== void 0 ? _a : valuesByLabel.get(valueOrLabel);
    };
    const getLabel = (valueOrLabel) => {
        var _a;
        return valueOrLabel ? (_a = getByValueOrLabel(valueOrLabel)) === null || _a === void 0 ? void 0 : _a.label : "";
    };
    const getIdentifier = (valueOrLabel) => {
        var _a, _b;
        return valueOrLabel
            ? ((_b = maybeInt((_a = getByValueOrLabel(valueOrLabel)) === null || _a === void 0 ? void 0 : _a.identifier)) !== null && _b !== void 0 ? _b : Infinity)
            : Infinity;
    };
    const getPosition = (valueOrLabel) => {
        var _a, _b;
        return valueOrLabel
            ? ((_b = (_a = getByValueOrLabel(valueOrLabel)) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : Infinity)
            : Infinity;
    };
    const getHierarchy = (value) => {
        var _a;
        const hierarchyValue = value
            ? hierarchyValuesByValue.get(value)
            : undefined;
        // A depth of -1 means that the value was not originally in the hierarchy,
        // but was added artificially.
        if ((hierarchyValue === null || hierarchyValue === void 0 ? void 0 : hierarchyValue.depth) === -1) {
            return Infinity;
        }
        return (_a = hierarchyValue === null || hierarchyValue === void 0 ? void 0 : hierarchyValue.depth) !== null && _a !== void 0 ? _a : Infinity;
    };
    const getSum = (valueOrLabel) => { var _a; return valueOrLabel ? ((_a = sumsBySegment === null || sumsBySegment === void 0 ? void 0 : sumsBySegment[valueOrLabel]) !== null && _a !== void 0 ? _a : Infinity) : Infinity; };
    const getMeasure = (valueOrLabel) => { var _a; return valueOrLabel ? ((_a = measureBySegment === null || measureBySegment === void 0 ? void 0 : measureBySegment[valueOrLabel]) !== null && _a !== void 0 ? _a : Infinity) : Infinity; };
    let sorters = [];
    const defaultSorters = [getHierarchy, getPosition, getIdentifier, getLabel];
    switch (sortingType) {
        case "byDimensionLabel":
            sorters = [getLabel];
            break;
        case "byTotalSize":
            sorters = [getSum];
            break;
        case "byMeasure":
            sorters = [getMeasure];
            break;
        case "byAuto":
            sorters = defaultSorters;
            break;
        case "byTableSortingType":
            sorters = [getPosition, getLabel];
        default:
            sorters = defaultSorters;
    }
    return sorters;
};
export const valueComparator = (locale) => (a, b) => {
    if (a.identifier !== undefined && b.identifier !== undefined) {
        return a.identifier < b.identifier ? -1 : 1;
    }
    else if (a.position !== undefined && b.position !== undefined) {
        return a.position < b.position ? -1 : 1;
    }
    else {
        return a.label.localeCompare(b.label, locale);
    }
};
export const getSortingOrders = (sorters, sorting) => {
    const order = sorting === null || sorting === void 0 ? void 0 : sorting.sortingOrder;
    const type = sorting === null || sorting === void 0 ? void 0 : sorting.sortingType;
    const result = Array(sorters.length);
    switch (order) {
        case "desc":
            return result.fill(type === "byTotalSize" ? "asc" : "desc");
        case "asc":
        case undefined:
            return result.fill(type === "byTotalSize" ? "desc" : "asc");
        default:
            const _exhaustiveCheck = order;
            return _exhaustiveCheck;
    }
};
