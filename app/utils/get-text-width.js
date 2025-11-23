import { theme } from "@/themes/theme";
let canvas;
let ctx;
const fontFamily = theme.typography.fontFamily;
export const getTextWidth = (text, options) => {
    if (canvas === undefined && ctx === undefined) {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
    }
    ctx.font = `${options.fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
};
