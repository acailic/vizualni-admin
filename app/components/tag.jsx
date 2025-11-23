import { styled, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { forwardRef } from "react";
const TagTypography = styled(Typography)(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    minHeight: 24,
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    borderRadius: "16px",
    transition: "box-shadow 0.2s ease",
}));
const useStyles = makeStyles((theme) => ({
    themeType: {
        backgroundColor: theme.palette.green[100],
    },
    organizationType: {
        backgroundColor: theme.palette.blue[100],
    },
    termsetType: {
        backgroundColor: theme.palette.cobalt[50],
    },
    unknownType: {
        backgroundColor: theme.palette.cobalt[50],
    },
    dimensionType: {
        backgroundColor: theme.palette.yellow[100],
    },
    draftType: {},
    clickable: {
        cursor: "pointer",
        "&:hover": {
            boxShadow: theme.shadows[2],
        },
    },
}));
export const Tag = forwardRef(({ children, type = "unknown", ...props }, ref) => {
    const classes = useStyles();
    return (<TagTypography ref={ref} variant="caption" {...props} className={clsx(props.className, classes[`${type}Type`], props.onClick ? classes.clickable : null)}>
      {children}
    </TagTypography>);
});
