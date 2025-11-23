import get from "lodash/get";
import { createContext, useCallback, useContext, useMemo, } from "react";
import { getFieldComponentId, getInitialConfig } from "@/charts";
import { isColorInConfig, isComboChartConfig, isTableConfig, } from "@/config-types";
import { getChartConfig } from "@/config-utils";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
import { getChartOptionField, getFilterValue, isConfiguring, isLayouting, useConfiguratorState, } from "@/configurator/configurator-state";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { isMeasure, } from "@/domain/data";
import { useLocale } from "@/locales/use-locale";
import { categoricalPalettes } from "@/palettes";
import { bfs } from "@/utils/bfs";
import { isMultiHierarchyNode } from "@/utils/hierarchy";
import { useEvent } from "@/utils/use-event";
const getLeaves = (tree, { limit, ignoreNode, }) => {
    const leaves = tree ? [] : undefined;
    if (tree && leaves) {
        bfs(tree, (node) => {
            if (ignoreNode === null || ignoreNode === void 0 ? void 0 : ignoreNode(node)) {
                return bfs.IGNORE;
            }
            if ((!node.children || node.children.length === 0) &&
                node.hasValue &&
                (limit === undefined || leaves.length < limit)) {
                leaves === null || leaves === void 0 ? void 0 : leaves.push(node);
            }
        });
    }
    return leaves;
};
// Generic ------------------------------------------------------------------
export const useChartFieldField = ({ field, components, }) => {
    var _a;
    const [state, dispatch] = useConfiguratorState();
    const locale = useLocale();
    const chartConfig = getChartConfig(state);
    const handleChange = useEvent(async (e) => {
        var _a, _b;
        if (e.target.value !== FIELD_VALUE_NONE) {
            const dimensionId = e.target.value;
            const dimension = components.find((c) => c.id === dimensionId);
            const hierarchy = (_a = (isMeasure(dimension) ? [] : dimension.hierarchy)) !== null && _a !== void 0 ? _a : [];
            /**
             * When there are multiple hierarchies, we only want to select leaves from
             * the first hierarchy.
             */
            let hasSeenMultiHierarchyNode = false;
            const leaves = getLeaves(hierarchy, {
                ignoreNode: (hv) => {
                    if (isMultiHierarchyNode(hv)) {
                        if (hasSeenMultiHierarchyNode) {
                            return true;
                        }
                        else {
                            hasSeenMultiHierarchyNode = true;
                            return false;
                        }
                    }
                    else {
                        // normal node
                        return false;
                    }
                },
            });
            dispatch({
                type: "CHART_FIELD_CHANGED",
                value: {
                    locale,
                    field,
                    componentId: dimensionId,
                    selectedValues: leaves,
                },
            });
            if (!get(chartConfig, `fields["${field}"].paletteId`)) {
                return;
            }
            if (isColorInConfig(chartConfig)) {
                const palette = (_b = categoricalPalettes.find((p) => p.value === chartConfig.fields.color.paletteId)) !== null && _b !== void 0 ? _b : categoricalPalettes[0];
                dispatch({
                    type: "COLOR_FIELD_SET",
                    value: chartConfig.fields.color.type === "single"
                        ? {
                            type: chartConfig.fields.color.type,
                            paletteId: palette.value,
                            color: palette.colors[0],
                        }
                        : {
                            type: chartConfig.fields.color.type,
                            paletteId: palette.value,
                            colorMapping: mapValueIrisToColor({
                                paletteId: palette.value,
                                dimensionValues: dimension.values,
                            }),
                        },
                });
            }
            else {
                const palette = categoricalPalettes[0];
                const colorConfigPath = isTableConfig(chartConfig)
                    ? "columnStyle"
                    : undefined;
                dispatch({
                    type: "CHART_PALETTE_CHANGED",
                    value: {
                        field,
                        colorConfigPath,
                        paletteId: palette.value,
                        colorMapping: mapValueIrisToColor({
                            paletteId: palette.value,
                            dimensionValues: dimension.values,
                        }),
                    },
                });
            }
            return;
        }
        dispatch({
            type: "CHART_FIELD_DELETED",
            value: {
                locale,
                field,
            },
        });
    });
    let value;
    if (isConfiguring(state)) {
        const chartConfig = getChartConfig(state);
        value = (_a = getFieldComponentId(chartConfig.fields, field)) !== null && _a !== void 0 ? _a : FIELD_VALUE_NONE;
    }
    return {
        name: field,
        value,
        onChange: handleChange,
    };
};
export const useChartOptionSelectField = (props) => {
    const { field, path, getValue, getKey } = props;
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState();
    const handleChange = useCallback((e) => {
        const value = e.target.value;
        dispatch({
            type: "CHART_FIELD_UPDATED",
            value: {
                locale,
                field,
                path,
                value: getValue ? getValue(value) : value,
            },
        });
    }, [dispatch, locale, field, path, getValue]);
    let value;
    if (isConfiguring(state)) {
        value = get(getChartConfig(state), `fields["${field}"].${path}`, FIELD_VALUE_NONE);
    }
    return {
        name: path,
        value: getKey ? getKey(value) : value,
        onChange: handleChange,
    };
};
export const useChartOptionSliderField = ({ field, path, min, max, defaultValue, }) => {
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState();
    const onChange = useEvent((e) => {
        const value = e.target.value;
        const isValidNumber = /^\d+$/.test(value) || value === "";
        if (isValidNumber) {
            dispatch({
                type: "CHART_FIELD_UPDATED",
                value: {
                    locale,
                    field,
                    path,
                    value: Math.max(min, Math.min(+value, max)),
                },
            });
        }
    });
    const value = isConfiguring(state)
        ? +getChartOptionField(state, field, path)
        : defaultValue;
    return {
        name: path,
        value,
        onChange,
    };
};
export const useChartOptionRadioField = (props) => {
    const { field, path, value } = props;
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const handleChange = useCallback(() => {
        dispatch({
            type: "CHART_FIELD_UPDATED",
            value: {
                locale,
                field,
                path,
                value,
            },
        });
    }, [dispatch, locale, field, path, value]);
    const stateValue = getChartOptionField(state, field, path);
    const checked = stateValue ? stateValue === value : undefined;
    return {
        name: path,
        value,
        checked,
        onChange: handleChange,
    };
};
export const useChartOptionBooleanField = ({ path, field, defaultValue = "", }) => {
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState();
    const onChange = useCallback((e) => {
        dispatch({
            type: "CHART_FIELD_UPDATED",
            value: {
                locale,
                path,
                field,
                value: e.currentTarget.checked,
            },
        });
    }, [locale, dispatch, path, field]);
    const stateValue = isConfiguring(state)
        ? getChartOptionField(state, field, path, defaultValue)
        : defaultValue;
    const checked = stateValue ? stateValue : false;
    return {
        name: path,
        checked,
        onChange,
    };
};
export const overrideChecked = (chartConfig, field) => {
    return isComboChartConfig(chartConfig) && field === "y";
};
export const useActiveChartField = (props) => {
    const { value } = props;
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const onClick = useCallback(() => {
        dispatch({
            type: "CHART_ACTIVE_FIELD_CHANGE",
            value,
        });
    }, [dispatch, value]);
    const checked = chartConfig.activeField === value;
    return {
        value,
        checked,
        onClick,
    };
};
export const useActiveLayoutField = (props) => {
    const { value } = props;
    const [state, dispatch] = useConfiguratorState(isLayouting);
    const onClick = useCallback(() => {
        dispatch({
            type: "LAYOUT_ACTIVE_FIELD_CHANGE",
            value,
        });
    }, [dispatch, value]);
    const checked = state.layout.activeField === value;
    return {
        value,
        checked,
        onClick,
    };
};
// Specific ------------------------------------------------------------------
export const getNewChartConfig = ({ chartType, chartConfig, state, dimensions, measures, }) => {
    const cubes = isConfiguring(state)
        ? getChartConfig(state, state.activeChartKey).cubes
        : chartConfig.cubes;
    return getInitialConfig({
        chartType,
        iris: cubes.map((cube) => ({ iri: cube.iri, joinBy: cube.joinBy })),
        dimensions,
        measures,
    });
};
export const useAddOrEditChartType = (chartKey, type = "edit", dimensions, measures) => {
    const locale = useLocale();
    const [state, dispatch] = useConfiguratorState();
    const chartConfig = getChartConfig(state, chartKey);
    const addOrEditChartType = useEvent((chartType) => {
        if (type === "edit") {
            dispatch({
                type: "CHART_TYPE_CHANGED",
                value: {
                    locale,
                    chartKey,
                    chartType,
                },
            });
        }
        else {
            dispatch({
                type: "CHART_CONFIG_ADD",
                value: {
                    chartConfig: getNewChartConfig({
                        chartType,
                        chartConfig,
                        state,
                        dimensions,
                        measures,
                    }),
                    locale,
                },
            });
        }
    });
    const value = get(chartConfig, "chartType");
    return {
        addOrEditChartType,
        value,
    };
};
// Used in the configurator filters
export const useSingleFilterSelect = (filters) => {
    const [state, dispatch] = useConfiguratorState();
    const onChange = useCallback((e) => {
        const value = e.target.value;
        if (value === FIELD_VALUE_NONE) {
            dispatch({
                type: "FILTER_REMOVE_SINGLE",
                value: {
                    filters,
                },
            });
        }
        else {
            dispatch({
                type: "FILTER_SET_SINGLE",
                value: {
                    filters,
                    value: value === "" ? FIELD_VALUE_NONE : value,
                },
            });
        }
    }, [dispatch, filters]);
    let value = FIELD_VALUE_NONE;
    if (isConfiguring(state)) {
        const chartConfig = getChartConfig(state);
        for (const filter of filters) {
            const { cubeIri, dimensionId } = filter;
            const cube = chartConfig.cubes.find((cube) => cube.iri === cubeIri);
            if (cube) {
                value = get(cube, ["filters", dimensionId, "value"], FIELD_VALUE_NONE);
            }
        }
    }
    else if (isLayouting(state)) {
        value = get(state.dashboardFilters, ["dataFilters", "filters", filters[0].dimensionId, "value"], FIELD_VALUE_NONE);
    }
    return {
        value,
        onChange,
    };
};
// Used in the Table Chart options
export const useSingleFilterField = ({ filters, value, }) => {
    const [state, dispatch] = useConfiguratorState();
    const onChange = useCallback((e) => {
        dispatch({
            type: "FILTER_SET_SINGLE",
            value: {
                filters: filters,
                value: e.currentTarget.value,
            },
        });
    }, [dispatch, filters]);
    const cubeIri = filters[0].cubeIri;
    const dimensionId = filters[0].dimensionId;
    const chartConfig = getChartConfig(state);
    const cube = chartConfig.cubes.find((cube) => cube.iri === cubeIri);
    const stateValue = isConfiguring(state)
        ? get(cube, ["filters", dimensionId, "value"], "")
        : "";
    const checked = stateValue === value;
    return {
        name: dimensionId,
        value: value ? value : stateValue,
        checked,
        onChange,
    };
};
export const isMultiFilterFieldChecked = (filters, dimensionId, value) => {
    var _a, _b;
    const filter = filters[dimensionId];
    const fieldChecked = (filter === null || filter === void 0 ? void 0 : filter.type) === "multi" ? ((_b = (_a = filter.values) === null || _a === void 0 ? void 0 : _a[value]) !== null && _b !== void 0 ? _b : false) : false;
    return fieldChecked || !filter;
};
const MultiFilterContext = createContext({
    activeKeys: new Set(),
    allValues: [],
    cubeIri: "",
    dimensionId: "",
    colorConfigPath: undefined,
    getValueColor: (_) => "",
});
export const useMultiFilterContext = () => {
    return useContext(MultiFilterContext);
};
export const MultiFilterContextProvider = ({ dimension, colorConfigPath, children, getValueColor, }) => {
    const [state] = useConfiguratorState();
    const activeFilter = getFilterValue(state, dimension);
    const allValues = useMemo(() => {
        var _a;
        return (_a = dimension.values.map((d) => `${d.value}`)) !== null && _a !== void 0 ? _a : [];
    }, [dimension.values]);
    const activeKeys = useMemo(() => {
        const activeKeys = activeFilter
            ? activeFilter.type === "single"
                ? [String(activeFilter.value)]
                : activeFilter.type === "multi"
                    ? Object.keys(activeFilter.values)
                    : []
            : allValues;
        return new Set(activeKeys);
    }, [activeFilter, allValues]);
    const ctx = useMemo(() => {
        return {
            allValues,
            activeKeys,
            cubeIri: dimension.cubeIri,
            dimensionId: dimension.id,
            colorConfigPath,
            getValueColor,
        };
    }, [
        allValues,
        dimension.cubeIri,
        dimension.id,
        activeKeys,
        colorConfigPath,
        getValueColor,
    ]);
    return (<MultiFilterContext.Provider value={ctx}>
      {children}
    </MultiFilterContext.Provider>);
};
export const useMetaField = ({ type, metaKey, locale, value, }) => {
    const [, dispatch] = useConfiguratorState();
    const onChange = useCallback((e) => {
        let dispatchType;
        switch (type) {
            case "chart":
                dispatchType = "CHART_META_CHANGE";
                break;
            case "layout":
                dispatchType = "LAYOUT_META_CHANGE";
                break;
            default:
                const _exhaustiveCheck = type;
                return _exhaustiveCheck;
        }
        dispatch({
            type: dispatchType,
            value: {
                path: `${metaKey}.${locale}`,
                value: e.currentTarget.value,
            },
        });
    }, [type, dispatch, metaKey, locale]);
    return {
        name: `${metaKey}-${locale}`,
        value,
        onChange,
    };
};
