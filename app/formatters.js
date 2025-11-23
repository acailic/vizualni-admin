import { format } from "d3-format";
import { timeDay, timeHour, timeMinute, timeMonth, timeYear } from "d3-time";
import { timeParse } from "d3-time-format";
import keyBy from "lodash/keyBy";
import memoize from "lodash/memoize";
import { useMemo } from "react";
import { parseDate } from "@/configurator/components/ui-helpers";
import { isNumericalMeasure, isTemporalDimension, } from "@/domain/data";
import { TimeUnit } from "@/graphql/query-hooks";
import { getD3FormatLocale, getD3TimeFormatLocale } from "@/locales/locales";
import { useLocale } from "@/locales/use-locale";
const DIMENSION_VALUE_UNDEFINED = "https://cube.link/Undefined";
const NO_AVAILABLE_VALUE_RETURN_REPLACEMENT = "–";
const isNamedNodeDimension = (d) => {
    var _a;
    const first = (_a = d.values) === null || _a === void 0 ? void 0 : _a[0];
    return first && first.label !== first.value;
};
const isDataCubeNamedNodeDimension = (d) => {
    return isNamedNodeDimension(d);
};
const namedNodeFormatter = (d) => {
    const valuesByIri = keyBy(d.values, (x) => x.value);
    return (v) => {
        var _a;
        return ((_a = valuesByIri[v]) === null || _a === void 0 ? void 0 : _a.label) || v;
    };
};
const currencyFormatter = (d) => {
    var _a, _b;
    const formatLocale = getD3FormatLocale();
    const minDecimals = (_b = (_a = d.resolution) !== null && _a !== void 0 ? _a : d.currencyExponent) !== null && _b !== void 0 ? _b : 2;
    const maxDecimals = 8;
    const baseFormatter = formatLocale.format(`,.${maxDecimals}f`);
    return (v) => {
        const formatted = baseFormatter(v);
        const l = formatted.length;
        // TODO Decimal separator should be based on locale
        const dot = formatted.indexOf(".");
        let lastSignificantIndex = formatted.length - maxDecimals + minDecimals - 1;
        for (let i = l - maxDecimals + minDecimals; i < l; i++) {
            if (formatted[i] !== "0") {
                lastSignificantIndex = i;
            }
        }
        return formatted.substring(0, lastSignificantIndex +
            (minDecimals === 0 || dot === lastSignificantIndex ? 0 : 1));
    };
};
export const getFormattersForLocale = memoize((locale) => {
    const { format } = getD3TimeFormatLocale(locale);
    return {
        empty: () => "-",
        second: format("%d.%m.%Y %H:%M:%S"),
        minute: format("%d.%m.%Y %H:%M"),
        hour: format("%d.%m.%Y %H:%M"),
        day: format("%d.%m.%Y"),
        month: format("%m.%Y"),
        year: format("%Y"),
    };
});
const useLocalFormatters = () => {
    const locale = useLocale();
    return getFormattersForLocale(locale);
};
export const dateFormatterFromDimension = (dim, localFormatters, formatDateAuto) => {
    if (dim.timeFormat &&
        dim.timeUnit &&
        localFormatters[dim.timeUnit.toLowerCase()]) {
        const formatter = localFormatters[dim.timeUnit.toLowerCase()];
        const parser = timeParse(dim.timeFormat);
        const timezoneParser = timeParse(`${dim.timeFormat}%Z`);
        return (d) => {
            var _a;
            if (!d) {
                return localFormatters.empty();
            }
            const parsed = (_a = parser(d)) !== null && _a !== void 0 ? _a : timezoneParser(d);
            return parsed ? formatter(parsed) : localFormatters.empty();
        };
    }
    return formatDateAuto;
};
export const formatIdentity = (x) => {
    return x !== DIMENSION_VALUE_UNDEFINED && x !== null
        ? `${x}`
        : NO_AVAILABLE_VALUE_RETURN_REPLACEMENT;
};
const decimalFormatter = (dim, formatNumber) => {
    const res = dim.resolution;
    const hasResolution = typeof res === "number";
    const formatting = `${hasResolution ? `.${res}` : ""}~e`;
    const expFormatter = format(formatting);
    return (v) => {
        const p = parseFloat(v);
        const a = Math.abs(p);
        if (p === 0) {
            return formatNumber(v);
        }
        else if (a > 999999999 || a < 0.0001) {
            return expFormatter(p);
        }
        else {
            return v;
        }
    };
};
const getDimensionFormatters = ({ components, formatNumber, formatDateAuto, dateFormatters, }) => {
    return Object.fromEntries(components.map((d) => {
        let formatter;
        if (isNumericalMeasure(d)) {
            if (d.isCurrency) {
                formatter = currencyFormatter(d);
            }
            else if (d.isDecimal) {
                formatter = decimalFormatter(d, formatNumber);
            }
            else {
                formatter = formatNumber;
            }
        }
        else if (isTemporalDimension(d)) {
            formatter = dateFormatterFromDimension(d, dateFormatters, formatDateAuto);
        }
        else if (isDataCubeNamedNodeDimension(d)) {
            formatter = namedNodeFormatter(d);
        }
        else if (
        // It makes no sense to format numeric values of ordinal dimensions
        // as numbers.
        d.isNumerical &&
            d.__typename !== "OrdinalDimension" &&
            d.__typename !== "OrdinalMeasure") {
            formatter = formatNumber;
        }
        else {
            formatter = formatIdentity;
        }
        return [d.id, formatter];
    }));
};
export const useDimensionFormatters = (components) => {
    const formatNumber = useFormatNumber();
    const formatDateAuto = useFormatFullDateAuto();
    const dateFormatters = useLocalFormatters();
    return useMemo(() => {
        return getDimensionFormatters({
            components,
            formatNumber,
            formatDateAuto,
            dateFormatters,
        });
    }, [components, formatNumber, formatDateAuto, dateFormatters]);
};
export const getFormatFullDateAuto = (formatters) => {
    return (dateInput) => {
        if (dateInput === null) {
            return formatters.empty();
        }
        const date = typeof dateInput === "string" ? parseDate(dateInput) : dateInput;
        return (timeMinute(date) < date
            ? formatters.second
            : timeHour(date) < date
                ? formatters.minute
                : timeDay(date) < date
                    ? formatters.hour
                    : timeMonth(date) < date
                        ? formatters.day
                        : timeYear(date) < date
                            ? formatters.month
                            : formatters.year)(date);
    };
};
/**
 * Formats dates automatically based on their precision in LONG form.
 *
 * Use wherever dates are displayed without being in context of other dates (e.g. in tooltips)
 */
export const useFormatFullDateAuto = () => {
    const formatters = useLocalFormatters();
    return useMemo(() => {
        return getFormatFullDateAuto(formatters);
    }, [formatters]);
};
/**
 * Parses and formats ISO *dates* of form 2002-01-01.
 */
export const useFormatDate = () => {
    const locale = useLocale();
    const formatter = useMemo(() => {
        const { format, parse } = getD3TimeFormatLocale(locale);
        const parseDate = parse("%Y-%m-%d");
        const formatDate = format("%d.%m.%Y");
        return (date) => {
            const d = parseDate(date);
            return d ? formatDate(d) : null;
        };
    }, [locale]);
    return formatter;
};
/**
 * Parses and formats ISO *dates* of form 2002-01-01.
 */
export const useTimeFormatLocale = () => {
    const locale = useLocale();
    const formatter = useMemo(() => {
        return getD3TimeFormatLocale(locale);
    }, [locale]);
    return formatter;
};
const timeFormats = new Map([
    [TimeUnit.Year, "%Y"],
    [TimeUnit.Month, "%b %Y"],
    [TimeUnit.Week, "%d.%m.%Y"],
    [TimeUnit.Day, "%d.%m.%Y"],
    [TimeUnit.Hour, "%d.%m.%Y %H:%M"],
    [TimeUnit.Minute, "%d.%m.%Y %H:%M"],
    [TimeUnit.Second, "%d.%m.%Y %H:%M:%S"],
]);
export const useTimeFormatUnit = () => {
    const locale = useLocale();
    const formatter = useMemo(() => {
        const { format } = getD3TimeFormatLocale(locale);
        return (dateInput, timeUnit) => {
            var _a;
            const date = typeof dateInput === "string" ? parseDate(dateInput) : dateInput;
            const timeFormat = (_a = timeFormats.get(timeUnit)) !== null && _a !== void 0 ? _a : timeFormats.get(TimeUnit.Day);
            const f = format(timeFormat);
            return f(date);
        };
    }, [locale]);
    return formatter;
};
const getFormatNumber = (props) => {
    const { decimals = 2 } = props !== null && props !== void 0 ? props : {};
    const { format } = getD3FormatLocale();
    // Only valid for up to 6 decimals!
    // See https://262.ecma-international.org/6.0/#sec-number.prototype.toprecision, 12c.
    const specifier = decimals === "auto" ? ",~f" : `,.${decimals}~f`;
    const formatter = format(specifier);
    return (d) => {
        if (d === null || d === undefined) {
            return "–";
        }
        return `${formatter(d)}`;
    };
};
export const useFormatNumber = (props) => {
    return useMemo(() => {
        return getFormatNumber(props);
    }, [props]);
};
export const useFormatInteger = () => {
    return useMemo(() => {
        const { format } = getD3FormatLocale();
        const formatter = format(",.0~f");
        return (x) => {
            if (x === null || x === undefined) {
                return "–";
            }
            return formatter(x);
        };
    }, []);
};
/**
 * Formats dates automatically based on their precision in SHORT form.
 *
 * Use wherever dates are displayed in context of other dates (e.g. on time axes)
 */
export const useFormatShortDateAuto = () => {
    const locale = useLocale();
    const formatter = useMemo(() => {
        const { format } = getD3TimeFormatLocale(locale);
        const formatSecond = format(":%S");
        const formatMinute = format("%H:%M");
        const formatHour = format("%H");
        const formatDay = format("%d");
        const formatMonth = format("%b");
        const formatYear = format("%Y");
        return (date) => {
            return (timeMinute(date) < date
                ? formatSecond
                : timeHour(date) < date
                    ? formatMinute
                    : timeDay(date) < date
                        ? formatHour
                        : timeMonth(date) < date
                            ? formatDay
                            : timeYear(date) < date
                                ? formatMonth
                                : formatYear)(date);
        };
    }, [locale]);
    return formatter;
};
export const formatNumberWithUnit = (nb, formatter, unit) => {
    if (nb === null || nb === undefined) {
        return "-";
    }
    return `${formatter(nb)}${unit ? ` ${unit}` : ""}`;
};
