import { Button } from "@mui/material";
import { Icon } from "@/icons";
export const AddButton = (props) => {
    return (<Button size="sm" startIcon={<Icon name="plus" size={20}/>} {...props}/>);
};
export const ConfiguratorAddButton = (props) => {
    const { sx, ...rest } = props;
    return (<AddButton size="sm" variant="outlined" sx={{ width: "fit-content", mt: 4, ...sx }} {...rest}/>);
};
