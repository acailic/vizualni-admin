import { ChartSelectionTabs } from "@/components/chart-selection-tabs";
import { ConfiguratorStateProvider } from "@/configurator";
import palmerPenguinsFixture from "@/test/__fixtures/config/int/scatterplot-palmer-penguins.json";
const meta = {
    component: ChartSelectionTabs,
    title: "components / Selection tabs",
    decorators: [
        (Story, ctx) => {
            return (<ConfiguratorStateProvider chartId={palmerPenguinsFixture.key} initialState={ctx.parameters.state} allowDefaultRedirect={false}>
          <Story />
        </ConfiguratorStateProvider>);
        },
    ],
};
export const Editable = {
    args: {},
    parameters: {
        state: {
            ...palmerPenguinsFixture.data,
            state: "CONFIGURING_CHART",
        },
    },
};
export const NonEditable = {
    args: {},
    parameters: {
        state: {
            ...palmerPenguinsFixture.data,
            state: "PUBLISHING",
        },
    },
};
export default meta;
