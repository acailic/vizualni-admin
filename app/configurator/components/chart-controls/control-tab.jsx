import { Trans } from "@lingui/macro";
import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Flex } from "@/components/flex";
import { MaybeTooltip } from "@/components/maybe-tooltip";
import { isComboChartConfig, overrideChecked, } from "@/configurator";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { getComponentLabel, getIconName, } from "@/configurator/components/ui-helpers";
import { Icon } from "@/icons";
import SvgIcPen from "@/icons/components/IcPen";
import SvgIcWarningCircle from "@/icons/components/IcWarningCircle";
import { useEvent } from "@/utils/use-event";
export const ControlTabFieldInner = ({ chartConfig, fieldComponents, value, onClick, checked, labelId, disabled, warnMessage, }) => {
    const handleClick = useEvent(() => onClick(value));
    const components = fieldComponents;
    const firstComponent = components === null || components === void 0 ? void 0 : components[0];
    const isActive = overrideChecked(chartConfig, value) || !!firstComponent;
    const labels = components === null || components === void 0 ? void 0 : components.map((c) => getComponentLabel(c));
    const { upperLabel, mainLabel } = getLabels(chartConfig, value, labelId, labels);
    return (<ControlTabButton disabled={disabled} checked={checked} value={value} onClick={handleClick}>
      <ControlTabButtonInner iconName={getIconName(value)} upperLabel={upperLabel} mainLabel={mainLabel} isActive={isActive} checked={checked} optional={overrideChecked(chartConfig, value) ? false : !firstComponent} rightIcon={<Flex gap={2}>
            {warnMessage && <WarnIconTooltip title={warnMessage}/>}{" "}
            <FieldEditIcon isActive={isActive}/>
          </Flex>}/>
    </ControlTabButton>);
};
const getLabels = (chartConfig, value, labelId, componentLabels) => {
    var _a;
    switch (value) {
        case "y":
            if (isComboChartConfig(chartConfig)) {
                return {
                    upperLabel: getFieldLabel("y"),
                    mainLabel: componentLabels === null || componentLabels === void 0 ? void 0 : componentLabels.join(", "),
                };
            }
        default:
            return {
                upperLabel: labelId ? getFieldLabel(labelId) : null,
                mainLabel: (_a = componentLabels === null || componentLabels === void 0 ? void 0 : componentLabels[0]) !== null && _a !== void 0 ? _a : (<Trans id="controls.color.add">Add...</Trans>),
            };
    }
};
const useIconStyles = makeStyles((theme) => ({
    edit: {
        color: ({ isActive }) => isActive ? theme.palette.monochrome[800] : theme.palette.monochrome[300],
        width: 18,
        height: 18,
    },
    warn: {
        color: theme.palette.orange.main,
        width: 18,
        height: 18,
        pointerEvents: "auto",
    },
}));
const WarnIconTooltip = (props) => {
    const { title } = props;
    const iconStyles = useIconStyles({ isActive: false });
    return (<MaybeTooltip title={title}>
      <Typography>
        <SvgIcWarningCircle className={iconStyles.warn}/>
      </Typography>
    </MaybeTooltip>);
};
const FieldEditIcon = ({ isActive }) => {
    const classes = useIconStyles({ isActive });
    return <SvgIcPen className={classes.edit}/>;
};
export const OnOffControlTab = ({ value, label, icon, checked, active, onClick, }) => {
    return (<div style={{ width: "100%", margin: "2px 0", borderRadius: 1.5 }}>
      <ControlTabButton checked={checked} value={value} onClick={onClick}>
        <ControlTabButtonInner iconName={getIconName(icon)} mainLabel={label} checked={checked} isActive={active} showIsActive/>
      </ControlTabButton>
    </div>);
};
export const ControlTab = ({ value, checked, onClick, icon, upperLabel, mainLabel, lowerLabel, rightIcon, disabled, }) => {
    return (<div style={{ width: "100%", margin: "2px 0", borderRadius: 1.5 }}>
      <ControlTabButton checked={checked} value={value} disabled={disabled} onClick={() => onClick(value)}>
        <ControlTabButtonInner iconName={icon} mainLabel={mainLabel} upperLabel={upperLabel} lowerLabel={lowerLabel} checked={checked} disabled={disabled} rightIcon={rightIcon}/>
      </ControlTabButton>
    </div>);
};
export const DraggableTab = ({ component, value, checked, onClick, isDragging, upperLabel, disabled, iconName, }) => {
    return (<Box sx={{
            boxShadow: isDragging ? "tooltip" : undefined,
            width: "100%",
            borderRadius: 1.5,
            my: "2px",
        }}>
      <ControlTabButton checked={checked} value={value} onClick={() => onClick(value)}>
        <ControlTabButtonInner iconName={iconName !== null && iconName !== void 0 ? iconName : getIconName(value)} upperLabel={upperLabel} mainLabel={component.label} checked={checked} optional={disabled}/>
      </ControlTabButton>
    </Box>);
};
const useStyles = makeStyles((theme) => ({
    controlTabButton: {
        width: "100%",
        minWidth: 160,
        padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
        borderColor: theme.palette.primary.main,
        borderRadius: 1.5,
        fontWeight: "normal",
        fontSize: "0.875rem",
        transition: "background-color 0.2s ease",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "none",
        "&:hover": {
            backgroundColor: theme.palette.cobalt[50],
            boxShadow: "none",
        },
        "&.Mui-disabled": {
            cursor: "initial",
            backgroundColor: "transparent",
        },
    },
    controlTabButtonInnerIcon: {
        justifyContent: "center",
        alignItems: "center",
        width: 32,
        minWidth: 32,
        height: 32,
        borderRadius: 2,
        transition: "color 0.2s ease",
    },
}));
const ControlTabButton = ({ disabled, checked, value, onClick, children, }) => {
    const classes = useStyles();
    return (<Button id={`tab-${value}`} className={classes.controlTabButton} role="tab" disabled={disabled} aria-selected={checked} onClick={() => onClick(value)} sx={{
            backgroundColor: checked
                ? (t) => `${t.palette.cobalt[50]} !important`
                : "transparent",
        }}>
      {children}
    </Button>);
};
const ControlTabButtonInner = ({ iconName, upperLabel, mainLabel, lowerLabel, checked, disabled, rightIcon, optional = false, isActive = false, showIsActive = false, }) => {
    const classes = useStyles();
    return (<Flex sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
        }}>
      <Flex sx={{ justifyContent: "flex-start", alignItems: "center" }}>
        <Flex className={classes.controlTabButtonInnerIcon} sx={{
            backgroundColor: checked ? "monochrome.800" : "white",
            "& svg": {
                color: checked
                    ? "white"
                    : optional || disabled
                        ? "monochrome.300"
                        : "monochrome.800",
            },
        }}>
          <Icon size={24} name={iconName}/>
        </Flex>
        <Flex sx={{
            flexDirection: "column",
            alignItems: "flex-start",
            mx: 1,
            flexGrow: 1,
        }}>
          {upperLabel && (<Typography variant="caption" sx={{
                color: (optional && !checked) || disabled
                    ? "monochrome.300"
                    : "monochrome.500",
            }}>
              {upperLabel}
            </Typography>)}
          <Typography variant="h6" component="p" textAlign="left" fontWeight={700} sx={{
            // --- Puts ellipsis on the second line.
            display: "-webkit-box",
            overflow: "hidden",
            textOverflow: "ellipsis",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "2",
            // ---
            color: (optional && !checked) || disabled
                ? "monochrome.300"
                : "monochrome.800",
        }}>
            {mainLabel}
          </Typography>
          {lowerLabel && (<Typography variant="caption" sx={{ color: "grey.600" }}>
              {lowerLabel}
            </Typography>)}
        </Flex>
      </Flex>
      {showIsActive && isActive === false ? (<Box sx={{ mr: 3 }}>
          <Trans id="controls.option.isNotActive">Off</Trans>
        </Box>) : showIsActive && isActive ? (<Box sx={{ mr: 3, color: "primary" }}>
          <Trans id="controls.option.isActive">On</Trans>
        </Box>) : null}
      {rightIcon}
    </Flex>);
};
