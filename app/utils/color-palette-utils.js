import { rgb } from "d3-color";
import { nanoid } from "nanoid";
import { createDivergingInterpolator, createSequentialInterpolator, } from "@/palettes";
const SRGB_THRESHOLD = 0.03928;
const SRGB_SCALE_FACTOR = 12.92;
const GAMMA = 2.4;
const GAMMA_SCALE = 1.055;
const GAMMA_OFFSET = 0.055;
const RED_LUMINANCE_FACTOR = 0.2126;
const GREEN_LUMINANCE_FACTOR = 0.7152;
const BLUE_LUMINANCE_FACTOR = 0.0722;
const CONTRAST_OFFSET = 0.05;
const MIN_CONTRAST = 2;
const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= SRGB_THRESHOLD
            ? c / SRGB_SCALE_FACTOR
            : Math.pow((c + GAMMA_OFFSET) / GAMMA_SCALE, GAMMA);
    });
    return (RED_LUMINANCE_FACTOR * rs +
        GREEN_LUMINANCE_FACTOR * gs +
        BLUE_LUMINANCE_FACTOR * bs);
};
const getContrastRatio = (l1, l2) => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + CONTRAST_OFFSET) / (darker + CONTRAST_OFFSET);
};
export const hasEnoughContrast = (color, conrtastingHexColor = "#ffffffe6") => {
    const contrastRgbColor = rgb(conrtastingHexColor);
    const { r, g, b } = contrastRgbColor;
    const whiteLuminance = getLuminance(r, g, b);
    const rgbColor = rgb(color);
    const colorLuminance = getLuminance(rgbColor.r, rgbColor.g, rgbColor.b);
    const contrastWithWhite = getContrastRatio(whiteLuminance, colorLuminance);
    return contrastWithWhite < MIN_CONTRAST;
};
export const createColorId = () => nanoid(4);
export const getFittingColorInterpolator = (config, getColorInterpolator) => {
    var _a, _b, _c, _d, _e;
    if (config.color) {
        if (config.color.colors) {
            if (config.color.paletteType === "sequential") {
                return createSequentialInterpolator({
                    endColorHex: config.color.colors[0],
                    startColorHex: config.color.colors[1],
                }).interpolator;
            }
            if (config.color.paletteType === "diverging") {
                return createDivergingInterpolator({
                    endColorHex: config.color.colors[0],
                    startColorHex: config.color.colors[1],
                    options: {
                        midColorHex: (_a = config.color.colors[2]) !== null && _a !== void 0 ? _a : undefined,
                    },
                }).interpolator;
            }
        }
        return getColorInterpolator(config.color.paletteId);
    }
    if ((_b = config.currentPalette) === null || _b === void 0 ? void 0 : _b.interpolator) {
        return config.currentPalette.interpolator;
    }
    if (config.customPalette) {
        if (config.customPalette.type === "sequential") {
            return createSequentialInterpolator({
                endColorHex: config.customPalette.colors[0],
                startColorHex: config.customPalette.colors[1],
            }).interpolator;
        }
        if (config.customPalette.type === "diverging") {
            return createDivergingInterpolator({
                endColorHex: config.customPalette.colors[0],
                startColorHex: config.customPalette.colors[1],
                options: {
                    midColorHex: (_c = config.customPalette.colors[2]) !== null && _c !== void 0 ? _c : undefined,
                },
            }).interpolator;
        }
    }
    return (_e = (_d = config.defaultPalette) === null || _d === void 0 ? void 0 : _d.interpolator) !== null && _e !== void 0 ? _e : getColorInterpolator("default");
};
