import { Box } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
export const VisuallyHidden = ({ children }) => {
    // @ts-ignore - I do not know why CSSProperties do not go directly into sx. It works.
    return <Box sx={visuallyHidden}>{children}</Box>;
};
