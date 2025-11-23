import { getTemporalEntityValue, } from "@/domain/data";
export const getTimeFilterOptions = ({ dimension, formatLocale, timeFormatUnit, }) => {
    const { timeFormat, timeUnit } = dimension;
    const parseDate = getMaybeTimezoneDateParser({ formatLocale, timeFormat });
    const formatDate = formatLocale.format(timeFormat);
    const options = [];
    for (const dimensionValue of [
        ...dimension.values,
        // TODO: could be improved to be scoped to only currently activated limits
        ...dimension.relatedLimitValues,
    ]) {
        let value;
        switch (dimension.__typename) {
            case "TemporalDimension":
                value = dimensionValue.value;
                break;
            case "TemporalEntityDimension":
                value = getTemporalEntityValue(dimensionValue);
                break;
            default:
                const _exhaustiveCheck = dimension;
                return _exhaustiveCheck;
        }
        const date = parseDate(value);
        if (date) {
            options.push({
                // By formatting the date, we remove potential timezone.
                // FIXME: This might lead to issues with SPARQL filtering.
                value: formatDate(date),
                label: timeFormatUnit(date, timeUnit),
                date,
            });
        }
    }
    const sortedOptions = options.sort((a, b) => a.date.getTime() - b.date.getTime());
    return {
        sortedOptions,
        sortedValues: sortedOptions.map((d) => d.value),
    };
};
const getMaybeTimezoneDateParser = ({ formatLocale, timeFormat, }) => {
    const parse = formatLocale.parse(timeFormat);
    const timezoneParse = formatLocale.parse(`${timeFormat}%Z`);
    return (v) => {
        var _a;
        return ((_a = parse(`${v}`)) !== null && _a !== void 0 ? _a : timezoneParse(`${v}`));
    };
};
