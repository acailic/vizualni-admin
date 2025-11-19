import { type ThemeOptions } from "@mui/material";
import { PaletteOptions } from "@mui/material/styles";

import { colors } from "@/themes/constants";

// Serbian national colors - using Serbian blue as primary
const blue: PaletteOptions["blue"] = {
  main: "#0C4076",
  50: "#E8EEF5",
  100: "#C6D5E8",
  200: "#A0BAD9",
  300: "#7A9ECA",
  400: "#5D89BF",
  500: "#3F74B4",
  600: "#396CAD",
  700: "#0C4076",
  800: "#0A3665",
  900: "#082A53",
};

const orange: PaletteOptions["orange"] = {
  main: "#9A3412",
  50: "#FFF7ED",
  100: "#FFEDD5",
  200: "#FED7AA",
  300: "#FDBA74",
  400: "#FB923C",
  500: "#F97316",
  600: "#EA580C",
  700: "#C2410C",
  800: "#9A3412",
  900: "#7C2D12",
};

const green: PaletteOptions["green"] = {
  main: "#047857",
  50: "#ECFDF5",
  100: "#D1FAE5",
  200: "#A7F3D0",
  300: "#6EE7B7",
  400: "#34D399",
  500: "#10B981",
  600: "#059669",
  700: "#047857",
  800: "#065F46",
  900: "#064E3B",
};

// Serbian blue as primary color
export const PRIMARY_COLOR = blue[700];

export const palette = {
  primary: {
    main: PRIMARY_COLOR,
    dark: blue[900],
    contrastText: "#fff",
  },
  secondary: {
    main: colors.cobalt[400],
    dark: colors.cobalt[600],
    contrastText: "#fff",
  },
  text: {
    primary: colors.monochrome[800],
    secondary: colors.monochrome[500],
  },
  divider: colors.cobalt[100],
  error: {
    main: colors.red[800],
    light: colors.red[50],
    contrastText: "#fff",
  },
  warning: {
    main: orange[800],
    light: orange[50],
    contrastText: "#fff",
  },
  info: {
    main: blue[700],
    light: blue[50],
    contrastText: "#fff",
  },
  success: {
    main: green[700],
    light: green[50],
    contrastText: "#fff",
  },
  cobalt: {
    main: colors.cobalt[700],
    ...colors.cobalt,
  },
  monochrome: {
    main: colors.monochrome[700],
    ...colors.monochrome,
  },
  red: {
    main: "#C6363C", // Serbian red
    50: "#FCEDEF",
    100: "#F8D3D6",
    200: "#F3B5BA",
    300: "#EE979E",
    400: "#EA8089",
    500: "#E66974",
    600: "#E3616C",
    700: "#C6363C",
    800: "#B42F35",
    900: "#9E2A2F",
    ...colors.red,
  },
  orange,
  yellow: {
    main: "#92400E",
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },
  green,
  blue,
} satisfies ThemeOptions["palette"];
