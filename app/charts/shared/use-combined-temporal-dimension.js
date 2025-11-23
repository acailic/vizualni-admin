import { t } from "@lingui/macro";
import { ascending, descending } from "d3-array";
import uniqBy from "lodash/uniqBy";
import { useMemo } from "react";
import { hasChartConfigs, useConfiguratorState, } from "@/configurator/configurator-state";
import { getTemporalEntityValue, isTemporalDimensionWithTimeUnit, isTemporalEntityDimension, } from "@/domain/data";
import { useTimeFormatLocale } from "@/formatters";
import { useConfigsCubeComponents } from "@/graphql/hooks";
import { stringifyComponentId } from "@/graphql/make-component-id";
import { useLocale } from "@/locales/use-locale";
import { timeUnitFormats, timeUnitOrder } from "@/rdf/mappings";
import { useDashboardInteractiveFilters } from "@/stores/interactive-filters";
/** Hook to get combined temporal dimension. Useful for shared dashboard filters. */
export const useCombinedTemporalDimension = () => {
    const locale = useLocale();
    const formatLocale = useTimeFormatLocale();
    const [state] = useConfiguratorState(hasChartConfigs);
    const { potentialTimeRangeFilterIds } = useDashboardInteractiveFilters();
    const [{ data }] = useConfigsCubeComponents({
        variables: {
            state,
            locale,
        },
    });
    return useMemo(() => {
        var _a;
        return getCombinedTemporalDimension({
            formatLocale,
            dimensions: (_a = data === null || data === void 0 ? void 0 : data.dataCubesComponents.dimensions) !== null && _a !== void 0 ? _a : [],
            potentialTimeRangeFilterIds,
        });
    }, [
        data === null || data === void 0 ? void 0 : data.dataCubesComponents.dimensions,
        formatLocale,
        potentialTimeRangeFilterIds,
    ]);
};
export const getCombinedTemporalDimension = ({ formatLocale, dimensions, potentialTimeRangeFilterIds, }) => {
    var _a;
    const timeUnitDimensions = dimensions.filter((dimension) => isTemporalDimensionWithTimeUnit(dimension) &&
        potentialTimeRangeFilterIds.includes(dimension.id));
    // We want to use lowest time unit for combined dimension filtering,
    // so in case we have year and day, we'd filter both by day
    const timeUnit = (_a = timeUnitDimensions.sort((a, b) => {
        var _a, _b;
        return descending((_a = timeUnitOrder.get(a.timeUnit)) !== null && _a !== void 0 ? _a : 0, (_b = timeUnitOrder.get(b.timeUnit)) !== null && _b !== void 0 ? _b : 0);
    })[0]) === null || _a === void 0 ? void 0 : _a.timeUnit;
    const timeFormat = timeUnitFormats.get(timeUnit);
    const values = timeUnitDimensions.flatMap((dimension) => {
        const formatDate = formatLocale.format(timeFormat);
        const parseDate = formatLocale.parse(dimension.timeFormat);
        // Standardize values to have same date format
        const temporalEntity = isTemporalEntityDimension(dimension);
        return dimension.values.map((dv) => {
            const date = parseDate(`${temporalEntity ? getTemporalEntityValue(dv) : dv.value}`);
            const dateString = formatDate(date);
            return {
                ...dv,
                value: dateString,
                label: dateString,
            };
        });
    });
    const combinedDimension = {
        __typename: "TemporalDimension",
        cubeIri: "all",
        id: stringifyComponentId({
            unversionedCubeIri: "all",
            unversionedComponentIri: "combined-date-filter",
        }),
        label: t({
            id: "controls.section.shared-filters.date",
            message: "Date",
        }),
        isKeyDimension: true,
        isNumerical: false,
        values: uniqBy(values, "value").sort((a, b) => ascending(a.value, b.value)),
        relatedLimitValues: [],
        timeUnit,
        timeFormat,
    };
    return combinedDimension;
};
