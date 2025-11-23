import { Box, Typography } from "@mui/material";
export const NavigationSectionTitle = ({ label, backgroundColor, }) => {
    return (<Box sx={{ mb: 2, px: 2, py: 3, borderRadius: "6px", backgroundColor }}>
      <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
    </Box>);
};
