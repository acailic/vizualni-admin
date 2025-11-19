import { type Typography } from "@mui/material/styles/createTypography";

import { typography as typographyConstants } from "@/themes/constants";

function overrideFontFamily(typography: typeof typographyConstants) {
  return {
    ...(Object.fromEntries(
      Object.entries(typography).map(([variant, responsiveFontProps]) => [
        variant,
        Object.fromEntries(
          Object.entries(responsiveFontProps).map(([breakpoint, fontProps]) => [
            breakpoint,
            {
              ...(fontProps as object),
            },
          ])
        ),
      ])
    ) as unknown as Typography),
    fontFamily: typographyConstants.fontFamily,
  };
}

export const typography: Typography = overrideFontFamily(typographyConstants);
