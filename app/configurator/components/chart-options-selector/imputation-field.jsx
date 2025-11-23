import { t, Trans } from "@lingui/macro";
import get from "lodash/get";
import { useCallback } from "react";
import { Select } from "@/components/form";
import { IMPUTATION_TYPES } from "@/config-types";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
export const ImputationField = ({ chartConfig, }) => {
    const [, dispatch] = useConfiguratorState(isConfiguring);
    const getImputationTypeLabel = (type) => {
        switch (type) {
            case "none":
                return t({
                    id: "controls.imputation.type.none",
                    message: "-",
                });
            case "zeros":
                return t({
                    id: "controls.imputation.type.zeros",
                    message: "Zeros",
                });
            case "linear":
                return t({
                    id: "controls.imputation.type.linear",
                    message: "Linear interpolation",
                });
            default:
                const _exhaustiveCheck = type;
                return _exhaustiveCheck;
        }
    };
    const updateImputationType = useCallback((type) => {
        dispatch({
            type: "IMPUTATION_TYPE_CHANGED",
            value: {
                type,
            },
        });
    }, [dispatch]);
    const imputationType = get(chartConfig, ["fields", "y", "imputationType"], "none");
    return (<ControlSection collapse>
      <SectionTitle iconName="infoCircle" warnMessage={imputationType === "none"
            ? t({
                id: "controls.section.imputation.explanation",
                message: "For this chart type, replacement values should be assigned to missing values. Decide on the imputation logic or switch to another chart type.",
            })
            : undefined}>
        <Trans id="controls.section.imputation">Missing values</Trans>
      </SectionTitle>
      <ControlSectionContent component="fieldset" gap="none">
        <Select id="imputation-type" label={getFieldLabel("imputation")} options={IMPUTATION_TYPES.map((d) => ({
            value: d,
            label: getImputationTypeLabel(d),
        }))} value={imputationType} onChange={(e) => {
            updateImputationType(e.target.value);
        }}/>
      </ControlSectionContent>
    </ControlSection>);
};
