import { t } from "@lingui/macro";
import { ListSubheader, MenuItem, Typography, } from "@mui/material";
import { Flex } from "@/components/flex";
import { DisabledMessageIcon, selectSizeToTypography, } from "@/components/form";
import { Icon } from "@/icons";
export const MultiSelectOption = ({ props, option: { isGroupHeader, isNoneValue, value, label, disabled, disabledMessage, }, state, size, width, }) => {
    if (!value && !isGroupHeader) {
        return null;
    }
    return isGroupHeader ? (label && (<ListSubheader key={label}>
        <Typography variant="caption" component="p" style={{ maxWidth: width }}>
          {label}
        </Typography>
      </ListSubheader>)) : (<MenuItem {...props} key={value} disabled={disabled} value={value !== null && value !== void 0 ? value : undefined} sx={{
            display: "flex",
            justifyContent: "space-between !important",
            alignItems: "center",
            gap: 1,
            borderBottom: (t) => isNoneValue ? `1px solid ${t.palette.divider}` : "none",
            typography: selectSizeToTypography[size],
        }}>
      <Typography sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            typography: selectSizeToTypography[size],
        }}>
        {isNoneValue
            ? t({ id: "controls.clear-selection", message: "Clear selection" })
            : label}
      </Typography>
      <Flex sx={{
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            minWidth: 24,
            minHeight: 20,
        }}>
        {disabledMessage ? (<DisabledMessageIcon message={disabledMessage}/>) : null}
        {state.selected ? <Icon name="checkmark" size={20}/> : null}
      </Flex>
    </MenuItem>);
};
