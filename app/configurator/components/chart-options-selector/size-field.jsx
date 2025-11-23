import { t } from "@lingui/macro";
import { useCallback, useMemo } from "react";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { ChartOptionSelectField } from "@/configurator/components/field";
import { getComponentsFilteredByType, } from "@/domain/data";
export const SizeField = ({ chartConfig, field, componentTypes, dimensions, measures, getFieldOptionGroups, optional, }) => {
    const fieldComponents = useMemo(() => {
        return getComponentsFilteredByType({
            dimensionTypes: componentTypes,
            dimensions,
            measures,
        });
    }, [componentTypes, dimensions, measures]);
    const getOption = useCallback((c) => ({ value: c.id, label: c.label }), []);
    const options = useMemo(() => {
        return chartConfig.cubes.length === 1 ? fieldComponents.map(getOption) : [];
    }, [chartConfig.cubes.length, fieldComponents, getOption]);
    const optionGroups = useMemo(() => {
        return chartConfig.cubes.length > 1
            ? getFieldOptionGroups({ fieldComponents, getOption })
            : undefined;
    }, [
        chartConfig.cubes.length,
        fieldComponents,
        getFieldOptionGroups,
        getOption,
    ]);
    return (<ControlSection collapse>
      <SectionTitle iconName="size">
        {t({
            id: "controls.size",
            message: "Size",
        })}
      </SectionTitle>
      <ControlSectionContent>
        <ChartOptionSelectField id="size-measure" label={t({
            id: "controls.select.measure",
            message: "Select a measure",
        })} field={field} path="measureId" options={options} optionGroups={optionGroups} optional={optional}/>
      </ControlSectionContent>
    </ControlSection>);
};
