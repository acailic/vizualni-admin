import { typography as typographyConstants } from "@/themes/constants";
function overrideFontFamily(typography) {
    return {
        ...Object.fromEntries(Object.entries(typography).map(([variant, responsiveFontProps]) => [
            variant,
            Object.fromEntries(Object.entries(responsiveFontProps).map(([breakpoint, fontProps]) => [
                breakpoint,
                {
                    ...fontProps,
                },
            ])),
        ])),
        fontFamily: typographyConstants.fontFamily,
    };
}
export const typography = overrideFontFamily(typographyConstants);
