import { Box } from "@mui/material";
export const CardGrid = ({ children }) => {
    return (<Box sx={{
            display: "grid",
            gridTemplateColumns: ["1fr", "1fr", "1fr 1fr"],
            gap: 4,
            my: [4, 6],
        }}>
      {children}
    </Box>);
};
