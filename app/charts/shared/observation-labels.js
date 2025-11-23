import { useCallback, useMemo } from "react";
/** Use this hook to be able to retrieve observation values and labels,
 * where the value is the id if present, otherwise the label.
 *
 * @param data The data to retrieve the labels from.
 * @param getLabel A function that returns the label (or abbreviation) for a given observation.
 * @param componentId The id of the component to extract value / label for.
 */
export const useObservationLabels = (data, getLabel, componentId) => {
    const getId = useCallback((d) => {
        const id = d[`${componentId}/__iri__`];
        return id;
    }, [componentId]);
    const lookup = useMemo(() => {
        const lookup = new Map();
        data.forEach((d) => {
            const id = getId(d);
            const label = getLabel(d);
            lookup.set(id !== null && id !== void 0 ? id : label, label);
        });
        return lookup;
    }, [data, getId, getLabel]);
    const getValue = useCallback((d) => {
        var _a;
        return (_a = getId(d)) !== null && _a !== void 0 ? _a : getLabel(d);
    }, [getId, getLabel]);
    const getLookupLabel = useCallback((d) => {
        var _a;
        return (_a = lookup.get(d)) !== null && _a !== void 0 ? _a : d;
    }, [lookup]);
    return {
        getValue,
        getLabel: getLookupLabel,
    };
};
