import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

export const ContentWrapper = ({
  children,
  sx,
  className,
  ...props
}: {
  children?: ReactNode;
  sx?: BoxProps["sx"];
  className?: string;
} & Omit<BoxProps, "sx" | "className">) => {
  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 1280,
        mx: "auto",
        px: 4,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
