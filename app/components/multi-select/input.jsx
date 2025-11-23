import { t } from "@lingui/macro";
import { TextField } from "@mui/material";
export const MultiSelectInput = ({ params, value, placeholder, variant, size, onClick, }) => {
    const noneLabel = t({ id: "controls.none", message: "None" });
    return (<TextField {...params} placeholder={value.length === 0 ? (placeholder !== null && placeholder !== void 0 ? placeholder : noneLabel) : undefined} variant={variant} onClick={onClick} inputProps={{
            ...params.inputProps,
            onClick: undefined,
            readOnly: true,
            size,
            sx: {
                width: 0,
                minWidth: "0px !important",
                p: 0,
                "&::placeholder": {
                    opacity: 1,
                },
            },
        }} sx={{ p: 0 }}/>);
};
