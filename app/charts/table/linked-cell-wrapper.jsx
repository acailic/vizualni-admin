import { Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { getSlugifiedId } from "@/charts/shared/chart-helpers";
import { Icon } from "@/icons";
const useStyles = makeStyles((theme) => ({
    link: {
        display: "inline-flex",
        alignItems: "center",
        gap: theme.spacing(1),
        color: "inherit",
        fontWeight: "inherit",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    },
}));
const getLinkHref = (cell, baseUrl, componentId) => {
    const slugifiedId = getSlugifiedId(componentId);
    const { original } = cell.row;
    const iriValue = original[getSlugifiedId(`${componentId}/__iri__`)];
    const rawValue = original[slugifiedId];
    const value = iriValue
        ? `${iriValue}`.split("/").pop() || iriValue
        : rawValue;
    return `${baseUrl}${value}`;
};
export const LinkedCellWrapper = ({ children, cell, columnMeta, links, }) => {
    const classes = useStyles();
    const isLinkedColumn = links.enabled &&
        links.baseUrl.trim() !== "" &&
        links.componentId.trim() !== "" &&
        links.targetComponentId.trim() !== "" &&
        getSlugifiedId(links.targetComponentId) === columnMeta.slugifiedId;
    const href = getLinkHref(cell, links.baseUrl, links.componentId);
    if (!isLinkedColumn || !href) {
        return <>{children}</>;
    }
    return (<Link className={classes.link} href={href} target="_blank" title={href} style={{ flex: 1, justifyContent: "space-between" }}>
      {children}
      <Icon name="legacyLinkExternal" size={16}/>
    </Link>);
};
