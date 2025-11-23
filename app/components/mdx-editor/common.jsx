import { IconButton } from "@mui/material";
export const ToolbarIconButton = ({ style, ...rest }) => {
    return (<IconButton style={{ ...style, padding: "2px", borderRadius: 4 }} {...rest}/>);
};
