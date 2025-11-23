import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import get from "lodash/get";
import { useCallback } from "react";
import { Checkbox } from "@/components/form";
import { HintError } from "@/components/hint";
import { isTableConfig, } from "@/config-types";
import { getChartConfig } from "@/config-utils";
import { ColorPalette } from "@/configurator/components/chart-controls/color-palette";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { ChartOptionCheckboxField, ChartOptionSelectField, ColorPickerField, } from "@/configurator/components/field";
import { DimensionValuesMultiFilter, DimensionValuesSingleFilter, TimeFilter, } from "@/configurator/components/filters";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { TableSortingOptions } from "@/configurator/table/table-chart-sorting-options";
import { updateIsGroup, updateIsHidden, } from "@/configurator/table/table-config-state";
import { isDimension, isNumericalMeasure, isTemporalDimension, isTemporalEntityDimension, } from "@/domain/data";
import { getDefaultCategoricalPalette, getDefaultCategoricalPaletteId, getDefaultDivergingSteppedPalette, } from "@/palettes";
const useTableColumnGroupHiddenField = ({ path, field, dimensions, measures, }) => {
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const onChange = useCallback((e) => {
        if (!isTableConfig(chartConfig)) {
            return;
        }
        const updater = path === "isGroup" ? updateIsGroup : updateIsHidden;
        const newChartConfig = updater(chartConfig, {
            field,
            value: e.currentTarget.checked,
        });
        dispatch({
            type: "CHART_CONFIG_REPLACED",
            value: {
                chartConfig: newChartConfig,
                dataCubesComponents: {
                    dimensions,
                    measures,
                },
            },
        });
    }, [chartConfig, path, field, dispatch, dimensions, measures]);
    const stateValue = get(chartConfig, `fields["${field}"].${path}`, "");
    const checked = stateValue ? stateValue : false;
    return {
        name: path,
        checked,
        onChange,
    };
};
const ChartOptionGroupHiddenField = ({ label, field, path, defaultChecked, disabled = false, dimensions, measures, }) => {
    var _a;
    const fieldProps = useTableColumnGroupHiddenField({
        field,
        path,
        dimensions,
        measures,
    });
    return (<Checkbox disabled={disabled} label={label} {...fieldProps} checked={(_a = fieldProps.checked) !== null && _a !== void 0 ? _a : defaultChecked}/>);
};
export const TableColumnOptions = ({ state, dimensions, measures, }) => {
    var _a;
    const chartConfig = getChartConfig(state);
    const { activeField: _activeField } = chartConfig;
    const activeField = _activeField;
    if (!activeField || chartConfig.chartType !== "table") {
        return null;
    }
    // FIXME: table encoding should be added to UI encodings
    // @ts-ignore
    if (activeField === "table-sorting") {
        return (<TableSortingOptions state={state} dimensions={dimensions} measures={measures}/>);
    }
    const activeFieldComponentId = (_a = chartConfig.fields[activeField]) === null || _a === void 0 ? void 0 : _a.componentId;
    // It's a dimension which is not mapped to an encoding field, so we show the filter!
    // FIXME: activeField and encodingField should match? to remove type assertion
    if (!activeFieldComponentId) {
        return null;
    }
    // Active field is always a component id, like in filters
    const allComponents = [...dimensions, ...measures];
    const component = allComponents.find((d) => d.id === activeField);
    if (!component) {
        return <HintError smaller>No component {activeField}</HintError>;
    }
    const { isGroup, isHidden } = chartConfig.fields[activeField];
    const columnStyleOptions = isNumericalMeasure(component)
        ? [
            {
                value: "text",
                label: t({ id: "columnStyle.text", message: `Text` }),
            },
            {
                value: "heatmap",
                label: t({ id: "columnStyle.heatmap", message: `Heat Map` }),
            },
            {
                value: "bar",
                label: t({ id: "columnStyle.bar", message: `Bar Chart` }),
            },
        ]
        : isTemporalDimension(component)
            ? [
                {
                    value: "text",
                    label: t({ id: "columnStyle.text", message: `Text` }),
                },
            ]
            : [
                {
                    value: "text",
                    label: t({ id: "columnStyle.text", message: `Text` }),
                },
                {
                    value: "category",
                    label: t({ id: "columnStyle.categories", message: `Categories` }),
                },
            ];
    return (<div key={`control-panel-table-column-${activeField}`} role="tabpanel" id={`control-panel-table-column-${activeField}`} aria-labelledby={`tab-${activeField}`} tabIndex={-1}>
      <ControlSection hideTopBorder>
        <SectionTitle closable>{component.label}</SectionTitle>
        <ControlSectionContent>
          {component.__typename !== "NumericalMeasure" && (<ChartOptionGroupHiddenField label={t({
                id: "controls.table.column.group",
                message: "Use to group",
            })} field={activeField} path="isGroup" dimensions={dimensions} measures={measures}/>)}
          <ChartOptionGroupHiddenField label={t({
            id: "controls.table.column.hide",
            message: "Hide column",
        })} field={activeField} path="isHidden" dimensions={dimensions} measures={measures}/>
        </ControlSectionContent>
      </ControlSection>
      {(isGroup || !isHidden) && (<ControlSection collapse>
          <SectionTitle iconName="formatting">
            <Trans id="controls.section.columnstyle">Column Style</Trans>
          </SectionTitle>
          <ControlSectionContent sx={{ mt: 2 }}>
            <ChartOptionSelectField id="columnStyle" label={t({
                id: "controls.select.columnStyle",
                message: "Column Style",
            })} options={columnStyleOptions} getValue={(type) => {
                switch (type) {
                    case "text":
                        return {
                            type: "text",
                            textStyle: "regular",
                            textColor: "#333",
                            columnColor: "#fff",
                        };
                    case "category":
                        const paletteId = getDefaultCategoricalPaletteId(component);
                        return {
                            type: "category",
                            textStyle: "regular",
                            paletteId,
                            colorMapping: mapValueIrisToColor({
                                paletteId,
                                dimensionValues: component.values,
                            }),
                        };
                    case "heatmap":
                        return {
                            type: "heatmap",
                            textStyle: "regular",
                            paletteId: getDefaultDivergingSteppedPalette().value,
                        };
                    case "bar":
                        return {
                            type: "bar",
                            textStyle: "regular",
                            barColorPositive: getDefaultCategoricalPalette().colors[0],
                            barColorNegative: getDefaultCategoricalPalette().colors[1],
                            barColorBackground: "#ccc",
                            barShowBackground: false,
                        };
                    default:
                        return undefined;
                }
            }} getKey={(d) => d.type} field={activeField} path="columnStyle"/>
            <ColumnStyleSubOptions chartConfig={chartConfig} activeField={activeField} component={component}/>
          </ControlSectionContent>
        </ControlSection>)}
      {isTemporalDimension(component) ||
            isTemporalEntityDimension(component) ? (<ControlSection collapse>
          <SectionTitle disabled={!component} iconName="filter">
            <Trans id="controls.section.filter">Filter</Trans>
          </SectionTitle>
          <ControlSectionContent component="fieldset">
            <legend style={{ display: "none" }}>
              <Trans id="controls.section.filter">Filter</Trans>
            </legend>
            <TimeFilter dimension={component}/>
          </ControlSectionContent>
        </ControlSection>) : isDimension(component) ? (<ControlSection collapse>
          <SectionTitle disabled={!component} iconName="filter">
            <Trans id="controls.section.filter">Filter</Trans>
          </SectionTitle>
          <ControlSectionContent component="fieldset">
            <legend style={{ display: "none" }}>
              <Trans id="controls.section.filter">Filter</Trans>
            </legend>
            {component.isKeyDimension && isHidden && !isGroup ? (<DimensionValuesSingleFilter dimension={component}/>) : (<DimensionValuesMultiFilter field={component.id} dimension={component} colorComponent={component} colorConfigPath="columnStyle"/>)}
          </ControlSectionContent>
        </ControlSection>) : null}
    </div>);
};
const ColumnStyleSubOptions = ({ chartConfig, activeField, component, }) => {
    const type = chartConfig.fields[activeField].columnStyle.type;
    return (<>
      <ChartOptionSelectField id="columnStyle.textStyle" label={t({
            id: "controls.select.columnStyle.textStyle",
            message: "Text Style",
        })} options={[
            {
                value: "regular",
                label: t({
                    id: "columnStyle.textStyle.regular",
                    message: `Regular`,
                }),
            },
            {
                value: "bold",
                label: t({ id: "columnStyle.textStyle.bold", message: `Bold` }),
            },
        ]} field={activeField} path="columnStyle.textStyle"/>
      {type === "text" ? (<>
          <ColorPickerField label={t({
                id: "controls.select.columnStyle.textColor",
                message: "Text Color",
            })} field={activeField} path="columnStyle.textColor"/>
          <ColorPickerField label={t({
                id: "controls.select.columnStyle.columnColor",
                message: "Column Background",
            })} field={activeField} path="columnStyle.columnColor"/>
        </>) : type === "category" ? (<>
          <ColorPalette field={activeField} colorConfigPath="columnStyle" component={component}/>
        </>) : type === "heatmap" ? (<>
          <ColorPalette field={activeField} colorConfigPath="columnStyle" component={component}/>
        </>) : type === "bar" ? (<Box my={2}>
          <ColorPickerField label={t({
                id: "controls.select.columnStyle.barColorPositive",
                message: "Positive Bar Color",
            })} field={activeField} path="columnStyle.barColorPositive"/>
          <ColorPickerField label={t({
                id: "controls.select.columnStyle.barColorNegative",
                message: "Negative Bar Color",
            })} field={activeField} path="columnStyle.barColorNegative"/>
          <ColorPickerField label={t({
                id: "controls.select.columnStyle.barColorBackground",
                message: "Bar Background",
            })} field={activeField} path="columnStyle.barColorBackground"/>
          <ChartOptionCheckboxField label={t({
                id: "controls.select.columnStyle.barShowBackground",
                message: "Show Bar Background",
            })} field={activeField} path="columnStyle.barShowBackground"/>
        </Box>) : null}
    </>);
};
