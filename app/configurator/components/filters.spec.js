import { describe, expect, it } from "vitest";
import { getHasColorMapping, sortFilterValues } from "@/configurator/components/filters";
import { TimeUnit } from "@/graphql/resolver-types";
import { getD3TimeFormatLocale } from "@/locales/locales";
import { getTimeFilterOptions } from "@/utils/time-filter-options";
describe("TimeFilter", () => {
    const dimension = {
        __typename: "TemporalDimension",
        timeFormat: "%Y",
        timeUnit: TimeUnit.Year,
        values: [{ value: "2020" }, { value: "ABC" }],
        relatedLimitValues: [],
    };
    const formatLocale = getD3TimeFormatLocale("de");
    const timeFormatUnit = (date, _) => {
        return date.toString();
    };
    it("should correctly omit non-parsable dates", () => {
        const { sortedOptions, sortedValues } = getTimeFilterOptions({
            dimension,
            formatLocale,
            timeFormatUnit,
        });
        expect(sortedOptions).toHaveLength(1);
        expect(sortedValues).toHaveLength(1);
        expect(sortedOptions[0].value).toEqual("2020");
    });
});
describe("colorMapping", () => {
    it("should not detect colorMapping as present for single color fields", () => {
        expect(getHasColorMapping({
            colorConfig: { type: "single", paletteId: "321", color: "aliceblue" },
            filterDimensionId: "123",
        })).toBe(false);
    });
});
describe("sortFilterValues", () => {
    it("should sort values numerically by identifier when identifiers are numeric strings", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "1",
                hasValue: true,
                label: "One",
                identifier: "1",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "10",
                hasValue: true,
                label: "Ten",
                identifier: "10",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "2",
                hasValue: true,
                label: "Two",
                identifier: "2",
            },
        ];
        const sortedValues = sortFilterValues(values);
        expect(sortedValues.map(v => v.identifier)).toEqual(["1", "2", "10"]);
    });
    it("should sort alphabetically when identifiers are non-numeric", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "c",
                hasValue: true,
                label: "Charlie",
                identifier: "c",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "a",
                hasValue: true,
                label: "Alpha",
                identifier: "a",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "b",
                hasValue: true,
                label: "Bravo",
                identifier: "b",
            },
        ];
        const sortedValues = sortFilterValues(values);
        expect(sortedValues.map(v => v.identifier)).toEqual(["a", "b", "c"]);
    });
    it("should handle mixed numeric and non-numeric identifiers", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "3",
                hasValue: true,
                label: "Three",
                identifier: "3",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "alpha",
                hasValue: true,
                label: "Alpha",
                identifier: "alpha",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "1",
                hasValue: true,
                label: "One",
                identifier: "1",
            },
        ];
        const sortedValues = sortFilterValues(values);
        // Numeric should come first, then alphabetic
        expect(sortedValues.map(v => v.identifier)).toEqual(["1", "3", "alpha"]);
    });
    it("should handle values without identifiers", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "c",
                hasValue: true,
                label: "Charlie",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "a",
                hasValue: true,
                label: "Alpha",
            },
        ];
        const sortedValues = sortFilterValues(values);
        // Should fallback to sorting by value or label
        expect(sortedValues).toBeDefined();
        expect(sortedValues).toHaveLength(2);
    });
    it("should preserve hierarchy depth during sorting", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "parent",
                hasValue: true,
                label: "Parent",
                identifier: "2",
            },
            {
                depth: 1,
                dimensionId: "test",
                value: "child",
                hasValue: true,
                label: "Child",
                identifier: "1",
            },
        ];
        const sortedValues = sortFilterValues(values);
        // Should maintain structure even after sorting
        expect(sortedValues[0].depth).toBeDefined();
        expect(sortedValues[1].depth).toBeDefined();
    });
    it("should handle empty array", () => {
        const values = [];
        const sortedValues = sortFilterValues(values);
        expect(sortedValues).toEqual([]);
    });
    it("should handle single value", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "single",
                hasValue: true,
                label: "Single",
                identifier: "1",
            },
        ];
        const sortedValues = sortFilterValues(values);
        expect(sortedValues).toEqual(values);
    });
    it("should handle large numeric identifiers", () => {
        const values = [
            {
                depth: 0,
                dimensionId: "test",
                value: "1",
                hasValue: true,
                label: "Small",
                identifier: "1",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "1000000",
                hasValue: true,
                label: "Large",
                identifier: "1000000",
            },
            {
                depth: 0,
                dimensionId: "test",
                value: "500",
                hasValue: true,
                label: "Medium",
                identifier: "500",
            },
        ];
        const sortedValues = sortFilterValues(values);
        expect(sortedValues.map(v => v.identifier)).toEqual(["1", "500", "1000000"]);
    });
});
describe("colorMapping - additional tests", () => {
    it("should detect colorMapping for segment fields", () => {
        expect(getHasColorMapping({
            colorConfig: {
                type: "segment",
                paletteId: "321",
                colorMapping: { "value1": "red", "value2": "blue" }
            },
            filterDimensionId: "123",
        })).toBe(true);
    });
    it("should handle missing colorConfig", () => {
        expect(getHasColorMapping({
            colorConfig: undefined,
            filterDimensionId: "123",
        })).toBe(false);
    });
    it("should handle colorMapping with different filter dimension", () => {
        expect(getHasColorMapping({
            colorConfig: {
                type: "segment",
                paletteId: "321",
                colorMapping: {}
            },
            filterDimensionId: "456",
        })).toBe(true);
    });
});
describe("TimeFilter - additional tests", () => {
    it("should handle dimensions with all valid dates", () => {
        const dimension = {
            __typename: "TemporalDimension",
            timeFormat: "%Y",
            timeUnit: TimeUnit.Year,
            values: [
                { value: "2020" },
                { value: "2021" },
                { value: "2022" },
            ],
            relatedLimitValues: [],
        };
        const formatLocale = getD3TimeFormatLocale("en");
        const timeFormatUnit = (date, _) => {
            return date.toString();
        };
        const { sortedOptions, sortedValues } = getTimeFilterOptions({
            dimension,
            formatLocale,
            timeFormatUnit,
        });
        expect(sortedOptions).toHaveLength(3);
        expect(sortedValues).toHaveLength(3);
        expect(sortedOptions.map(o => o.value)).toEqual(["2020", "2021", "2022"]);
    });
    it("should handle dimensions with all invalid dates", () => {
        const dimension = {
            __typename: "TemporalDimension",
            timeFormat: "%Y",
            timeUnit: TimeUnit.Year,
            values: [
                { value: "INVALID" },
                { value: "NOT_A_DATE" },
                { value: "XYZ" },
            ],
            relatedLimitValues: [],
        };
        const formatLocale = getD3TimeFormatLocale("en");
        const timeFormatUnit = (date, _) => {
            return date.toString();
        };
        const { sortedOptions, sortedValues } = getTimeFilterOptions({
            dimension,
            formatLocale,
            timeFormatUnit,
        });
        expect(sortedOptions).toHaveLength(0);
        expect(sortedValues).toHaveLength(0);
    });
    it("should handle empty dimension values", () => {
        const dimension = {
            __typename: "TemporalDimension",
            timeFormat: "%Y",
            timeUnit: TimeUnit.Year,
            values: [],
            relatedLimitValues: [],
        };
        const formatLocale = getD3TimeFormatLocale("en");
        const timeFormatUnit = (date, _) => {
            return date.toString();
        };
        const { sortedOptions, sortedValues } = getTimeFilterOptions({
            dimension,
            formatLocale,
            timeFormatUnit,
        });
        expect(sortedOptions).toHaveLength(0);
        expect(sortedValues).toHaveLength(0);
    });
    it("should handle different locales", () => {
        const dimension = {
            __typename: "TemporalDimension",
            timeFormat: "%Y",
            timeUnit: TimeUnit.Year,
            values: [{ value: "2020" }],
            relatedLimitValues: [],
        };
        const locales = ["de", "fr", "it", "en"];
        locales.forEach(locale => {
            const formatLocale = getD3TimeFormatLocale(locale);
            const timeFormatUnit = (date, _) => {
                return date.toString();
            };
            const { sortedOptions } = getTimeFilterOptions({
                dimension,
                formatLocale,
                timeFormatUnit,
            });
            expect(sortedOptions).toHaveLength(1);
            expect(sortedOptions[0].value).toEqual("2020");
        });
    });
    it("should sort temporal values chronologically", () => {
        const dimension = {
            __typename: "TemporalDimension",
            timeFormat: "%Y",
            timeUnit: TimeUnit.Year,
            values: [
                { value: "2022" },
                { value: "2020" },
                { value: "2021" },
            ],
            relatedLimitValues: [],
        };
        const formatLocale = getD3TimeFormatLocale("en");
        const timeFormatUnit = (date, _) => {
            return date.toString();
        };
        const { sortedOptions } = getTimeFilterOptions({
            dimension,
            formatLocale,
            timeFormatUnit,
        });
        expect(sortedOptions.map(o => o.value)).toEqual(["2020", "2021", "2022"]);
    });
});
