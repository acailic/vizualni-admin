import { ChartOptionCheckboxField } from "@/configurator/components/field";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { canUseAbbreviations } from "@/configurator/components/ui-helpers";
export const Abbreviations = ({ field, path, component, }) => {
    const disabled = !canUseAbbreviations(component);
    return (<ChartOptionCheckboxField data-testid="use-abbreviations" label={getFieldLabel("abbreviations")} field={field} path={path ? `${path}.useAbbreviations` : "useAbbreviations"} disabled={disabled}/>);
};
