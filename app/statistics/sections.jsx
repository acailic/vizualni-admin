import { Box, Typography } from "@mui/material";
export const SectionTitleWrapper = ({ children }) => {
    return (<Box sx={{
            width: "100%",
            maxWidth: 850,
            mx: "auto",
            py: 4,
            textWrap: "balance",
            textAlign: "center",
        }}>
      {children}
    </Box>);
};
export const SectionTitle = ({ title }) => {
    return (<Typography variant="h1" component="h2" sx={{ lineHeight: "1 !important", mb: 2 }}>
      {title}
    </Typography>);
};
