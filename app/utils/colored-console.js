import * as fs from "fs";
import { color as d3color } from "d3-color";
import { schemeCategory10 } from "d3-scale-chromatic";
import { truthy } from "@/domain/types";
import { isComponentId, parseComponentId, stringifyComponentId, } from "@/graphql/make-component-id";
// ANSI color control functions
const rgbControlSegment = (r, g, b) => {
    return `\x1b[38;2;${r};${g};${b};249m`;
};
const RESET_COLOR = "\x1b[0m";
// Generate color palette from d3 scheme
const createColorPalette = (colorScheme) => {
    const colors = colorScheme
        .map((color, i) => {
        const c = d3color(color);
        if (!c)
            return null;
        const rgb = c.rgb();
        return [`color${i}`, rgbControlSegment(rgb.r, rgb.g, rgb.b)];
    })
        .filter(truthy);
    return {
        reset: RESET_COLOR,
        ...Object.fromEntries(colors),
    };
};
const createColorManager = (options) => {
    const { palette, persistPath } = options;
    const colorNames = Object.keys(palette).filter((x) => x !== "reset");
    let textColorMap = {};
    const assignedColors = new Set();
    const availableColors = [...colorNames];
    // Load existing color mappings if persistence is enabled
    if (persistPath) {
        try {
            if (fs.existsSync(persistPath)) {
                const fileContent = fs.readFileSync(persistPath, "utf-8");
                textColorMap = JSON.parse(fileContent);
                // Update assigned and available colors
                Object.values(textColorMap).forEach((color) => assignedColors.add(color));
                availableColors.length = 0;
                colorNames.forEach((color) => {
                    if (!assignedColors.has(color)) {
                        availableColors.push(color);
                    }
                });
            }
        }
        catch (error) {
            console.error("Error loading colors file:", error);
        }
    }
    return (text) => {
        // If text already has a color, return it
        if (textColorMap[text]) {
            return textColorMap[text];
        }
        // Assign a new color
        let newColor;
        if (availableColors.length > 0) {
            // Use available color if possible
            newColor = availableColors.shift();
        }
        else {
            // Reuse colors if we run out
            newColor =
                colorNames[Object.keys(textColorMap).length % colorNames.length];
        }
        // Save the mapping
        textColorMap[text] = newColor;
        assignedColors.add(newColor);
        // Write to disk if persistence enabled
        if (persistPath) {
            try {
                fs.writeFileSync(persistPath, JSON.stringify(textColorMap, null, 2));
            }
            catch (error) {
                console.error("Error saving colors file:", error);
            }
        }
        return newColor;
    };
};
// Text coloring function factory
const createTextColorizer = (colorAssigner, palette) => {
    return (text) => {
        const colorKey = colorAssigner(text);
        return `${palette[colorKey] || ""}${text}${palette.reset}`;
    };
};
const createColoredConsole = (originalLog, options) => {
    const palette = createColorPalette(options.palette);
    const colorAssigner = createColorManager({
        palette,
        persistPath: "/tmp/colors.txt",
    });
    const colorizeText = createTextColorizer(colorAssigner, palette);
    return (...args) => {
        const newArgs = args.map((arg) => {
            if (typeof arg === "string") {
                let result = arg;
                for (const { pattern, handler } of options.matchers) {
                    result = result.replace(pattern, (m) => handler(m, colorizeText));
                }
                return result;
            }
            return arg;
        });
        originalLog(...newArgs);
    };
};
// URL handling
const urlPattern = /(https?:\/\/[^\s"]+)|(joinBy__\d+)/g;
const urlHandler = (url, colorizeText) => {
    if (isComponentId(url)) {
        const parsed = parseComponentId(url);
        return stringifyComponentId({
            unversionedCubeIri: colorizeText(parsed.unversionedCubeIri),
            unversionedComponentIri: parsed.unversionedComponentIri
                ? colorizeText(parsed.unversionedComponentIri)
                : "",
        });
    }
    return colorizeText(url);
};
// Set up colored console with URL matcher
export const logger = createColoredConsole(console.log, {
    palette: schemeCategory10,
    matchers: [{ pattern: urlPattern, handler: urlHandler }],
});
