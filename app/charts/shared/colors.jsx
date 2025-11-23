import { color } from "d3-color";
export const colorToRgbArray = (_color, opacity) => {
    const { r, g, b } = color(_color);
    return opacity !== undefined ? [r, g, b, opacity] : [r, g, b];
};
export const rgbArrayToHex = (rgbArray) => {
    switch (rgbArray.length) {
        case 3:
            return `rgb(${rgbArray.join(",")})`;
        case 4:
            return `rgba(${rgbArray.join(",")})`;
        default:
            throw Error(`You need to pass 3 or 4 arguments when converting RGB array to HEX, while ${rgbArray.length} were provided.`);
    }
};
export const hasDimensionColors = (d) => {
    var _a;
    return !!((_a = d === null || d === void 0 ? void 0 : d.values) === null || _a === void 0 ? void 0 : _a.some((d) => d.color !== undefined));
};
