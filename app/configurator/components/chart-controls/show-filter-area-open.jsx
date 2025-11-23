import { t } from "@lingui/macro";
import { ChartOptionCheckboxField } from "@/configurator/components/field";
export const ShowFilterAreaOpen = ({ chartConfig, }) => (<ChartOptionCheckboxField label={t({
        id: "controls.section.data.filters.default-open",
        message: "Show filter area open",
    })} field={null} path="interactiveFiltersConfig.dataFilters.defaultOpen" disabled={!chartConfig.interactiveFiltersConfig.dataFilters.active}/>);
