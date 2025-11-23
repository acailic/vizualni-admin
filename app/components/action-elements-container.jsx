import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(2),
        height: "fit-content",
        marginTop: "-0.33rem",
    },
}));
export const ActionElementsContainer = ({ children, }) => {
    const classes = useStyles();
    return <div className={classes.root}>{children}</div>;
};
