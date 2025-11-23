import { useCallback, useMemo } from "react";
export const useMaybeAbbreviations = ({ useAbbreviations, dimensionId, dimensionValues, }) => {
    const { valueLookup, labelLookup, abbreviationOrLabelLookup } = useMemo(() => {
        const values = dimensionValues !== null && dimensionValues !== void 0 ? dimensionValues : [];
        const valueLookup = new Map();
        const labelLookup = new Map();
        for (const d of values) {
            valueLookup.set(d.value, d);
            labelLookup.set(d.label, d);
        }
        const abbreviationOrLabelLookup = new Map(Array.from(labelLookup, ([k, v]) => {
            var _a;
            return [
                useAbbreviations ? (_a = v.alternateName) !== null && _a !== void 0 ? _a : k : k,
                v,
            ];
        }));
        return {
            valueLookup,
            labelLookup,
            abbreviationOrLabelLookup,
        };
    }, [dimensionValues, useAbbreviations]);
    const getAbbreviationOrLabelByValue = useCallback((d) => {
        var _a, _b, _c;
        if (!dimensionId) {
            return "";
        }
        const value = d[`${dimensionId}/__iri__`];
        const label = d[dimensionId];
        if (value === undefined && label === undefined) {
            return "";
        }
        const lookedUpObservation = (_a = (value ? valueLookup.get(value) : null)) !== null && _a !== void 0 ? _a : (label ? labelLookup.get(label) : null);
        const lookedUpLabel = (_b = lookedUpObservation === null || lookedUpObservation === void 0 ? void 0 : lookedUpObservation.label) !== null && _b !== void 0 ? _b : "";
        return useAbbreviations
            ? (_c = lookedUpObservation === null || lookedUpObservation === void 0 ? void 0 : lookedUpObservation.alternateName) !== null && _c !== void 0 ? _c : lookedUpLabel
            : lookedUpLabel;
    }, [dimensionId, valueLookup, labelLookup, useAbbreviations]);
    return {
        abbreviationOrLabelLookup,
        getAbbreviationOrLabelByValue,
    };
};
