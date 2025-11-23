import { Trans } from "@lingui/macro";
import { Typography } from "@mui/material";
import { Flex } from "@/components/flex";
import { RadioGroup } from "@/components/form";
import { isBarConfig, isColorInConfig, } from "@/config-types";
import { ColorPalette } from "@/configurator/components/chart-controls/color-palette";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { ChartOptionRadioField, ColorPickerField, } from "@/configurator/components/field";
import { getFieldLabel } from "@/configurator/components/field-i18n";
export const LayoutField = ({ encoding, component, chartConfig, components, hasColorPalette, hasSubType, measures, }) => {
    const activeField = chartConfig.activeField;
    if (!activeField) {
        return null;
    }
    const hasColorField = isColorInConfig(chartConfig);
    const values = hasColorField
        ? chartConfig.fields.color.type === "single"
            ? [
                {
                    id: isBarConfig(chartConfig)
                        ? chartConfig.fields.x.componentId
                        : chartConfig.fields.y.componentId,
                    symbol: "line",
                },
            ]
            : Object.keys(chartConfig.fields.color.colorMapping).map((key) => ({
                id: key,
                symbol: "line",
            }))
        : [];
    return encoding.options || hasColorPalette ? (<ControlSection collapse>
      <SectionTitle iconName="swatch">
        <Trans id="controls.section.layout-options">Layout Options</Trans>
      </SectionTitle>
      <ControlSectionContent gap="lg">
        {hasSubType && (<ChartSubType encoding={encoding} chartConfig={chartConfig} components={components} disabled={!component}/>)}
        <ColorPalette field={activeField} 
    // Faking a component here, because we don't have a real one.
    // We use measure iris as dimension values, because that's how
    // the color mapping is done.
    component={{
            __typename: "",
            values: values.map(({ id }) => ({
                value: id,
                label: id,
            })),
        }}/>
        {hasColorField && chartConfig.fields.color.type === "single" && (<ColorPickerField field="color" path="color" label={measures.find((d) => d.id === values[0].id).label}/>)}
      </ControlSectionContent>
    </ControlSection>) : null;
};
const ChartSubType = ({ encoding, chartConfig, components, disabled, }) => {
    var _a;
    const chartSubType = (_a = encoding.options) === null || _a === void 0 ? void 0 : _a.chartSubType;
    const values = chartSubType.getValues(chartConfig, components);
    return (<Flex flexDirection="column" sx={{ gap: 1 }}>
      <Typography variant="caption">
        <Trans id="controls.select.column.layout">Column layout</Trans>
      </Typography>
      <RadioGroup>
        {values.map((d) => (<ChartOptionRadioField key={d.value} label={getFieldLabel(d.value)} field={encoding.field} path="type" value={d.value} disabled={disabled || d.disabled} warnMessage={d.warnMessage}/>))}
      </RadioGroup>
    </Flex>);
};
