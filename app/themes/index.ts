import type {} from "@mui/lab/themeAugmentation";
import { useTheme } from "@mui/material";

// Type definitions for custom theme properties
type FederalColor = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

type FederalTypographyVariants = {
  h1: object;
  h2: object;
  h3: object;
  h4: object;
  h5: object;
  h6: object;
  subtitle1: object;
  subtitle2: object;
  body1: object;
  body2: object;
  body3: object;
  caption: object;
  button: object;
  overline: object;
};

type FederalTypographyVariantsOptions = FederalTypographyVariants;

type FederalTypographyPropsVariantOverrides = {
  h1: true;
  h2: true;
  h3: true;
  h4: true;
  h5: true;
  h6: true;
  subtitle1: true;
  subtitle2: true;
  body1: true;
  body2: true;
  body3: true;
  caption: true;
  button: true;
  overline: true;
};

type FederalBreakpointOverrides = {
  xs: true;
  sm: true;
  md: true;
  lg: true;
  xl: true;
};

declare module "@mui/material" {
  interface TypographyVariants extends FederalTypographyVariants {}

  interface TypographyVariantsOptions
    extends FederalTypographyVariantsOptions {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    primary: true;
    secondary: true;
    inherit: true;

    success: false;
    error: true;
    info: false;
    warning: false;
  }

  interface ButtonPropsSizeOverrides {
    small: true;
    medium: true;
    large: true;

    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

declare module "@mui/material/InputBase" {
  interface InputBasePropsSizeOverrides {
    small: false;
    medium: false;

    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides
    extends FederalTypographyPropsVariantOverrides {}
}

declare module "@mui/material/styles" {
  interface BreakpointOverrides extends FederalBreakpointOverrides {}

  interface Palette {
    cobalt: FederalColor & {
      main: string;
    };
    monochrome: FederalColor & {
      main: string;
    };
    red: FederalColor & {
      main: string;
    };
    orange: FederalColor & {
      main: string;
    };
    yellow: FederalColor & {
      main: string;
    };
    blue: FederalColor & {
      main: string;
    };
    green: FederalColor & {
      main: string;
    };
  }

  interface PaletteOptions {
    cobalt: FederalColor & {
      main: string;
    };
    monochrome: FederalColor & {
      main: string;
    };
    red: FederalColor & {
      main: string;
    };
    orange: FederalColor & {
      main: string;
    };
    yellow: FederalColor & {
      main: string;
    };
    blue: FederalColor & {
      main: string;
    };
    green: FederalColor & {
      main: string;
    };
  }
}

export { theme } from "./theme";
export { useTheme };
