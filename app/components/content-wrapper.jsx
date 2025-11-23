import { Box } from "@mui/material";
export const ContentWrapper = ({ children, sx, className, ...props }) => {
    return (<Box className={className} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 1280,
            mx: "auto",
            px: 4,
            ...sx,
        }} {...props}>
      {children}
    </Box>);
};
