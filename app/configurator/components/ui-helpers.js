import { t } from "@lingui/macro";
import { ascending } from "d3-array";
import { scaleOrdinal } from "d3-scale";
import { timeFormat, timeParse } from "d3-time-format";
import { useMemo } from "react";
import { match } from "ts-pattern";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { getTemporalEntityValue, isJoinByComponent, isTemporalDimension, } from "@/domain/data";
import { TimeUnit } from "@/graphql/query-hooks";
import { getTimeInterval } from "@/intervals";
import { getPalette } from "@/palettes";
// FIXME: We should cover more time formats
export const timeUnitToParser = {
    Second: timeParse("%Y-%m-%dT%H:%M:%S"),
    Hour: timeParse("%Y-%m-%dT%H:%M"),
    Minute: timeParse("%Y-%m-%dT%H:%M"),
    Week: timeParse("%Y-%m-%d"),
    Day: timeParse("%Y-%m-%d"),
    Month: timeParse("%Y-%m"),
    Year: timeParse("%Y"),
};
export const parseDate = (dateStr) => {
    var _a, _b, _c, _d, _e;
    return (_e = (_d = (_c = (_b = (_a = timeUnitToParser.Second(dateStr)) !== null && _a !== void 0 ? _a : timeUnitToParser.Minute(dateStr)) !== null && _b !== void 0 ? _b : timeUnitToParser.Day(dateStr)) !== null && _c !== void 0 ? _c : timeUnitToParser.Month(dateStr)) !== null && _d !== void 0 ? _d : timeUnitToParser.Year(dateStr)) !== null && _e !== void 0 ? _e : 
    // This should probably not happen
    new Date(dateStr);
};
export const timeUnitToFormatter = {
    Year: timeFormat("%Y"),
    Month: timeFormat("%Y-%m"),
    Week: timeFormat("%Y-%m-%d"),
    Day: timeFormat("%Y-%m-%d"),
    Hour: timeFormat("%Y-%m-%dT%H:%M"),
    Minute: timeFormat("%Y-%m-%dT%H:%M"),
    Second: timeFormat("%Y-%m-%dT%H:%M:%S"),
};
export const mkNumber = (x) => +x;
export const getTimeIntervalWithProps = (from, to, timeUnit, timeFormat, formatLocale) => {
    const formatDateValue = formatLocale.format(timeFormat);
    const parseDateValue = formatLocale.parse(timeFormat);
    const fromDate = parseDateValue(from);
    const toDate = parseDateValue(to);
    if (!fromDate || !toDate) {
        throw Error(`Error parsing dates ${from}, ${to}`);
    }
    const interval = getTimeInterval(timeUnit);
    return {
        fromDate,
        toDate,
        formatDateValue,
        range: interval.count(fromDate, toDate) + 1,
        interval,
    };
};
export const getTimeIntervalFormattedSelectOptions = ({ fromDate, toDate, formatDateValue, interval, }) => {
    return [...interval.range(fromDate, toDate), toDate].map((d) => {
        return {
            value: formatDateValue(d),
            label: formatDateValue(d),
        };
    });
};
const getErrorMeasure = ({ dimensions, measures, type, }, valueIri) => {
    return [...dimensions, ...measures].find((m) => {
        var _a;
        return (_a = m.related) === null || _a === void 0 ? void 0 : _a.some((r) => r.type === type && r.id === valueIri);
    });
};
export const useErrorMeasure = (componentId, { dimensions, measures, type, }) => {
    return useMemo(() => {
        return getErrorMeasure({ dimensions, measures, type }, componentId);
    }, [componentId, dimensions, measures, type]);
};
export const useErrorVariable = (errorMeasure) => {
    return useMemo(() => {
        return errorMeasure
            ? (d) => {
                return d[errorMeasure.id];
            }
            : null;
    }, [errorMeasure]);
};
export const useErrorRange = (upperErrorMeasure, lowerErrorMeasure, valueGetter) => {
    return useMemo(() => {
        return upperErrorMeasure && lowerErrorMeasure
            ? (d) => {
                const v = valueGetter(d);
                const upperId = upperErrorMeasure.id;
                let upperError = d[upperId] !== null ? parseFloat(d[upperId]) : null;
                if (upperErrorMeasure.unit === "%" && upperError !== null) {
                    upperError = (upperError * v) / 100;
                }
                const lowerId = lowerErrorMeasure.id;
                let lowerError = d[lowerId] !== null ? parseFloat(d[lowerId]) : null;
                if (lowerErrorMeasure.unit === "%" && lowerError !== null) {
                    lowerError = (lowerError * v) / 100;
                }
                return (upperError === null || lowerError === null
                    ? [v, v]
                    : [v - lowerError, v + upperError]);
            }
            : null;
    }, [lowerErrorMeasure, upperErrorMeasure, valueGetter]);
};
export const getIconName = (name) => {
    switch (name) {
        case "x":
            return "xAxis";
        case "y":
            return "yAxis";
        case "segment":
            return "segments";
        case "table":
            return "tableChart";
        case "filter":
            return "filter";
        case "column":
            return "chartColumn";
        case "bar":
            return "chartBar";
        case "line":
            return "lineChart";
        case "area":
            return "areasChart";
        case "scatterplot":
            return "scatterplotChart";
        case "pie":
            return "pieChart";
        case "map":
            return "mapChart";
        case "comboLineSingle":
            return "multilineChart";
        case "comboLineDual":
            return "dualAxisChart";
        case "comboLineColumn":
            return "columnLineChart";
        case "baseLayer":
            return "map";
        case "customLayers":
            return "layoutSingle";
        case "areaLayer":
            return "mapRegions";
        case "symbolLayer":
            return "mapSymbols";
        case "text":
            return "text";
        case "title":
            return "text";
        case "description":
            return "description";
        case "tableColumnMeasure":
            return "tableColumnNumerical";
        case "tableColumnMeasureHidden":
            return "tableColumnNumericalHidden";
        case "tableColumnNominalDimension":
            return "tableColumnCategorical";
        case "tableColumnNominalDimensionHidden":
            return "tableColumnCategoricalHidden";
        case "tableColumnOrdinalDimension":
            return "tableColumnCategorical";
        case "tableColumnOrdinalDimensionHidden":
            return "tableColumnCategoricalHidden";
        case "tableColumnTemporalDimension":
            return "tableColumnTime";
        case "tableColumnTemporalDimensionHidden":
            return "tableColumnTimeHidden";
        case "time":
            return "pointInTime";
        case "animation":
            return "animation";
        case "layoutSingleURLs":
            return "layoutSingle";
        case "layoutTab":
            return "layoutTab";
        case "layoutDashboard":
            return "dashboard";
        case "layoutTall":
            return "layoutTall";
        case "layoutVertical":
            return "layoutVertical";
        case "layoutCanvas":
            return "freeCanvas";
        default:
            return "tableChart";
    }
};
const randomComparator = () => (Math.random() > 0.5 ? 1 : -1);
export const mapValueIrisToColor = ({ paletteId, dimensionValues, colorMapping: oldColorMapping, random, customPalette, }) => {
    if (!dimensionValues) {
        return {};
    }
    const paletteValues = (customPalette === null || customPalette === void 0 ? void 0 : customPalette.colors) || getPalette({ paletteId });
    const colors = dimensionValues.map((d, i) => (paletteId === "dimension" && d.color) ||
        (oldColorMapping === null || oldColorMapping === void 0 ? void 0 : oldColorMapping[`${d.value}`]) ||
        paletteValues[i % paletteValues.length]);
    const colorScale = scaleOrdinal()
        .domain(dimensionValues.map((d) => `${d.value}`))
        .range(random ? [...colors].sort(randomComparator) : colors);
    const colorMapping = {};
    dimensionValues.forEach((d) => {
        colorMapping[`${d.value}`] = colorScale(`${d.value}`);
    });
    return colorMapping;
};
export const getOrderedTableColumns = (fields) => {
    return Object.values(fields).sort((a, b) => ascending(a.index, b.index));
};
export const useOrderedTableColumns = (fields) => {
    return useMemo(() => {
        return getOrderedTableColumns(fields);
    }, [fields]);
};
export const canUseAbbreviations = (d) => {
    if (!d) {
        return false;
    }
    switch (d.__typename) {
        case "GeoCoordinatesDimension":
        case "GeoShapesDimension":
        case "NominalDimension":
        case "OrdinalDimension":
        case "OrdinalMeasure":
            break;
        default:
            return false;
    }
    return !!d.values.find((d) => d.alternateName);
};
/**
 * Returns label a dimension or a measure
 * - Handles join by dimension
 *   - Temporal dimensions will get labelled via their time unit
 * - If you need the dimension label in the context of a cube, pass the cube iri
 */
export const getComponentLabel = (component, { cubeIri } = {}) => {
    var _a;
    if (isJoinByComponent(component)) {
        const original = cubeIri && component.originalIds.find((i) => i.cubeIri === cubeIri);
        if (original) {
            return original.label;
        }
        if (component.__typename === "TemporalDimension") {
            switch (component.timeUnit) {
                case TimeUnit.Year:
                    return t({ id: `time-units.Year`, message: "Year" });
                case TimeUnit.Month:
                    return t({ id: `time-units.Month`, message: "Month" });
                case TimeUnit.Week:
                    return t({ id: `time-units.Week`, message: "Week" });
                case TimeUnit.Day:
                    return t({ id: `time-units.Day`, message: "Day" });
                case TimeUnit.Hour:
                    return t({ id: `time-units.Hour`, message: "Hour" });
                case TimeUnit.Minute:
                    return t({ id: `time-units.Minute`, message: "Minute" });
                case TimeUnit.Second:
                    return t({ id: `time-units.Second`, message: "Second" });
            }
        }
        return (_a = component.originalIds[0].label) !== null && _a !== void 0 ? _a : "NO LABEL";
    }
    return component.label;
};
/**
 * Returns component description, handling correctly join by dimension
 */
export const getComponentDescription = (dim, cubeIri) => {
    var _a;
    if (isJoinByComponent(dim)) {
        const original = cubeIri && dim.originalIds.find((i) => i.cubeIri === cubeIri);
        if (original) {
            return original.description;
        }
        return (_a = dim.originalIds[0].description) !== null && _a !== void 0 ? _a : "";
    }
    else {
        return dim.description;
    }
};
export const extractDataPickerOptionsFromDimension = ({ dimension, parseDate, }) => {
    const { isKeyDimension, label, values } = dimension;
    const noneLabel = "None";
    if (values.length) {
        const [minValue, maxValue] = isTemporalDimension(dimension)
            ? [values[0].value, values[values.length - 1].value]
            : [
                getTemporalEntityValue(values[0]),
                getTemporalEntityValue(values[values.length - 1]),
            ];
        const dimensionType = dimension.__typename;
        const options = match(dimensionType)
            .with("TemporalDimension", () => {
            return values.map((d) => {
                const stringifiedValue = `${d.value}`;
                return {
                    label: stringifiedValue,
                    value: stringifiedValue,
                };
            });
        })
            .with("TemporalEntityDimension", () => {
            return values.map((d) => {
                return {
                    label: `${d.label}`,
                    value: `${getTemporalEntityValue(d)}`,
                };
            });
        })
            .exhaustive();
        return {
            minDate: parseDate(minValue),
            maxDate: parseDate(maxValue),
            options: isKeyDimension
                ? options
                : [
                    {
                        value: FIELD_VALUE_NONE,
                        label: noneLabel,
                        isNoneValue: true,
                    },
                    ...options,
                ],
            optionValues: options.map((d) => d.value),
            label,
        };
    }
    else {
        return {
            minDate: new Date(),
            maxDate: new Date(),
            options: [],
            optionValues: [],
            label,
        };
    }
};
