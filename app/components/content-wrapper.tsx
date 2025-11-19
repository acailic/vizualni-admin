import { Box, BoxProps } from "@mui/material";

/**
 * ContentWrapper component - replaces the Swiss Federal CI ContentWrapper
 * A simple container component that provides consistent max-width and padding
 */
export const ContentWrapper = ({ sx, children, ...props }: BoxProps) => {
  return (
    <Box
      {...props}
      sx={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        width: "100%",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
