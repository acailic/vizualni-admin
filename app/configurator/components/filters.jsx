import { t, Trans } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ClickAwayListener, Divider, IconButton, Input, InputAdornment, Tooltip, Typography, } from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { ascending, groups, max, sum } from "d3-array";
import get from "lodash/get";
import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";
import uniqBy from "lodash/uniqBy";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { getChartSymbol } from "@/charts";
import { makeGetClosestDatesFromDateRange } from "@/charts/shared/brush/utils";
import { useFootnotesStyles } from "@/components/chart-footnotes";
import { Flex } from "@/components/flex";
import { Select, Switch } from "@/components/form";
import { Loading } from "@/components/hint";
import { MaybeTooltip } from "@/components/maybe-tooltip";
import { MultiSelect } from "@/components/multi-select";
import { isColorInConfig } from "@/config-types";
import { getChartConfig, useChartConfigFilters } from "@/config-utils";
import { isSegmentInConfig } from "@/configurator";
import { getFilterValue, isConfiguring, MultiFilterContextProvider, shouldEnableSettingShowValuesBySegment, useConfiguratorState, useMultiFilterContext, } from "@/configurator";
import { ConfiguratorDrawer, DRAWER_WIDTH, } from "@/configurator/components/drawers";
import { dimensionToFieldProps, MultiFilterField, ShowValuesMappingField, SingleFilterField, } from "@/configurator/components/field";
import { canRenderDatePickerField, DatePickerField, } from "@/configurator/components/field-date-picker";
import { useLegendTitleVisibility } from "@/configurator/configurator-state/segment-config-state";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { EditorBrush } from "@/configurator/interactive-filters/editor-brush";
import { useDefaultValueOverride, useInteractiveDataFilterToggle, useInteractiveFiltersToggle, useInteractiveTimeRangeToggle, } from "@/configurator/interactive-filters/interactive-filters-config-state";
import { isMostRecentValue, VISUALIZE_MOST_RECENT_VALUE, } from "@/domain/most-recent-value";
import { useTimeFormatLocale, useTimeFormatUnit } from "@/formatters";
import { Icon } from "@/icons";
import SvgIcCheckmark from "@/icons/components/IcCheckmark";
import SvgIcClose from "@/icons/components/IcClose";
import SvgIcRefresh from "@/icons/components/IcRefresh";
import { getTimeInterval } from "@/intervals";
import { useLocale } from "@/locales/use-locale";
import { getOptionsFromTree, joinParents, pruneTree, sortHierarchy, } from "@/rdf/tree-utils";
import { interlace } from "@/utils/interlace";
import { valueComparator } from "@/utils/sorting-values";
import { getTimeFilterOptions } from "@/utils/time-filter-options";
import { useEvent } from "@/utils/use-event";
const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            "--colorBoxSize": "12px",
            "--columnGap": "0.75rem",
            width: DRAWER_WIDTH,
        },
        header: {
            margin: theme.spacing(4),
        },
        autocompleteApplyButtonContainer: {
            position: "sticky",
            zIndex: 1000,
            left: 0,
            right: 0,
            bottom: theme.spacing(3),
            marginTop: theme.spacing(6),
            padding: `0 ${theme.spacing(4)}`,
        },
        autocompleteApplyButton: {
            justifyContent: "center",
        },
        textInput: {
            margin: `${theme.spacing(4)} 0px`,
            padding: "0px 12px",
            width: "100%",
            height: 40,
            minHeight: 40,
        },
        optionColor: {
            width: "var(--colorBoxSize)",
            height: "var(--colorBoxSize)",
            flexShrink: 0,
            outline: `1px solid ${theme.palette.divider}`,
            transition: "background-color 0.125s ease-out",
            alignSelf: "flex-start",
            marginTop: theme.spacing(1.5),
            marginRight: "0.5rem",
        },
        optionLabel: {
            flexGrow: 1,
            marginTop: -2,
            [theme.breakpoints.up("xl")]: {
                marginTop: -3.5,
            },
        },
        optionCheck: {
            width: 16,
            height: 16,
            flexShrink: 0,
            alignSelf: "flex-start",
            marginTop: "0.125rem",
        },
        selectedValueRow: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
            "&:not(:last-of-type)": {
                paddingBottom: theme.spacing(4),
            },
        },
    };
});
const explodeParents = (parents) => {
    return parents ? parents.split(" > ") : [];
};
const groupByParent = (node) => {
    return joinParents(node === null || node === void 0 ? void 0 : node.parents);
};
export const sortFilterValue = (a, b) => {
    var _a, _b;
    return (ascending((_a = a.position) !== null && _a !== void 0 ? _a : 0, (_b = b.position) !== null && _b !== void 0 ? _b : 0) ||
        `${a.identifier}`.localeCompare(`${b.identifier}`, undefined, {
            numeric: true,
        }) ||
        a.label.localeCompare(b.label));
};
export const sortFilterValues = (values) => {
    return values.sort(sortFilterValue);
};
const getColorConfig = (chartConfig) => {
    var _a;
    if (isColorInConfig(chartConfig)) {
        return get(chartConfig.fields, ["color"]);
    }
    else {
        return get(chartConfig.fields, [
            (_a = chartConfig.activeField) !== null && _a !== void 0 ? _a : "symbolLayer",
            "color",
        ]);
    }
};
const FilterControls = ({ selectAll, selectNone, allKeysLength, activeKeysLength, }) => {
    const classes = useFootnotesStyles({ useMarginTop: false });
    return (<Box className={classes.actions}>
      <Button variant="text" size="sm" disabled={activeKeysLength === allKeysLength} onClick={selectAll}>
        <Trans id="controls.filter.select.all">Select all</Trans>
      </Button>
      <Button variant="text" size="sm" disabled={activeKeysLength === 0} onClick={selectNone}>
        <Trans id="controls.filter.select.none">Select none</Trans>
      </Button>
    </Box>);
};
export const getHasColorMapping = ({ colorConfig, colorComponent, filterDimensionId, }) => {
    return !!(((colorConfig === null || colorConfig === void 0 ? void 0 : colorConfig.type) === "single" ? false : colorConfig === null || colorConfig === void 0 ? void 0 : colorConfig.colorMapping) &&
        (colorComponent !== undefined
            ? filterDimensionId === colorComponent.id
            : false));
};
const MultiFilterContent = ({ field, colorComponent, tree, }) => {
    var _a;
    const locale = useLocale();
    const [config, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(config);
    const isSegmentField = chartConfig.activeField === "segment";
    const { cubeIri, dimensionId, activeKeys, allValues, colorConfigPath } = useMultiFilterContext();
    const filters = useChartConfigFilters(chartConfig);
    const rawValues = filters[dimensionId];
    const classes = useStyles();
    const { sortedTree, flatOptions, optionsByValue } = useMemo(() => {
        const sortedTree = sortHierarchy(tree);
        const flatOptions = getOptionsFromTree(sortedTree);
        const optionsByValue = keyBy(flatOptions, (option) => option.value);
        return {
            sortedTree,
            flatOptions,
            optionsByValue,
        };
    }, [tree]);
    const { values, valueGroups } = useMemo(() => {
        const values = (((rawValues === null || rawValues === void 0 ? void 0 : rawValues.type) === "multi" && Object.keys(rawValues.values)) ||
            Object.keys(optionsByValue))
            .map((v) => optionsByValue[v])
            .filter(isHierarchyOptionSelectable);
        const grouped = groups(values, groupByParent)
            .sort((a, b) => a[0].length === 0
            ? 1
            : ascending(explodeParents(a[0]).length, explodeParents(b[0]).length) || ascending(a[0], b[0]))
            .map(([parent, group]) => {
            return [parent, sortFilterValues(group)];
        });
        return {
            values,
            valueGroups: grouped,
            valuesByParent: groupBy(values, groupByParent),
        };
    }, [optionsByValue, rawValues]);
    const [anchorEl, setAnchorEl] = useState();
    const handleOpenAutocomplete = useEvent((ev) => {
        setAnchorEl(ev.currentTarget);
    });
    // The popover content is responsible for keeping this ref up-to-date.
    // This is so that the click-away close event can still access the pending values
    // without the state changing (triggering a repositioning of the popover).
    const pendingValuesRef = useRef([]);
    const handleCloseAutocomplete = useEvent(() => {
        setAnchorEl(undefined);
        const newValues = pendingValuesRef.current
            .map((x) => x === null || x === void 0 ? void 0 : x.value)
            .filter(Boolean);
        dispatch({
            type: "CHART_CONFIG_FILTER_SET_MULTI",
            value: {
                cubeIri,
                dimensionId,
                values: newValues,
            },
        });
        anchorEl === null || anchorEl === void 0 ? void 0 : anchorEl.focus();
    });
    const handleResetColorMapping = useEvent(() => {
        var _a;
        const values = (_a = colorComponent === null || colorComponent === void 0 ? void 0 : colorComponent.values) !== null && _a !== void 0 ? _a : [];
        dispatch({
            type: "CHART_CONFIG_UPDATE_COLOR_MAPPING",
            value: {
                field,
                colorConfigPath,
                dimensionId,
                values,
                random: false,
            },
        });
    });
    const colorConfig = useMemo(() => {
        return getColorConfig(chartConfig);
    }, [chartConfig]);
    const hasColorMapping = useMemo(() => {
        return getHasColorMapping({
            colorConfig,
            colorComponent,
            filterDimensionId: dimensionId,
        });
    }, [colorConfig, dimensionId, colorComponent]);
    useEnsureUpToDateColorMapping({
        colorComponentValues: colorComponent === null || colorComponent === void 0 ? void 0 : colorComponent.values,
        colorMapping: (colorConfig === null || colorConfig === void 0 ? void 0 : colorConfig.type) !== "single" ? colorConfig === null || colorConfig === void 0 ? void 0 : colorConfig.colorMapping : undefined,
    });
    const segment = isSegmentInConfig(chartConfig)
        ? chartConfig.fields.segment
        : undefined;
    const enableSettingShowValuesBySegment = segment &&
        isSegmentField &&
        shouldEnableSettingShowValuesBySegment(chartConfig);
    const showValuesMappingBooleans = Object.values((_a = segment === null || segment === void 0 ? void 0 : segment.showValuesMapping) !== null && _a !== void 0 ? _a : {});
    const interactiveDataFilterProps = useInteractiveDataFilterToggle(dimensionId, "multi");
    const interactiveLegendFilterProps = useInteractiveFiltersToggle();
    const interactiveFilterProps = isSegmentField
        ? interactiveLegendFilterProps
        : interactiveDataFilterProps;
    const visibleLegendProps = useLegendTitleVisibility();
    const chartSymbol = getChartSymbol(chartConfig.chartType);
    const defaultValueOverrideProps = useDefaultValueOverride(dimensionId);
    const defaultValueOptions = useMemo(() => {
        return [
            {
                value: FIELD_VALUE_NONE,
                label: t({
                    id: "controls.none",
                    message: "None",
                }),
                isNoneValue: true,
            },
            ...values.map(({ value, label }) => ({ value, label })),
        ];
    }, [values]);
    return (<Box sx={{ position: "relative" }}>
      <Box mb={4}>
        <Flex sx={{ flexDirection: "column", gap: 3, mb: 3 }}>
          <InteractiveToggle {...interactiveFilterProps}/>
          {isSegmentField ? (<Switch label={t({
                id: "controls.filters.show-legend.toggle",
                message: "Show legend titles",
            })} {...visibleLegendProps}/>) : interactiveFilterProps.checked ? (<MultiSelect id={`default-value-${dimensionId}`} size="sm" label={t({
                id: "controls.filters.default-value.label",
                message: "Default value",
            })} placeholder={t({
                id: "controls.dimensionvalue.select",
                message: "Select filter",
            })} options={defaultValueOptions} {...defaultValueOverrideProps}/>) : null}
        </Flex>
        <Button variant="outlined" size="sm" onClick={handleOpenAutocomplete} sx={{ width: "fit-content" }}>
          <Trans id="controls.set-filters">Edit filters</Trans>
        </Button>
        <Flex sx={{ justifyContent: "space-between", mt: 4 }}>
          <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
            <Trans id="controls.filters.select.selected-filters">
              Selected filters
            </Trans>
            {hasColorMapping && (colorConfig === null || colorConfig === void 0 ? void 0 : colorConfig.paletteId) === "dimension" && (<Tooltip title={<Trans id="controls.filters.select.reset-colors">
                    Reset colors
                  </Trans>}>
                <IconButton size="small" onClick={handleResetColorMapping} sx={{ ml: 1, my: -2 }}>
                  <SvgIcRefresh fontSize="inherit"/>
                </IconButton>
              </Tooltip>)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <Trans id="controls.filter.nb-elements">
              {activeKeys.size} of {allValues.length}
            </Trans>
          </Typography>
        </Flex>
        <Divider sx={{ mt: 4 }}/>
      </Box>
      {enableSettingShowValuesBySegment ? (<Flex gap={2} alignItems="center" sx={{ color: "primary.main" }}>
          <Button variant="text" color="primary" size="xs" disabled={sum(showValuesMappingBooleans, (d) => +d) === values.length} onClick={() => {
                dispatch({
                    type: "CHART_FIELD_UPDATED",
                    value: {
                        locale,
                        path: "fields.segment.showValuesMapping",
                        field: null,
                        value: Object.fromEntries(values.map((v) => [v.value, true])),
                    },
                });
            }}>
            <Trans id="controls.filter.show-values.all">Show all values</Trans>
          </Button>
          •
          <Button variant="text" color="primary" size="xs" disabled={showValuesMappingBooleans.every((d) => !d)} onClick={() => {
                dispatch({
                    type: "CHART_FIELD_UPDATED",
                    value: {
                        locale,
                        path: "fields.segment.showValuesMapping",
                        field: null,
                        value: {},
                    },
                });
            }}>
            <Trans id="controls.filter.show-values.none">Show no values</Trans>
          </Button>
        </Flex>) : null}
      {valueGroups.map(([parentLabel, children]) => {
            return (<Box sx={{ mb: 4 }} key={parentLabel}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>
              {interlace(explodeParents(parentLabel), (i) => (<BreadcrumbChevron key={i}/>))}
            </Typography>
            {children.map(({ value, label }) => {
                    return (<Flex key={value} className={classes.selectedValueRow} data-testid="chart-filters-value">
                  {hasColorMapping ? (<MultiFilterField value={value} label={label} symbol={chartSymbol} enableShowValue={enableSettingShowValuesBySegment}/>) : (<>
                      <Typography variant="body2" style={{ flexGrow: 1 }}>
                        {label}
                      </Typography>
                      {enableSettingShowValuesBySegment ? (<ShowValuesMappingField value={value}/>) : null}
                      <SvgIcCheckmark />
                    </>)}
                </Flex>);
                })}
          </Box>);
        })}
      <ConfiguratorDrawer open={!!anchorEl} hideBackdrop>
        <ClickAwayListener onClickAway={handleCloseAutocomplete}>
          <DrawerContent pendingValuesRef={pendingValuesRef} options={sortedTree} flatOptions={flatOptions} onClose={handleCloseAutocomplete} values={values} hasColorMapping={hasColorMapping}/>
        </ClickAwayListener>
      </ConfiguratorDrawer>
    </Box>);
};
const InteractiveToggle = ({ name, checked, onChange, }) => {
    return (<Switch name={name} label={<MaybeTooltip tooltipProps={{ enterDelay: 600 }} title={<Trans id="controls.filters.interactive.tooltip">
              Allow users to change filters
            </Trans>}>
          <div>
            <Trans id="controls.filters.interactive.toggle">Interactive</Trans>
          </div>
        </MaybeTooltip>} checked={checked} onChange={onChange}/>);
};
/**
 * Fixes situations where an old chart is being edited and the cube has changed
 * and contains new values in the color dimension.
 * */
const useEnsureUpToDateColorMapping = ({ colorComponentValues, colorMapping, }) => {
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const { dimensionId, colorConfigPath } = useMultiFilterContext();
    const { activeField } = chartConfig;
    const hasOutdatedMapping = useMemo(() => {
        return colorMapping && colorComponentValues
            ? colorComponentValues.some((value) => !colorMapping[value.value])
            : false;
    }, [colorComponentValues, colorMapping]);
    const field = isColorInConfig(chartConfig) ? "color" : activeField;
    useEffect(() => {
        if (hasOutdatedMapping && colorMapping && colorComponentValues && field) {
            dispatch({
                type: "CHART_CONFIG_UPDATE_COLOR_MAPPING",
                value: {
                    dimensionId,
                    colorConfigPath,
                    colorMapping,
                    field,
                    values: colorComponentValues,
                    random: false,
                },
            });
        }
    }, [
        field,
        chartConfig,
        hasOutdatedMapping,
        dispatch,
        dimensionId,
        colorConfigPath,
        colorMapping,
        colorComponentValues,
    ]);
};
const useBreadcrumbStyles = makeStyles({
    root: {
        display: "inline",
        top: 5,
        position: "relative",
    },
});
const BreadcrumbChevron = () => {
    const classes = useBreadcrumbStyles();
    return <Icon className={classes.root} name="chevronRight" size={20}/>;
};
const StyledAccordion = styled(Accordion)({
    boxShadow: "none",
    minHeight: 0,
    "&:before": {
        display: "none",
    },
    "&.Mui-expanded": {
        minHeight: 0,
    },
});
const TreeAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    minHeight: 0,
    transition: "background-color 0.1s ease",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(4),
    "&.Mui-expanded": {
        minHeight: 0,
    },
    "& > .MuiAccordionSummary-content": {
        display: "flex",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 0,
        padding: `${theme.spacing(2)} 0`,
        color: theme.palette.monochrome[600],
    },
    "&:hover": {
        backgroundColor: theme.palette.cobalt[50],
        "& > .MuiAccordionSummary-content": {
            color: theme.palette.monochrome[800],
        },
    },
}));
const TreeAccordionDetails = styled(AccordionDetails)(() => ({
    padding: 0,
}));
const TreeAccordion = ({ flat, depth, value, label, state, selectable, expandable, renderExpandButton, renderColorCheckbox, onSelect, children, }) => {
    const classes = useStyles();
    const { getValueColor } = useMultiFilterContext();
    const [expanded, setExpanded] = useState(() => depth === 0);
    return (<StyledAccordion expanded={expanded} disableGutters slotProps={{ transition: { unmountOnExit: true } }}>
      <TreeAccordionSummary expandIcon={null} onClick={(e) => {
            e.stopPropagation();
            if (selectable) {
                onSelect();
            }
        }} sx={{ pl: flat ? 4 : `${(depth + 1) * 8}px` }}>
        {renderExpandButton && (<IconButton onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
            }} sx={{
                alignSelf: "flex-start",
                visibility: expandable ? "visible" : "hidden",
                ml: 2,
                mr: 1,
                p: 1,
                "&:hover": {
                    backgroundColor: "cobalt.100", // default hover color is the same
                    // as the parent hover color
                },
            }}>
            <Icon name="chevronRight" size={16} style={{
                transition: "transform 0.2s ease",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}/>
          </IconButton>)}
        {renderColorCheckbox && (<div className={classes.optionColor} style={{
                visibility: selectable ? "visible" : "hidden",
                backgroundColor: state === "SELECTED" ? getValueColor(value) : "transparent",
            }}/>)}
        <Typography variant="body2" className={classes.optionLabel}>
          {label}
        </Typography>
        <Icon name={state === "SELECTED"
            ? "checkmark"
            : state === "CHILDREN_SELECTED"
                ? "indeterminate"
                : "show"} className={classes.optionCheck} style={{
            visibility: state === "NOT_SELECTED" ? "hidden" : "visible",
        }}/>
      </TreeAccordionSummary>
      {children && <TreeAccordionDetails>{children}</TreeAccordionDetails>}
    </StyledAccordion>);
};
const validateChildren = (d) => {
    return Array.isArray(d) && d.length > 0;
};
const areChildrenSelected = ({ children, selectedValues, }) => {
    if (validateChildren(children)) {
        const values = children.map((d) => d.value);
        if (selectedValues.some((d) => values.includes(d.value))) {
            return true;
        }
        else {
            return children
                .map((d) => areChildrenSelected({ children: d.children, selectedValues }))
                .some((d) => d === true);
        }
    }
    else {
        return false;
    }
};
const isHierarchyOptionSelectable = (d) => {
    return d.hasValue !== undefined ? Boolean(d.hasValue) : true;
};
const Tree = ({ flat, depthsMetadata, options, selectedValues, showColors, onSelect, }) => {
    return (<>
      {options.map((d) => {
            const { depth, value, label, children } = d;
            const currentDepthsMetadata = depthsMetadata[depth];
            const hasChildren = validateChildren(children);
            const state = selectedValues.map((d) => d.value).includes(value)
                ? "SELECTED"
                : areChildrenSelected({ children, selectedValues })
                    ? "CHILDREN_SELECTED"
                    : "NOT_SELECTED";
            return (<TreeAccordion key={value} flat={flat} depth={depth} value={value} label={label} state={state} 
            // Has value is only present for hierarchies.
            selectable={isHierarchyOptionSelectable(d)} expandable={hasChildren} renderExpandButton={currentDepthsMetadata.expandable || depth > 0} renderColorCheckbox={showColors && (currentDepthsMetadata.selectable || d.depth === -1)} onSelect={() => {
                    if (state === "SELECTED") {
                        onSelect(selectedValues.filter((d) => d.value !== value));
                    }
                    else {
                        onSelect([...selectedValues, d]);
                    }
                }}>
            {hasChildren ? (<Tree flat={flat} depthsMetadata={depthsMetadata} options={children} selectedValues={selectedValues} showColors={showColors} onSelect={onSelect}/>) : null}
          </TreeAccordion>);
        })}
    </>);
};
const DrawerContent = forwardRef(({ onClose, options, flatOptions, values, pendingValuesRef, hasColorMapping, }, ref) => {
    const classes = useStyles();
    const [textInput, setTextInput] = useState("");
    const [pendingValues, setPendingValues] = useState(() => 
    // Do not set unselectable options
    values.filter(isHierarchyOptionSelectable));
    pendingValuesRef.current = pendingValues;
    const { depthsMetadata, uniqueSelectableFlatOptions } = useMemo(() => {
        const uniqueSelectableFlatOptions = uniqBy(flatOptions.filter(isHierarchyOptionSelectable), (d) => d.value);
        const depthsMetadata = flatOptions.reduce((acc, d) => {
            if (!acc[d.depth]) {
                acc[d.depth] = { selectable: false, expandable: false };
            }
            if (acc[d.depth].selectable === false && d.hasValue) {
                acc[d.depth].selectable = true;
            }
            if (acc[d.depth].expandable === false &&
                d.children &&
                d.children.length > 0) {
                acc[d.depth].expandable = true;
            }
            return acc;
        }, {});
        const maxDepth = max(flatOptions, (d) => d.depth);
        // Expand last level by default, so it's aligned correctly.
        if (maxDepth && maxDepth > 0) {
            depthsMetadata[maxDepth].expandable = true;
        }
        return { depthsMetadata, uniqueSelectableFlatOptions };
    }, [flatOptions]);
    const filteredOptions = useMemo(() => {
        return pruneTree(options, (d) => d.label.toLowerCase().includes(textInput.toLowerCase()));
    }, [textInput, options]);
    return (<div ref={ref} className={classes.wrapper} data-testid="edition-filters-drawer">
        <Box className={classes.header}>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap={1} mb={3}>
              <Icon name="filter"/>
              <Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
                <Trans id="controls.set-filters">Edit filters</Trans>
              </Typography>
            </Flex>
            <IconButton sx={{ mt: "-0.5rem" }} size="small" onClick={onClose}>
              <SvgIcClose fontSize="inherit"/>
            </IconButton>
          </Flex>
          <Typography variant="body2" color="text.secondary">
            <Trans id="controls.set-filters-caption">
              For best results, do not select more than 7 values in the
              visualization.
            </Trans>
          </Typography>
          <Input className={classes.textInput} size="sm" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={t({ id: "select.controls.filters.search" })} startAdornment={<InputAdornment position="start">
                <Icon name="search" size={16}/>
              </InputAdornment>}/>
          <FilterControls selectAll={() => setPendingValues(uniqueSelectableFlatOptions)} selectNone={() => setPendingValues([])} allKeysLength={uniqueSelectableFlatOptions.length} activeKeysLength={pendingValues.length}/>
        </Box>
        <Tree flat={Object.keys(depthsMetadata).length === 1} depthsMetadata={depthsMetadata} options={filteredOptions} selectedValues={pendingValues} showColors={hasColorMapping} onSelect={(newValues) => {
            setPendingValues(newValues);
        }}/>
        <div className={classes.autocompleteApplyButtonContainer}>
          <Button size="sm" className={classes.autocompleteApplyButton} fullWidth onClick={onClose}>
            <Trans id="controls.set-values-apply">Apply filters</Trans>
          </Button>
        </div>
      </div>);
});
const getPathToColorConfigProperty = ({ field, colorConfigPath, propertyPath, }) => {
    return `fields["${field}"].${colorConfigPath !== undefined ? `${colorConfigPath}.` : ""}${propertyPath}`;
};
export const DimensionValuesMultiFilter = ({ dimension, colorConfigPath, colorComponent, field, }) => {
    const [state] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const getValueColor = useEvent((value) => {
        const colorPath = getPathToColorConfigProperty({
            field: isColorInConfig(chartConfig) ? "color" : field,
            colorConfigPath: isColorInConfig(chartConfig) &&
                chartConfig.fields.color.type === "single"
                ? undefined
                : "colorMapping",
            propertyPath: `["${value}"]`,
        });
        return get(chartConfig, colorPath);
    });
    return (<MultiFilterContextProvider dimension={dimension} colorConfigPath={colorConfigPath} getValueColor={getValueColor}>
      <MultiFilterContent field={field} colorComponent={colorComponent} 
    // @ts-ignore
    tree={dimension.hierarchy && dimension.hierarchy.length > 0
            ? dimension.hierarchy
            : dimension.values}/>
    </MultiFilterContextProvider>);
};
export const TimeFilter = (props) => {
    const { dimension, disableInteractiveFilters = false } = props;
    const formatLocale = useTimeFormatLocale();
    const timeFormatUnit = useTimeFormatUnit();
    const [state, dispatch] = useConfiguratorState();
    const setFilterRange = useCallback(([from, to]) => {
        dispatch({
            type: "CHART_CONFIG_FILTER_SET_RANGE",
            value: {
                dimension,
                from,
                to,
            },
        });
    }, [dispatch, dimension]);
    const activeFilter = getFilterValue(state, dimension);
    const rangeActiveFilter = (activeFilter === null || activeFilter === void 0 ? void 0 : activeFilter.type) === "range" ? activeFilter : null;
    const usesMostRecentValue = rangeActiveFilter
        ? isMostRecentValue(rangeActiveFilter.to)
        : false;
    const onChangeFrom = useEvent((e) => {
        if (rangeActiveFilter) {
            const from = e.target.value;
            setFilterRange([from, rangeActiveFilter.to]);
        }
    });
    const onChangeTo = useEvent((e) => {
        if (rangeActiveFilter) {
            const to = e.target.value;
            setFilterRange([rangeActiveFilter.from, to]);
        }
    });
    const { sortedOptions, sortedValues } = useMemo(() => {
        return getTimeFilterOptions({
            dimension,
            formatLocale,
            timeFormatUnit,
        });
    }, [dimension, formatLocale, timeFormatUnit]);
    const getClosestDatesFromDateRange = useCallback((from, to) => {
        const getClosestDatesFromDateRange = makeGetClosestDatesFromDateRange(sortedOptions, (d) => d.date);
        return getClosestDatesFromDateRange(from, to);
    }, [sortedOptions]);
    if (isConfiguring(state)) {
        const { timeUnit, timeFormat } = dimension;
        const timeInterval = getTimeInterval(timeUnit);
        const parse = formatLocale.parse(timeFormat);
        const formatDateValue = formatLocale.format(timeFormat);
        const from = sortedOptions[0].date;
        const to = sortedOptions[sortedOptions.length - 1].date;
        if (!from || !to) {
            return null;
        }
        const timeRange = rangeActiveFilter
            ? [
                parse(rangeActiveFilter.from),
                usesMostRecentValue ? to : parse(rangeActiveFilter.to),
            ]
            : [from, to];
        const fromOptions = sortedOptions.filter(({ date }) => {
            return date <= timeRange[1];
        });
        const toOptions = sortedOptions.filter(({ date }) => {
            return date >= timeRange[0];
        });
        const fromLabel = t({
            id: "controls.filters.select.from",
            message: "From",
        });
        const toLabel = t({
            id: "controls.filters.select.to",
            message: "To",
        });
        return (<div>
        {!disableInteractiveFilters && (<Box sx={{ mb: 3 }}>
            <InteractiveTimeRangeToggle />
          </Box>)}
        <Flex sx={{ gap: 1 }}>
          {rangeActiveFilter ? (canRenderDatePickerField(timeUnit) ? (<LeftRightFormContainer left={<DatePickerField name="time-range-start" label={fromLabel} value={timeRange[0]} onChange={onChangeFrom} isDateDisabled={(date) => {
                        return (date > timeRange[1] ||
                            !sortedValues.includes(formatDateValue(date)));
                    }} timeUnit={timeUnit} dateFormat={formatDateValue} minDate={from} maxDate={to} parseDate={parse}/>} right={<DatePickerField name="time-range-end" label={toLabel} value={timeRange[1]} disabled={usesMostRecentValue} onChange={onChangeTo} isDateDisabled={(date) => {
                        return (date < timeRange[0] ||
                            !sortedValues.includes(formatDateValue(date)));
                    }} timeUnit={timeUnit} dateFormat={formatDateValue} minDate={from} maxDate={to} parseDate={parse}/>}/>) : (<LeftRightFormContainer left={<Select id="time-range-start" size="sm" label={fromLabel} options={fromOptions} sort={false} value={rangeActiveFilter.from} onChange={onChangeFrom}/>} right={<Select id="time-range-end" size="sm" label={toLabel} options={toOptions} sort={false} value={rangeActiveFilter.to} onChange={onChangeTo}/>}/>)) : null}
        </Flex>
        <EditorBrush timeExtent={[from, to]} timeRange={timeRange} timeInterval={timeInterval} timeUnit={timeUnit} hideEndHandle={usesMostRecentValue} onChange={([from, to]) => {
                const [closestFrom, closestTo] = getClosestDatesFromDateRange(from, to);
                setFilterRange([
                    formatDateValue(closestFrom),
                    usesMostRecentValue
                        ? VISUALIZE_MOST_RECENT_VALUE
                        : formatDateValue(closestTo),
                ]);
            }}/>
        {rangeActiveFilter && (<Flex sx={{ alignItems: "center", gap: 1, mt: 3 }}>
            <Switch label={t({
                    id: "controls.filter.use-most-recent",
                    message: "Use most recent",
                })} size="sm" checked={usesMostRecentValue} onChange={() => {
                    setFilterRange([
                        rangeActiveFilter.from,
                        usesMostRecentValue
                            ? formatDateValue(to)
                            : VISUALIZE_MOST_RECENT_VALUE,
                    ]);
                }}/>
            <Tooltip arrow PopperProps={{ sx: { maxWidth: 160 } }} title={<Trans id="controls.filter.use-most-recent-explanation">
                  When the publisher updates this dataset, the most recent date
                  will be selected by default.
                </Trans>}>
              <Box sx={{ color: "primary.main", lineHeight: 0 }}>
                <Icon name="infoCircle" size={16}/>
              </Box>
            </Tooltip>
          </Flex>)}
      </div>);
    }
    else {
        return <Loading />;
    }
};
const LeftRightFormContainer = ({ left, right, }) => {
    const columnGap = 12;
    const middleElementSize = 8;
    const sideElementSize = DRAWER_WIDTH / 2 - columnGap * 2 - middleElementSize;
    return (<div style={{
            display: "grid",
            gridTemplateColumns: `${sideElementSize}px ${middleElementSize}px ${sideElementSize}px`,
            columnGap,
            alignItems: "center",
        }}>
      {left}
      <Typography mt="1em">–</Typography>
      {right}
    </div>);
};
const InteractiveTimeRangeToggle = () => {
    const { checked, toggle } = useInteractiveTimeRangeToggle();
    return (<Switch label={t({
            id: "controls.filters.interactive.toggle",
            message: "Interactive",
        })} size="sm" checked={checked} onChange={toggle}/>);
};
export const DimensionValuesSingleFilter = ({ dimension, }) => {
    const locale = useLocale();
    const sortedDimensionValues = useMemo(() => {
        const values = dimension.values;
        return [...values].sort(valueComparator(locale));
    }, [dimension === null || dimension === void 0 ? void 0 : dimension.values, locale]);
    return dimension ? (<>
      {sortedDimensionValues.map((d) => {
            return (<SingleFilterField key={d.value} filters={dimensionToFieldProps(dimension)} label={d.label} value={`${d.value}`}/>);
        })}
    </>) : (<Loading />);
};
