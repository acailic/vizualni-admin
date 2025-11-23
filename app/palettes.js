import { rgbToHex } from "@mui/material";
import { hsl } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { interpolateBlues, interpolateBrBG, interpolateGreens, interpolateGreys, interpolateOranges, interpolatePiYG, interpolatePRGn, interpolatePuOr, interpolatePurples, interpolateRdBu, interpolateRdYlBu, interpolateRdYlGn, interpolateReds, schemeAccent, schemeCategory10, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, schemeTableau10, } from "d3-scale-chromatic";
import { hasDimensionColors } from "./charts/shared/colors";
import { createColorId } from "./utils/color-palette-utils";
// Colors
export const getDefaultCategoricalPaletteId = (d, previousPaletteName) => {
    const hasColors = hasDimensionColors(d);
    return hasColors
        ? "dimension"
        : previousPaletteName || DEFAULT_CATEGORICAL_PALETTE_ID;
};
export const getDefaultCategoricalPalette = (colors) => {
    if (colors) {
        return {
            label: "default",
            value: "dimension",
            colors: colors.slice(0, 10),
        };
    }
    else {
        return categoricalPalettes[0];
    }
};
export const getPalette = ({ paletteId, colorField, colors, fallbackPalette, }) => {
    if ((colorField === null || colorField === void 0 ? void 0 : colorField.type) === "single") {
        return [colorField.color];
    }
    else {
        switch (paletteId) {
            case "dimension":
                return getDefaultCategoricalPalette(colors).colors;
            case "accent":
                return schemeAccent;
            case "category10":
                return schemeCategory10;
            case "dark2":
                return schemeDark2;
            case "paired":
                return schemePaired;
            case "pastel1":
                return schemePastel1;
            case "pastel2":
                return schemePastel2;
            case "set1":
                return schemeSet1;
            case "set2":
                return schemeSet2;
            case "set3":
                return schemeSet3;
            case "tableau10":
                return schemeTableau10;
            default:
                return fallbackPalette !== null && fallbackPalette !== void 0 ? fallbackPalette : schemeCategory10;
        }
    }
};
export const categoricalPalettes = [
    {
        label: "category10",
        value: "category10",
        colors: getPalette({ paletteId: "category10" }),
    },
    {
        label: "accent",
        value: "accent",
        colors: getPalette({ paletteId: "accent" }),
    },
    {
        label: "dark2",
        value: "dark2",
        colors: getPalette({ paletteId: "dark2" }),
    },
    {
        label: "paired",
        value: "paired",
        colors: getPalette({ paletteId: "paired" }),
    },
    {
        label: "pastel1",
        value: "pastel1",
        colors: getPalette({ paletteId: "pastel1" }),
    },
    {
        label: "pastel2",
        value: "pastel2",
        colors: getPalette({ paletteId: "pastel2" }),
    },
    { label: "set1", value: "set1", colors: getPalette({ paletteId: "set1" }) },
    { label: "set2", value: "set2", colors: getPalette({ paletteId: "set2" }) },
    { label: "set3", value: "set3", colors: getPalette({ paletteId: "set3" }) },
];
export const DEFAULT_CATEGORICAL_PALETTE_ID = categoricalPalettes[0].value;
const steppedPaletteSteps = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const divergingPaletteKeys = [
    "RdBu",
    "RdYlBu",
    "RdYlGn",
    "BrBG",
    "PRGn",
    "PiYG",
    "PuOr",
];
const sequentialPaletteKeys = [
    "blues",
    "greens",
    "greys",
    "oranges",
    "purples",
    "reds",
];
const interpolatorByName = {
    RdBu: interpolateRdBu,
    RdYlBu: interpolateRdYlBu,
    RdYlGn: interpolateRdYlGn,
    BrBG: interpolateBrBG,
    PRGn: interpolatePRGn,
    PiYG: interpolatePiYG,
    PuOr: interpolatePuOr,
    blues: interpolateBlues,
    greens: interpolateGreens,
    greys: interpolateGreys,
    oranges: interpolateOranges,
    purples: interpolatePurples,
    reds: interpolateReds,
};
const defaultInterpolator = interpolatorByName["oranges"];
export const getColorInterpolator = (paletteId) => {
    var _a;
    const interpolator = (_a = interpolatorByName[paletteId]) !== null && _a !== void 0 ? _a : defaultInterpolator;
    // If the palette is sequential, we artificially clamp the value not to display too
    // white a value
    const isSequential = paletteId
        ? sequentialPaletteKeys.includes(paletteId)
        : false;
    return isSequential
        ? (n) => interpolator(n * 0.8 + 0.2)
        : interpolator;
};
export const divergingPalettes = divergingPaletteKeys.map((d) => ({
    label: d,
    value: d,
    interpolator: getColorInterpolator(d),
}));
export const divergingSteppedPalettes = divergingPaletteKeys.map((d) => ({
    label: d,
    value: d,
    colors: steppedPaletteSteps.map((s) => getColorInterpolator(d)(s)),
}));
export const getDefaultDivergingSteppedPalette = () => divergingSteppedPalettes[0];
export const sequentialPalettes = sequentialPaletteKeys.map((d) => ({
    label: d,
    value: d,
    interpolator: getColorInterpolator(d),
}));
const LIGHTNESS_INCREASE = 0.9;
const MIN_SATURATION = 0.15;
const MAX_LIGHTNESS = 0.95;
export const createSequentialInterpolator = ({ endColorHex, startColorHex, }) => {
    const endHsl = hsl(endColorHex);
    const startHsl = startColorHex
        ? hsl(startColorHex)
        : hsl(endHsl.h, Math.max(MIN_SATURATION, endHsl.s * 0.3), Math.min(MAX_LIGHTNESS, endHsl.l + LIGHTNESS_INCREASE));
    const startColorRgb = startHsl.toString();
    const startingColorHex = rgbToHex(startColorRgb);
    return {
        interpolator: interpolateRgb(startingColorHex, endColorHex),
        startingColorHex,
    };
};
export const createDivergingInterpolator = ({ startColorHex, endColorHex, options = {}, }) => {
    const { midColorHex } = options;
    if (midColorHex) {
        const leftInterpolator = interpolateRgb(startColorHex, midColorHex);
        const rightInterpolator = interpolateRgb(midColorHex, endColorHex);
        return {
            interpolator: (t) => {
                if (t <= 0.5) {
                    return leftInterpolator(t * 2);
                }
                return rightInterpolator((t - 0.5) * 2);
            },
        };
    }
    return {
        interpolator: interpolateRgb(startColorHex, endColorHex),
    };
};
export const getDefaultColorValues = (type, colors) => {
    const defaults = {
        sequential: ["#000000"],
        diverging: ["#000000", "#cccccc", "#777777"],
        categorical: [],
    };
    const createColorItems = (colorStrings) => colorStrings.map((color) => ({ color, id: createColorId() }));
    if (colors.length === 0) {
        return createColorItems(defaults[type]);
    }
    switch (type) {
        case "sequential":
            return createColorItems([colors[0]]);
        case "diverging":
            if (colors.length === 2) {
                return createColorItems(colors);
            }
            else if (colors.length >= 3) {
                return createColorItems([
                    colors[0],
                    colors[Math.floor(colors.length / 2)],
                    colors[colors.length - 1],
                ]);
            }
            else {
                return createColorItems([
                    colors[0],
                    defaults.diverging[1],
                    defaults.diverging[2],
                ]);
            }
        case "categorical":
            return createColorItems(colors);
        default:
            const _exhaustiveCheck = type;
            return _exhaustiveCheck;
    }
};
