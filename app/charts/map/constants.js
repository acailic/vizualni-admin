import { schemeCategory10 } from "d3-scale-chromatic";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
export const DEFAULT_FIXED_COLOR_FIELD_OPACITY = 80;
export const DEFAULT_OTHER_COLOR_FIELD_OPACITY = 100;
export const DEFAULT_FIXED_COLOR_FIELD = {
    type: "fixed",
    value: schemeCategory10[0],
    opacity: DEFAULT_FIXED_COLOR_FIELD_OPACITY,
};
export const getDefaultCategoricalColorField = ({ id, paletteId, dimensionValues, }) => ({
    type: "categorical",
    componentId: id,
    paletteId,
    colorMapping: mapValueIrisToColor({
        paletteId,
        dimensionValues,
    }),
    opacity: DEFAULT_OTHER_COLOR_FIELD_OPACITY,
});
export const getDefaultNumericalColorField = ({ id, colorPalette = {
    type: "sequential",
    paletteId: "oranges",
    name: "oranges",
}, }) => ({
    type: "numerical",
    componentId: id,
    paletteId: colorPalette.paletteId,
    scaleType: "continuous",
    interpolationType: "linear",
    opacity: 100,
});
export const DEFAULT_COLOR = [222, 222, 222, 125];
export const FLY_TO_DURATION = 500;
export const RESET_DURATION = 1500;
