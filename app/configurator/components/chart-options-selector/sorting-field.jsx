import { t, Trans } from "@lingui/macro";
import get from "lodash/get";
import { useCallback } from "react";
import { DEFAULT_SORTING } from "@/charts";
import { Radio, RadioGroup, Select } from "@/components/form";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { useLocale } from "@/locales/use-locale";
export const SortingField = ({ chartConfig, field, encodingSortingOptions, disabled = false, }) => {
    var _a, _b;
    const locale = useLocale();
    const [, dispatch] = useConfiguratorState(isConfiguring);
    const getSortingTypeLabel = (type) => {
        switch (type) {
            case "byDimensionLabel":
                return t({ id: "controls.sorting.byDimensionLabel", message: "Name" });
            case "byMeasure":
                return t({ id: "controls.sorting.byMeasure", message: "Measure" });
            case "byTotalSize":
                return t({ id: "controls.sorting.byTotalSize", message: "Total size" });
            case "byAuto":
                return t({ id: "controls.sorting.byAuto", message: "Automatic" });
            default:
                const _exhaustiveCheck = type;
                return _exhaustiveCheck;
        }
    };
    const updateSortingOption = useCallback(({ sortingType, sortingOrder, }) => {
        dispatch({
            type: "CHART_FIELD_UPDATED",
            value: {
                locale,
                field,
                path: "sorting",
                value: { sortingType, sortingOrder },
            },
        });
    }, [locale, dispatch, field]);
    const activeSortingType = get(chartConfig, ["fields", field, "sorting", "sortingType"], DEFAULT_SORTING["sortingType"]);
    // FIXME: Remove this once it's properly encoded in chart-config-ui-options
    const sortingOrderOptions = (_a = encodingSortingOptions.find((o) => o.sortingType === activeSortingType)) === null || _a === void 0 ? void 0 : _a.sortingOrder;
    const activeSortingOrder = get(chartConfig, ["fields", field, "sorting", "sortingOrder"], (_b = sortingOrderOptions === null || sortingOrderOptions === void 0 ? void 0 : sortingOrderOptions[0]) !== null && _b !== void 0 ? _b : "asc");
    return (<ControlSection collapse>
      <SectionTitle disabled={disabled} iconName="sort">
        <Trans id="controls.section.sorting">Sort</Trans>
      </SectionTitle>
      <ControlSectionContent>
        <Select id="sort-by" size="sm" label={getFieldLabel("sortBy")} options={encodingSortingOptions === null || encodingSortingOptions === void 0 ? void 0 : encodingSortingOptions.map((d) => {
            var _a;
            const disabledState = (_a = d.getDisabledState) === null || _a === void 0 ? void 0 : _a.call(d, chartConfig);
            return {
                value: d.sortingType,
                label: getSortingTypeLabel(d.sortingType),
                ...disabledState,
            };
        })} value={activeSortingType} disabled={disabled} onChange={(e) => {
            updateSortingOption({
                sortingType: e.target
                    .value,
                sortingOrder: activeSortingOrder,
            });
        }}/>
        <RadioGroup>
          {sortingOrderOptions &&
            sortingOrderOptions.map((sortingOrder) => {
                const subType = get(chartConfig, ["fields", "segment", "type"], "");
                const chartSubType = `${chartConfig.chartType}.${subType}`;
                return (<Radio key={sortingOrder} label={getFieldLabel(`${chartSubType}.${activeSortingType}.${sortingOrder}`)} value={sortingOrder} checked={sortingOrder === activeSortingOrder} disabled={disabled} onChange={(e) => {
                        if (e.currentTarget.checked) {
                            updateSortingOption({
                                sortingType: activeSortingType,
                                sortingOrder,
                            });
                        }
                    }}/>);
            })}
        </RadioGroup>
      </ControlSectionContent>
    </ControlSection>);
};
