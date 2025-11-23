import { Trans } from "@lingui/macro";
import MUITreeItem, { useTreeItem, } from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import { Box, Chip, Collapse, IconButton, Input, Popover, Select, Typography, useControlled, useEventCallback, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { Flex } from "@/components/flex";
import { Label, selectSizeToTypography } from "@/components/form";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { Icon } from "@/icons";
import SvgIcChevronRight from "@/icons/components/IcChevronRight";
import { flattenTree, pruneTree } from "@/rdf/tree-utils";
import { useEvent } from "@/utils/use-event";
const useTreeItemStyles = makeStyles({
    // Necessary to use $content below
    content: {},
    root: {
        "&:hover > div > $iconContainer": {
            opacity: 1,
        },
        "--depth": 1,
        "& &": {
            "--depth": 2,
        },
        "& & &": {
            "--depth": 3,
        },
        "& & & &": {
            "--depth": 4,
        },
        "& & & & &": {
            "--depth": 5,
        },
        "& $content": {
            paddingLeft: "calc(var(--depth) * 10px)",
        },
    },
    iconContainer: {
        opacity: 0.5,
    },
    group: {
        // The padding is done on the content inside the row for the hover
        // effect to extend until the edge of the popover
        marginLeft: 0,
    },
});
const useCustomTreeItemStyles = makeStyles((theme) => ({
    action: {
        marginLeft: theme.spacing(2),
        color: theme.palette.text.primary,
        lineHeight: 0,
        transform: "translateX(0)",
        opacity: 0.5,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        "&:hover": {
            opacity: 1,
            color: theme.palette.primary.main,
        },
    },
    root: {
        "&:hover": {
            "& $action": {
                transform: "translateX(0)",
            },
        },
    },
    checkIcon: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
    },
}));
const TreeItemContent = forwardRef(function TreeItemContent(props, ref) {
    const { classes, className, displayIcon, expansionIcon, size = "sm", icon: iconProp, label, nodeId, onClick, children, onMouseDown, ...other } = props;
    const hasChildren = other["data-children"];
    const selectable = other["data-selectable"] !== false;
    const isMulti = other["data-multi"] === true;
    const handleItemClick = other["data-item-click"];
    const isSelectedInMulti = other["data-is-selected"] === true;
    const { disabled, expanded, selected, focused, handleExpansion, handleSelection, preventSelection, } = useTreeItem(nodeId);
    const icon = iconProp || expansionIcon || displayIcon;
    const handleMouseDown = useEvent((e) => {
        preventSelection(e);
        if (onMouseDown) {
            onMouseDown(e);
        }
    });
    const ownClasses = useCustomTreeItemStyles({
        selectable,
    });
    const handleClickLabel = useEvent((e) => {
        if (!e.defaultPrevented) {
            handleExpansion(e);
        }
    });
    const handleSelect = useEvent((e) => {
        e.preventDefault();
        if (selectable === false) {
            return;
        }
        preventSelection(e);
        if (isMulti && handleItemClick) {
            // For multi-select, use our custom handler
            handleItemClick(nodeId);
        }
        else {
            handleSelection(e);
            if (onClick) {
                onClick(e);
            }
        }
    });
    return (<div className={clsx(className, classes.root, ownClasses.root, {
            [classes.expanded]: expanded,
            [classes.selected]: selected,
            [classes.focused]: focused,
            [classes.disabled]: disabled,
        })} onMouseDown={handleMouseDown} onClick={selectable && !hasChildren ? handleSelect : handleClickLabel} ref={ref} {...other}>
      <div className={clsx(classes.iconContainer)}>{icon}</div>
      <div className={classes.label}>
        <Typography variant={selectSizeToTypography[size]} component="span" sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
            maxWidth: "100%",
        }}>
          {label}
        </Typography>
        {selectable && hasChildren ? (<div className={ownClasses.action} onClick={handleSelect}>
            <Typography variant={selectSizeToTypography[size]} component="span">
              <Trans id="controls.tree.select-value">Select</Trans>
            </Typography>
          </div>) : null}
      </div>
      {isMulti && selectable && isSelectedInMulti ? (<div className={ownClasses.checkIcon}>
          <Icon name="checkmark" size={20}/>
        </div>) : selected && !isMulti ? (<div className={ownClasses.checkIcon}>
          <Icon name="checkmark" size={20}/>
        </div>) : null}
    </div>);
});
const TreeItem = (props) => {
    return <MUITreeItem {...props} ContentComponent={TreeItemContent}/>;
};
const getFilteredOptions = (options, value) => {
    const rx = new RegExp(`^${value}|\\s${value}`, "i");
    return value === ""
        ? options
        : pruneTree(options, (d) => !!d.label.match(rx));
};
/**
 * Manages business logic for a select tree with search functionality
 *
 * When searching, the tree is automatically expanded
 */
export const useSelectTree = ({ value, options, inputValue: controlledInputValue, onChangeInputValue, }) => {
    const [inputValue, setInputValue_] = useControlled({
        name: "SelectTree",
        state: "inputValue",
        controlled: controlledInputValue,
        default: "",
    });
    const setInputValue = useEvent((value) => {
        setInputValue_(value);
        onChangeInputValue === null || onChangeInputValue === void 0 ? void 0 : onChangeInputValue(value);
    });
    const optionsRef = useRef(options);
    const [filteredOptions_, setFilteredOptions] = useState([]);
    // Trick to get filteredOptions updated synchronously
    const filteredOptions = optionsRef.current !== options ? options : filteredOptions_;
    optionsRef.current = options;
    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);
    const parentsRef = useRef({});
    const defaultExpanded = useMemo(() => {
        if ((!value || (Array.isArray(value) && value.length === 0)) &&
            options.length > 0) {
            return options[0].value ? [options[0].value] : [];
        }
        const values = Array.isArray(value) ? value : value ? [value] : [];
        const res = [...values];
        const parents = parentsRef.current;
        for (const v of values) {
            let cur = v;
            while (cur && parents[cur]) {
                res.push(parents[cur]);
                cur = parents[cur];
            }
        }
        return Array.from(new Set(res));
    }, [value, options]);
    const [expanded, setExpanded] = useState(defaultExpanded);
    const handleInputChange = useEvent((ev) => {
        const value = ev.currentTarget.value;
        setInputValue(value);
        const filteredOptions = getFilteredOptions(options, value);
        setFilteredOptions(filteredOptions);
        setExpanded((curExpanded) => {
            const newExpanded = Array.from(new Set([
                ...curExpanded,
                ...flattenTree(filteredOptions).map((v) => v.value),
            ]));
            return newExpanded;
        });
    });
    const handleNodeToggle = useEvent((_ev, nodeIds) => {
        setExpanded(nodeIds);
    });
    const handleClickResetInput = useEvent(() => {
        const newValue = "";
        setInputValue(newValue);
        setFilteredOptions(getFilteredOptions(options, newValue));
        setExpanded(defaultExpanded);
    });
    return {
        inputValue,
        setInputValue,
        filteredOptions,
        setFilteredOptions,
        expanded,
        setExpanded,
        handleInputChange,
        parentsRef,
        handleNodeToggle,
        handleClickResetInput,
        defaultExpanded,
    };
};
export const SelectTree = ({ size = "sm", label, options, value, onChange, disabled, sideControls, onOpen, onClose, open, id, isMulti = false, }) => {
    const [openState, setOpenState] = useState(false);
    const [minMenuWidth, setMinMenuWidth] = useState();
    const { inputValue, setInputValue, filteredOptions, setFilteredOptions, parentsRef, expanded, setExpanded, handleInputChange, handleNodeToggle, handleClickResetInput, defaultExpanded, } = useSelectTree({ value, options });
    const menuRef = useRef(null);
    const inputRef = useRef();
    const labelsByValue = useMemo(() => {
        parentsRef.current = {};
        const res = {};
        const registerNode = ({ value, label, children }) => {
            res[value] = label;
            if (children && children.length > 0) {
                for (let child of children) {
                    registerNode(child);
                    parentsRef.current[child.value] = value;
                }
            }
        };
        for (let root of options) {
            registerNode(root);
        }
        return res;
    }, [options, parentsRef]);
    const handleOpen = useEventCallback(() => {
        var _a;
        setOpenState(true);
        setMinMenuWidth((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.clientLeft);
        onOpen === null || onOpen === void 0 ? void 0 : onOpen();
    });
    const handleClose = useEventCallback(() => {
        setOpenState(false);
        setInputValue("");
        setFilteredOptions(getFilteredOptions(options, ""));
        setExpanded(defaultExpanded);
        onClose === null || onClose === void 0 ? void 0 : onClose();
    });
    const handleNodeSelect = useEventCallback((_, v) => {
        onChange({ target: { value: v } });
        if (!isMulti) {
            handleClose();
        }
    });
    const handleItemClick = useEventCallback((v) => {
        if (isMulti) {
            if (v === FIELD_VALUE_NONE) {
                onChange({ target: { value: [] } });
                return;
            }
            const currentValues = value;
            const newValues = currentValues.includes(v)
                ? currentValues.filter((id) => id !== v)
                : [...currentValues, v];
            onChange({ target: { value: newValues } });
        }
        else {
            onChange({ target: { value: v } });
            handleClose();
        }
    });
    const treeItemClasses = useTreeItemStyles();
    const treeItemTransitionProps = useMemo(() => ({
        onEntered: () => {
            var _a;
            (_a = menuRef.current) === null || _a === void 0 ? void 0 : _a.updatePosition();
        },
        onExited: () => {
            var _a;
            (_a = menuRef.current) === null || _a === void 0 ? void 0 : _a.updatePosition();
        },
    }), []);
    const renderTreeContent = useCallback((nodesData) => {
        return (<>
          {nodesData.map(({ value: nodeValue, label, children, selectable }) => {
                return (<TreeItem key={nodeValue} nodeId={nodeValue} defaultExpanded={defaultExpanded} label={label} size={size} expandIcon={children && children.length > 0 ? (<SvgIcChevronRight />) : null} classes={treeItemClasses} TransitionComponent={Collapse} TransitionProps={treeItemTransitionProps} ContentProps={{
                        // @ts-expect-error - TS says we cannot put a data attribute
                        // on the HTML element, but we know we can.
                        "data-selectable": selectable,
                        "data-children": children && children.length > 0,
                        "data-multi": isMulti,
                        "data-item-click": isMulti ? handleItemClick : undefined,
                        "data-is-selected": isMulti
                            ? value.includes(nodeValue)
                            : undefined,
                    }}>
                  {children ? renderTreeContent(children) : null}
                </TreeItem>);
            })}
        </>);
    }, [
        defaultExpanded,
        size,
        treeItemClasses,
        treeItemTransitionProps,
        isMulti,
        handleItemClick,
        value,
    ]);
    const paperProps = useMemo(() => ({
        sx: {
            minWidth: minMenuWidth !== null && minMenuWidth !== void 0 ? minMenuWidth : 0,
            boxShadow: 3,
        },
    }), [minMenuWidth]);
    const menuTransitionProps = useMemo(() => ({
        /**
         * Adds transition for top, as we need to reposition the paper when a node is toggled.
         * This needs to be done like this since the Grow transition component imperatively
         * changes the node.style.transition on entering.
         */
        onEnter: (node, isAppearing) => {
            if (isAppearing) {
                node.style.transition = `${node.style.transition}, top 158ms cubic-bezier(0.4, 0, 0.2, 1)`;
            }
        },
    }), []);
    const treeRef = useRef();
    const handleKeyDown = useEvent((e) => {
        if (e.key === "Enter" || e.key == " ") {
            handleOpen();
            e.preventDefault();
        }
    });
    useEffect(() => {
        const inputNode = inputRef.current;
        if (inputNode) {
            setMinMenuWidth(inputNode.clientWidth);
        }
    }, [open]);
    return (<div>
      {label && (<Label htmlFor={id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {label}
        </Label>)}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Select aria-expanded={open} ref={inputRef} id={id} name={id} size={size} disabled={disabled} readOnly displayEmpty value={isMulti
            ? value.length > 0
                ? value.join(",")
                : ""
            : value
                ? labelsByValue[value]
                : undefined} onClick={disabled ? undefined : handleOpen} onKeyDown={handleKeyDown} renderValue={() => {
            if (isMulti && Array.isArray(value) && value.length > 0) {
                return (<Flex sx={{
                        flexWrap: "nowrap",
                        gap: 0.5,
                        overflowX: "auto",
                        maxWidth: "calc(100% - 32px)",
                        py: 2,
                    }}>
                  {value.map((nodeId) => (<Chip key={nodeId} label={<Box sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                py: 1,
                                maxWidth: "100%",
                                overflow: "hidden",
                            }}>
                          <Typography variant={selectSizeToTypography[size]} sx={{
                                lineHeight: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                            }}>
                            {labelsByValue[nodeId]}
                          </Typography>
                        </Box>} size="small" deleteIcon={<Icon name="close" size={16}/>} onDelete={(e) => {
                            e.stopPropagation();
                            const newValues = value.filter((v) => v !== nodeId);
                            onChange({ target: { value: newValues } });
                        }} onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }} sx={{
                            maxWidth: "100% !important",
                            height: "fit-content",
                            mr: 0.5,
                            px: 1,
                            py: 0.25,
                            backgroundColor: "#F0F4F7",
                            "&:hover": {
                                backgroundColor: "cobalt.100",
                            },
                            "& .MuiChip-deleteIcon": {
                                color: "text.primary",
                                transition: "color 0.2s ease",
                            },
                        }}/>))}
                </Flex>);
            }
            if (isMulti && Array.isArray(value) && value.length === 0) {
                return (<Trans id="controls.dimensionvalue.select">Select filter</Trans>);
            }
            return (<Typography variant={selectSizeToTypography[size]} sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                }}>
                {value ? labelsByValue[value] : undefined}
              </Typography>);
        }} sx={{
            "& svg": {
                // Force icon rotation, as the Select is read only to keep the styling,
                // but allow of rendering custom tree menu.
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
            },
            ...(isMulti && {
                "& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
                    display: "flex",
                    alignItems: "center",
                    height: 40,
                    minHeight: 0,
                    padding: "0px 16px !important",
                },
                "&:hover": {
                    "& .MuiSelect-select": {
                        backgroundColor: "transparent",
                    },
                },
            }),
        }}/>
        {sideControls}
      </Box>
      <Popover anchorEl={inputRef.current} anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
        }} open={open !== undefined ? open : !!openState} onClose={handleClose} action={menuRef} slotProps={{ paper: paperProps }} TransitionProps={menuTransitionProps}>
        <Input size="sm" value={inputValue} autoFocus startAdornment={<Icon name="search" size={18}/>} endAdornment={<IconButton size="small" onClick={handleClickResetInput}>
              <Icon name="close" size={16}/>
            </IconButton>} onChange={handleInputChange} sx={{
            px: 2,
            py: 1,
            "& .MuiInput-input": {
                px: 1,
            },
        }}/>
        {filteredOptions.length === 0 ? (<Typography variant={selectSizeToTypography[size]} component="p" sx={{ py: 2, textAlign: "center" }}>
            <Trans id="No results">No results</Trans>
          </Typography>) : (
        // @ts-ignore
        <TreeView ref={treeRef} multiSelect={isMulti} selected={value} expanded={expanded} onNodeToggle={handleNodeToggle} onNodeSelect={isMulti ? () => { } : handleNodeSelect}>
            {renderTreeContent(filteredOptions)}
          </TreeView>)}
      </Popover>
    </div>);
};
