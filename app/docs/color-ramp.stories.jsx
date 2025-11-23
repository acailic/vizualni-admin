import { interpolateBrBG, interpolateOranges } from "d3-scale-chromatic";
import { ColorRamp } from "@/configurator/components/chart-controls/color-ramp";
const meta = {
    component: ColorRamp,
    title: "components / ColorRamp",
};
export default meta;
export const Continuous = {
    args: {
        colorInterpolator: interpolateOranges,
    },
};
export const Discrete = {
    args: {
        colorInterpolator: interpolateOranges,
        nSteps: 5,
    },
};
export const Custom = {
    args: {
        colorInterpolator: interpolateBrBG,
        width: 100,
        height: 100,
    },
};
export const Disabled = {
    args: {
        colorInterpolator: interpolateBrBG,
        width: 100,
        height: 100,
        disabled: true,
    },
};
