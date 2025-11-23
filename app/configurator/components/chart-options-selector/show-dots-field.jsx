import { t, Trans } from "@lingui/macro";
import { Stack, Typography } from "@mui/material";
import { RadioGroup } from "@/components/form";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { ChartOptionRadioField, ChartOptionSwitchField, } from "@/configurator/components/field";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { useLocale } from "@/locales/use-locale";
export const ShowDotsField = ({ fields, field, }) => {
    const locale = useLocale();
    const [_, dispatch] = useConfiguratorState(isConfiguring);
    const disabled = "y" in fields &&
        (!("showDots" in fields.y) ||
            ("showDots" in fields.y && !fields.y.showDots));
    return (<ControlSection collapse>
      <SectionTitle iconName="lineChart">
        <Trans id="controls.section.data-points">Data Points</Trans>
      </SectionTitle>
      <ControlSectionContent>
        <Stack direction="column" gap={4}>
          <ChartOptionSwitchField path="showDots" field={field} onChange={(e) => {
            const { checked } = e.target;
            if ("y" in fields && !("showDots" in fields.y)) {
                const value = "Large";
                dispatch({
                    type: "CHART_FIELD_UPDATED",
                    value: {
                        locale,
                        field: "y",
                        path: "showDotsSize",
                        value,
                    },
                });
            }
            dispatch({
                type: "CHART_FIELD_UPDATED",
                value: {
                    locale,
                    field,
                    path: "showDots",
                    value: checked,
                },
            });
        }} label={t({ id: "controls.section.show-dots" })}/>
          <Typography variant="caption" sx={{ mt: 2 }}>
            <Trans id="controls.section.dots-size">Select a Size</Trans>
          </Typography>
          <RadioGroup>
            <ChartShowDotRadio size="Small" label={t({
            id: "controls.section.dots-size.small",
            message: "Small",
        })} disabled={disabled}/>
            <ChartShowDotRadio size="Medium" label={t({
            id: "controls.section.dots-size.medium",
            message: "Medium",
        })} disabled={disabled}/>
            <ChartShowDotRadio size="Large" label={t({
            id: "controls.section.dots-size.large",
            message: "Large",
        })} disabled={disabled}/>
          </RadioGroup>
        </Stack>
      </ControlSectionContent>
    </ControlSection>);
};
const ChartShowDotRadio = ({ size, label, disabled, }) => {
    return (<ChartOptionRadioField key={size} field="y" path="showDotsSize" value={size} label={label} disabled={disabled}/>);
};
