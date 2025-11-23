import { t } from "@lingui/macro";
import { Stack } from "@mui/material";
import get from "lodash/get";
import { useMemo, useState } from "react";
import { Flex } from "@/components/flex";
import { Checkbox, Input } from "@/components/form";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { useLocale } from "@/locales/use-locale";
import { useEvent } from "@/utils/use-event";
export const ScaleDomain = ({ chartConfig, field, observations, getDefaultDomain, }) => {
    const locale = useLocale();
    const [_, dispatch] = useConfiguratorState(isConfiguring);
    const domain = get(chartConfig, `fields["${field}"].customDomain`);
    const checked = !!domain;
    const disabled = chartConfig.interactiveFiltersConfig.calculation.type === "percent";
    const defaultDomain = useMemo(() => {
        return getDefaultDomain({ chartConfig, observations });
    }, [chartConfig, getDefaultDomain, observations]);
    const handleToggle = useEvent(() => {
        dispatch({
            type: "CHART_FIELD_UPDATED",
            value: {
                locale,
                field,
                path: "customDomain",
                value: checked ? FIELD_VALUE_NONE : defaultDomain,
            },
        });
    });
    const handleChange = useEvent((newDomain) => {
        dispatch({
            type: "CHART_FIELD_UPDATED",
            value: {
                locale,
                field,
                path: "customDomain",
                value: newDomain,
            },
        });
    });
    return (<Stack gap={2} style={disabled ? { opacity: 0.5, pointerEvents: "none" } : {}}>
      <Checkbox label={t({
            id: "controls.adjust-scale-domain",
            message: "Adjust scale domain",
        })} checked={checked} onChange={handleToggle}/>
      {checked ? (<Flex justifyContent="space-between" gap={2}>
          <DomainInput label="min" value={domain[0]} validate={(d) => ({
                error: d < domain[1]
                    ? null
                    : t({
                        id: "controls.adjust-scale-domain.min-error",
                        message: "Min must be smaller than max",
                    }),
            })} onCommit={(d) => handleChange([d, domain[1]])}/>
          <DomainInput label="max" value={domain[1]} validate={(d) => ({
                error: d > domain[0]
                    ? null
                    : t({
                        id: "controls.adjust-scale-domain.max-error",
                        message: "Max must be bigger than min",
                    }),
            })} onCommit={(d) => handleChange([domain[0], d])}/>
        </Flex>) : null}
    </Stack>);
};
const DomainInput = ({ label, value, onCommit, validate, }) => {
    const [inputValue, setInputValue] = useState(`${value}`);
    const [error, setError] = useState(undefined);
    const handleCommit = () => {
        const parsed = parseFloat(inputValue);
        if (isNaN(parsed)) {
            setError(t({
                id: "controls.adjust-scale-domain.invalid-number-error",
                message: "Please enter a valid number",
            }));
            return;
        }
        const { error } = validate(parsed);
        if (error) {
            setError(error);
            return;
        }
        setError(undefined);
        onCommit(parsed);
    };
    return (<Input type="number" label={label} name={label} value={inputValue} onChange={(e) => setInputValue(e.currentTarget.value)} onBlur={handleCommit} onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleCommit();
            }
        }} error={!!error} errorMessage={error}/>);
};
