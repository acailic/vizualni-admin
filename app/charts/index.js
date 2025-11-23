import { t } from "@lingui/macro";
import { ascending, descending, group, rollup, rollups } from "d3-array";
import produce from "immer";
import get from "lodash/get";
import mapValues from "lodash/mapValues";
import sortBy from "lodash/sortBy";
import { AREA_SEGMENT_SORTING, COLUMN_SEGMENT_SORTING, disableStacked, PIE_SEGMENT_SORTING, } from "@/charts/chart-config-ui-options";
import { DEFAULT_FIXED_COLOR_FIELD, getDefaultCategoricalColorField, getDefaultNumericalColorField, } from "@/charts/map/constants";
import { canBeNormalized, isColorInConfig, isSegmentInConfig, } from "@/config-types";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { getCategoricalDimensions, getGeoDimensions, isGeoDimension, isGeoShapesDimension, isNumericalMeasure, isOrdinalMeasure, isTemporalDimension, isTemporalEntityDimension, SEGMENT_ENABLED_COMPONENTS, } from "@/domain/data";
import { truthy } from "@/domain/types";
import { DEFAULT_CATEGORICAL_PALETTE_ID, getDefaultCategoricalPaletteId, } from "@/palettes";
import { theme } from "@/themes/theme";
import { bfs } from "@/utils/bfs";
import { CHART_CONFIG_VERSION } from "@/utils/chart-config/constants";
import { createId } from "@/utils/create-id";
import { isMultiHierarchyNode } from "@/utils/hierarchy";
import { unreachableError } from "@/utils/unreachable";
const chartTypes = [
    "column",
    "bar",
    "line",
    "area",
    "scatterplot",
    "pie",
    "table",
    "map",
    "comboLineSingle",
    "comboLineDual",
    "comboLineColumn",
];
export const regularChartTypes = [
    "column",
    "bar",
    "line",
    "area",
    "scatterplot",
    "pie",
    "table",
    "map",
];
const comboDifferentUnitChartTypes = [
    "comboLineDual",
    "comboLineColumn",
];
const comboSameUnitChartTypes = ["comboLineSingle"];
export const comboChartTypes = [
    ...comboSameUnitChartTypes,
    ...comboDifferentUnitChartTypes,
];
function getChartTypeOrder({ cubeCount }) {
    const multiCubeBoost = cubeCount > 1 ? -100 : 0;
    return {
        column: 0,
        bar: 1,
        line: 2,
        area: 3,
        scatterplot: 4,
        pie: 5,
        map: 6,
        table: 7,
        comboLineSingle: 8 + multiCubeBoost,
        comboLineDual: 9 + multiCubeBoost,
        comboLineColumn: 10 + multiCubeBoost,
    };
}
/**
 * Finds the "best" dimension based on a preferred type (e.g. TemporalDimension) and Key Dimension
 *
 * @param dimensions
 * @param preferredType
 */
const findPreferredDimension = (dimensions, preferredTypes) => {
    var _a, _b;
    const dim = (_b = (_a = preferredTypes === null || preferredTypes === void 0 ? void 0 : preferredTypes.map((preferredType) => dimensions.find((d) => d.__typename === preferredType && d.isKeyDimension)).filter(truthy)[0]) !== null && _a !== void 0 ? _a : dimensions.find((d) => d.isKeyDimension)) !== null && _b !== void 0 ? _b : dimensions[0];
    if (!dim) {
        throw Error("No dimension found for initial config");
    }
    return dim;
};
const getInitialInteractiveFiltersConfig = (options) => {
    const { timeRangeComponentId = "" } = options !== null && options !== void 0 ? options : {};
    return {
        legend: {
            active: false,
            componentId: "",
        },
        timeRange: {
            active: false,
            componentId: timeRangeComponentId,
            presets: {
                type: "range",
                from: "",
                to: "",
            },
        },
        dataFilters: {
            active: false,
            componentIds: [],
            defaultValueOverrides: {},
            filterTypes: {},
            defaultOpen: true,
        },
        calculation: {
            active: false,
            type: "identity",
        },
    };
};
export const DEFAULT_SORTING = {
    sortingType: "byAuto",
    sortingOrder: "asc",
};
/**
 * Finds bottommost layer for the first hierarchy
 */
const findBottommostLayers = (dimension) => {
    const leaves = [];
    let hasSeenMultiHierarchyNode = false;
    bfs(dimension === null || dimension === void 0 ? void 0 : dimension.hierarchy, (node) => {
        if (isMultiHierarchyNode(node)) {
            if (hasSeenMultiHierarchyNode) {
                return bfs.IGNORE;
            }
            hasSeenMultiHierarchyNode = true;
        }
        if ((!node.children || node.children.length === 0) && node.hasValue) {
            leaves.push(node);
        }
    });
    return leaves;
};
const makeInitialFiltersForArea = (dimension) => {
    const filters = {};
    // Setting the filters so that bottommost areas are shown first
    // @ts-ignore
    if (dimension === null || dimension === void 0 ? void 0 : dimension.hierarchy) {
        const leaves = findBottommostLayers(dimension);
        if (leaves.length > 0) {
            filters[dimension.id] = {
                type: "multi",
                values: Object.fromEntries(leaves.map((x) => [x.value, true])),
            };
        }
    }
    return filters;
};
export const initializeMapLayerField = ({ chartConfig, field, componentId, dimensions, measures, }) => {
    if (field === "areaLayer") {
        chartConfig.fields.areaLayer = getInitialAreaLayer({
            component: dimensions
                .filter(isGeoShapesDimension)
                .find((d) => d.id === componentId),
            measure: measures[0],
        });
    }
    else if (field === "symbolLayer") {
        chartConfig.fields.symbolLayer = getInitialSymbolLayer({
            component: dimensions
                .filter(isGeoDimension)
                .find((d) => d.id === componentId),
            measure: measures.find(isNumericalMeasure),
        });
    }
};
const getInitialAreaLayer = ({ component, measure, }) => {
    const paletteId = getDefaultCategoricalPaletteId(measure);
    return {
        componentId: component.id,
        color: isNumericalMeasure(measure)
            ? getDefaultNumericalColorField({
                id: measure.id,
            })
            : getDefaultCategoricalColorField({
                id: measure.id,
                paletteId,
                dimensionValues: measure.values,
            }),
    };
};
const getInitialSymbolLayer = ({ component, measure, }) => {
    var _a;
    return {
        componentId: component.id,
        measureId: (_a = measure === null || measure === void 0 ? void 0 : measure.id) !== null && _a !== void 0 ? _a : FIELD_VALUE_NONE,
        color: DEFAULT_FIXED_COLOR_FIELD,
    };
};
const META = {
    title: {
        "sr-Latn": "",
        "sr-Cyrl": "",
        en: "",
    },
    description: {
        "sr-Latn": "",
        "sr-Cyrl": "",
        en: "",
    },
    label: {
        "sr-Latn": "",
        "sr-Cyrl": "",
        en: "",
    },
};
export const getInitialConfig = (options) => {
    var _a;
    const { key, iris, chartType, dimensions, measures, meta } = options;
    const getGenericConfig = (filters) => {
        const newConfig = {
            key: key !== null && key !== void 0 ? key : createId(),
            version: CHART_CONFIG_VERSION,
            meta: meta !== null && meta !== void 0 ? meta : META,
            // Technically, we should scope filters per cube; but as we only set initial
            // filters for area charts, and we can only have multi-cubes for combo charts,
            // we can ignore the filters scoping for now.
            cubes: iris.map(({ iri, joinBy }) => {
                if (joinBy) {
                    return {
                        iri,
                        filters: filters !== null && filters !== void 0 ? filters : {},
                        joinBy,
                    };
                }
                else {
                    // We need to completely remove the joinBy if not needed to prevent
                    // implicit conversion to null when saving / retrieving the config
                    // from the backend.
                    return {
                        iri,
                        filters: filters !== null && filters !== void 0 ? filters : {},
                    };
                }
            }),
            interactiveFiltersConfig: getInitialInteractiveFiltersConfig(),
            annotations: [],
            limits: {},
            conversionUnitsByComponentId: {},
            activeField: undefined,
        };
        return newConfig;
    };
    const numericalMeasures = measures.filter(isNumericalMeasure);
    const temporalDimensions = dimensions.filter((d) => isTemporalDimension(d) || isTemporalEntityDimension(d));
    switch (chartType) {
        case "area":
            const areaXComponentId = temporalDimensions[0].id;
            return {
                ...getGenericConfig(),
                chartType,
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: areaXComponentId,
                }),
                fields: {
                    x: { componentId: areaXComponentId },
                    y: { componentId: numericalMeasures[0].id, imputationType: "none" },
                    color: {
                        type: "single",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        color: theme.palette.primary.main,
                    },
                },
            };
        case "column":
            const columnXComponentId = findPreferredDimension(sortBy(dimensions, (d) => (isGeoDimension(d) ? 1 : -1)), [
                "TemporalDimension",
                "TemporalEntityDimension",
                "TemporalOrdinalDimension",
            ]).id;
            return {
                ...getGenericConfig(),
                chartType,
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: columnXComponentId,
                }),
                fields: {
                    x: {
                        componentId: columnXComponentId,
                        sorting: DEFAULT_SORTING,
                    },
                    y: { componentId: numericalMeasures[0].id },
                    color: {
                        type: "single",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        color: theme.palette.primary.main,
                    },
                },
            };
        case "bar":
            const barXComponentId = findPreferredDimension(sortBy(dimensions, (d) => (isGeoDimension(d) ? 1 : -1)), [
                "TemporalDimension",
                "TemporalEntityDimension",
                "TemporalOrdinalDimension",
            ]).id;
            return {
                ...getGenericConfig(),
                chartType,
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: barXComponentId,
                }),
                fields: {
                    x: { componentId: numericalMeasures[0].id },
                    y: {
                        componentId: barXComponentId,
                        sorting: DEFAULT_SORTING,
                    },
                    color: {
                        type: "single",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        color: theme.palette.primary.main,
                    },
                },
            };
        case "line":
            const lineXComponentId = temporalDimensions[0].id;
            return {
                ...getGenericConfig(),
                chartType,
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: lineXComponentId,
                }),
                fields: {
                    x: { componentId: lineXComponentId },
                    y: { componentId: numericalMeasures[0].id },
                    color: {
                        type: "single",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        color: theme.palette.primary.main,
                    },
                },
            };
        case "map":
            const geoDimensions = getGeoDimensions(dimensions);
            const geoShapesDimensions = geoDimensions.filter(isGeoShapesDimension);
            const areaDimension = geoShapesDimensions[0];
            const showAreaLayer = geoShapesDimensions.length > 0;
            const showSymbolLayer = !showAreaLayer;
            return {
                ...getGenericConfig(makeInitialFiltersForArea(areaDimension)),
                chartType,
                baseLayer: {
                    show: true,
                    locked: false,
                    bbox: undefined,
                    customLayers: [],
                },
                fields: {
                    ...(showAreaLayer
                        ? {
                            areaLayer: getInitialAreaLayer({
                                component: areaDimension,
                                measure: measures[0],
                            }),
                        }
                        : {}),
                    ...(showSymbolLayer
                        ? {
                            symbolLayer: getInitialSymbolLayer({
                                component: geoDimensions[0],
                                measure: numericalMeasures[0],
                            }),
                        }
                        : {}),
                },
            };
        case "pie":
            const pieSegmentComponent = (_a = getCategoricalDimensions(dimensions)[0]) !== null && _a !== void 0 ? _a : getGeoDimensions(dimensions)[0];
            const piePalette = getDefaultCategoricalPaletteId(pieSegmentComponent);
            return {
                ...getGenericConfig(),
                chartType,
                fields: {
                    y: { componentId: numericalMeasures[0].id },
                    segment: {
                        componentId: pieSegmentComponent.id,
                        sorting: { sortingType: "byMeasure", sortingOrder: "asc" },
                        showValuesMapping: {},
                    },
                    color: {
                        type: "segment",
                        paletteId: piePalette,
                        colorMapping: mapValueIrisToColor({
                            paletteId: piePalette,
                            dimensionValues: pieSegmentComponent.values,
                        }),
                    },
                },
            };
        case "scatterplot":
            const scatterplotSegmentComponent = getCategoricalDimensions(dimensions)[0] ||
                getGeoDimensions(dimensions)[0];
            const scatterplotPalette = getDefaultCategoricalPaletteId(scatterplotSegmentComponent);
            return {
                ...getGenericConfig(),
                chartType: "scatterplot",
                fields: {
                    x: { componentId: numericalMeasures[0].id },
                    y: {
                        componentId: numericalMeasures.length > 1
                            ? numericalMeasures[1].id
                            : numericalMeasures[0].id,
                    },
                    ...(scatterplotSegmentComponent
                        ? {
                            color: {
                                type: "segment",
                                paletteId: scatterplotPalette,
                                colorMapping: mapValueIrisToColor({
                                    paletteId: scatterplotPalette,
                                    dimensionValues: scatterplotSegmentComponent.values,
                                }),
                            },
                            segment: {
                                componentId: scatterplotSegmentComponent.id,
                                showValuesMapping: {},
                            },
                        }
                        : {
                            color: {
                                type: "single",
                                paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                                color: theme.palette.primary.main,
                            },
                        }),
                },
            };
        case "table":
            const allDimensionsSorted = [...dimensions, ...measures].sort((a, b) => { var _a, _b; return ascending((_a = a.order) !== null && _a !== void 0 ? _a : Infinity, (_b = b.order) !== null && _b !== void 0 ? _b : Infinity); });
            return {
                ...getGenericConfig(),
                chartType,
                settings: {
                    showSearch: true,
                    showAllRows: false,
                },
                links: {
                    enabled: false,
                    baseUrl: "",
                    componentId: "",
                    targetComponentId: "",
                },
                sorting: [],
                fields: Object.fromEntries(allDimensionsSorted.map((d, i) => [
                    d.id,
                    {
                        componentId: d.id,
                        componentType: d.__typename,
                        index: i,
                        isGroup: false,
                        isHidden: false,
                        columnStyle: {
                            textStyle: "regular",
                            type: "text",
                            textColor: theme.palette.monochrome[600],
                            columnColor: "#fff",
                        },
                    },
                ])),
            };
        case "comboLineSingle": {
            // It's guaranteed by getEnabledChartTypes that there are at least two units.
            const mostCommonUnit = rollups(numericalMeasures.filter((d) => d.unit), (v) => v.length, (d) => d.unit).sort((a, b) => descending(a[1], b[1]))[0][0];
            const yComponentIds = numericalMeasures
                .filter((d) => d.unit === mostCommonUnit)
                .map((d) => d.id);
            return {
                ...getGenericConfig(),
                chartType: "comboLineSingle",
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: temporalDimensions[0].id,
                }),
                fields: {
                    x: { componentId: temporalDimensions[0].id },
                    // Use all measures with the most common unit.
                    y: {
                        componentIds: yComponentIds,
                    },
                    color: {
                        type: "measures",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        colorMapping: mapValueIrisToColor({
                            paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                            dimensionValues: yComponentIds.map((id) => ({
                                value: id,
                                label: id,
                            })),
                        }),
                    },
                },
            };
        }
        case "comboLineDual": {
            // It's guaranteed by getEnabledChartTypes that there are at least two units.
            const [firstUnit, secondUnit] = Array.from(new Set(numericalMeasures.filter((d) => d.unit).map((d) => d.unit)));
            const leftAxisComponentId = numericalMeasures.find((d) => d.unit === firstUnit).id;
            const rightAxisComponentId = numericalMeasures.find((d) => d.unit === secondUnit).id;
            return {
                ...getGenericConfig(),
                chartType: "comboLineDual",
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: temporalDimensions[0].id,
                }),
                fields: {
                    x: { componentId: temporalDimensions[0].id },
                    y: {
                        leftAxisComponentId,
                        rightAxisComponentId,
                    },
                    color: {
                        type: "measures",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        colorMapping: mapValueIrisToColor({
                            paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                            dimensionValues: [leftAxisComponentId, rightAxisComponentId].map((id) => ({
                                value: id,
                                label: id,
                            })),
                        }),
                    },
                },
            };
        }
        case "comboLineColumn": {
            // It's guaranteed by getEnabledChartTypes that there are at least two units.
            const [firstUnit, secondUnit] = Array.from(new Set(numericalMeasures.filter((d) => d.unit).map((d) => d.unit)));
            const lineComponentId = numericalMeasures.find((d) => d.unit === firstUnit).id;
            const columnComponentId = numericalMeasures.find((d) => d.unit === secondUnit).id;
            return {
                ...getGenericConfig(),
                chartType: "comboLineColumn",
                interactiveFiltersConfig: getInitialInteractiveFiltersConfig({
                    timeRangeComponentId: temporalDimensions[0].id,
                }),
                fields: {
                    x: { componentId: temporalDimensions[0].id },
                    y: {
                        lineComponentId,
                        lineAxisOrientation: "right",
                        columnComponentId,
                    },
                    color: {
                        type: "measures",
                        paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                        colorMapping: mapValueIrisToColor({
                            paletteId: DEFAULT_CATEGORICAL_PALETTE_ID,
                            dimensionValues: [lineComponentId, columnComponentId].map((id) => ({
                                value: id,
                                label: id,
                            })),
                        }),
                    },
                },
            };
        }
        // This code *should* be unreachable! If it's not, it means we haven't checked
        // all cases (and we should get a TS error).
        default:
            throw unreachableError(chartType);
    }
};
export const getChartConfigAdjustedToChartType = ({ chartConfig, newChartType, dimensions, measures, isAddingNewCube, }) => {
    const oldChartType = chartConfig.chartType;
    const initialConfig = getInitialConfig({
        key: chartConfig.key,
        chartType: newChartType,
        iris: chartConfig.cubes.map(({ iri }) => ({ iri })),
        dimensions,
        measures,
        meta: chartConfig.meta,
    });
    const { interactiveFiltersConfig, ...rest } = chartConfig;
    return getAdjustedChartConfig({
        path: "",
        // Make sure interactiveFiltersConfig is passed as the last item, so that
        // it can be adjusted based on other, already adjusted fields.
        field: {
            ...rest,
            interactiveFiltersConfig,
        },
        adjusters: chartConfigsAdjusters[newChartType],
        pathOverrides: chartConfigsPathOverrides[newChartType][oldChartType],
        oldChartConfig: chartConfig,
        newChartConfig: initialConfig,
        dimensions,
        measures,
        isAddingNewCube,
    });
};
const getAdjustedChartConfig = ({ path, field, adjusters, pathOverrides, oldChartConfig, newChartConfig, dimensions, measures, isAddingNewCube, }) => {
    // For filters & segments we can't reach a primitive level as we need to
    // pass the whole object. Table fields have an [id: TableColumn] structure,
    // so we also pass a whole field in such case (used in segments).
    const isConfigLeaf = (path, configValue) => {
        if (typeof configValue !== "object" || Array.isArray(configValue)) {
            return true;
        }
        switch (path) {
            case "fields":
                return (oldChartConfig.chartType === "table" &&
                    isSegmentInConfig(newChartConfig));
            case "filters":
            case "fields.color":
            case "fields.segment":
            case "fields.animation":
            case "interactiveFiltersConfig.calculation":
            case "interactiveFiltersConfig.dataFilters":
            case "interactiveFiltersConfig.legend":
            case "limits":
            case "conversionUnitsByComponentId":
                return true;
            default:
                return false;
        }
    };
    const go = ({ path, field }) => {
        for (const [k, v] of Object.entries(field)) {
            const newPath = path === "" ? k : `${path}.${k}`;
            if (v !== undefined) {
                const overrides = pathOverrides === null || pathOverrides === void 0 ? void 0 : pathOverrides[newPath];
                if (isConfigLeaf(newPath, v) || overrides) {
                    if (overrides) {
                        for (const override of overrides) {
                            const getChartConfigWithAdjustedField = get(adjusters, override.path);
                            if (getChartConfigWithAdjustedField) {
                                newChartConfig = getChartConfigWithAdjustedField({
                                    oldValue: override.oldValue ? override.oldValue(v) : v,
                                    newChartConfig,
                                    oldChartConfig,
                                    dimensions,
                                    measures,
                                    isAddingNewCube,
                                });
                            }
                        }
                    }
                    else {
                        const getChartConfigWithAdjustedField = get(adjusters, newPath);
                        if (getChartConfigWithAdjustedField) {
                            newChartConfig = getChartConfigWithAdjustedField({
                                oldValue: v,
                                newChartConfig,
                                oldChartConfig,
                                dimensions,
                                measures,
                                isAddingNewCube,
                            });
                        }
                    }
                }
                else {
                    go({ path: newPath, field: v });
                }
            }
        }
        return newChartConfig;
    };
    return go({ path, field });
};
const interactiveFiltersAdjusters = {
    legend: ({ oldValue, oldChartConfig, newChartConfig }) => {
        if (oldChartConfig.fields.segment !== undefined) {
            return produce(newChartConfig, (draft) => {
                draft.interactiveFiltersConfig.legend = oldValue;
            });
        }
        return newChartConfig;
    },
    timeRange: {
        active: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.interactiveFiltersConfig.timeRange.active = oldValue;
            });
        },
        componentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.interactiveFiltersConfig.timeRange.componentId = oldValue;
            });
        },
        presets: {
            type: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    draft.interactiveFiltersConfig.timeRange.presets.type = oldValue;
                });
            },
            from: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    draft.interactiveFiltersConfig.timeRange.presets.from = oldValue;
                });
            },
            to: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    draft.interactiveFiltersConfig.timeRange.presets.to = oldValue;
                });
            },
        },
    },
    dataFilters: ({ oldValue, newChartConfig, oldChartConfig }) => {
        return produce(newChartConfig, (draft) => {
            var _a;
            const oldComponentIds = (_a = oldValue.componentIds) !== null && _a !== void 0 ? _a : [];
            // Do not migrate filters from table, as they have different types anyway.
            if (oldChartConfig.chartType === "table") {
                draft.interactiveFiltersConfig.dataFilters = {
                    active: false,
                    componentIds: [],
                    defaultValueOverrides: {},
                    defaultOpen: true,
                    filterTypes: {},
                };
                return;
            }
            if (oldComponentIds.length > 0) {
                const fieldComponentIds = Object.values(
                // @ts-ignore - we are only interested in component ids.
                draft.fields).map((d) => d.componentId);
                // Remove component ids that are not in the new chart config, as they
                // can't be used as interactive data filters then.
                const validComponentIds = oldComponentIds.filter((d) => !fieldComponentIds.includes(d));
                const newDefaultValueOverrides = {
                    ...oldValue.defaultValueOverrides,
                };
                const removedComponentIds = oldComponentIds.filter((d) => !validComponentIds.includes(d));
                removedComponentIds.forEach((id) => {
                    delete newDefaultValueOverrides[id];
                });
                draft.interactiveFiltersConfig.dataFilters.active =
                    validComponentIds.length > 0;
                draft.interactiveFiltersConfig.dataFilters.componentIds =
                    validComponentIds;
                draft.interactiveFiltersConfig.dataFilters.defaultValueOverrides =
                    newDefaultValueOverrides;
            }
            else {
                draft.interactiveFiltersConfig.dataFilters = oldValue;
            }
        });
    },
    calculation: ({ oldValue, newChartConfig }) => {
        return produce(newChartConfig, (draft) => {
            if (canBeNormalized(newChartConfig)) {
                draft.interactiveFiltersConfig.calculation = oldValue;
            }
            else {
                draft.interactiveFiltersConfig.calculation = {
                    active: false,
                    type: "identity",
                };
            }
        });
    },
};
const chartConfigsAdjusters = {
    column: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    // When switching from a bar chart or scatterplot, x is a measure.
                    if (dimensions.find((d) => d.id === oldValue)) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            y: {
                componentId: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.componentId = oldValue;
                    });
                },
                showValues: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.showValues = oldValue;
                    });
                },
                customDomain: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.customDomain = oldValue;
                    });
                },
            },
            color: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    // Segment color type is migrated in tandem with the segment field below.
                    if (oldValue.type !== "segment") {
                        draft.fields.color = getSingleColorField({
                            oldColorField: oldValue,
                        });
                    }
                });
            },
            segment: ({ oldValue, oldChartConfig, newChartConfig, dimensions, measures, }) => {
                var _a;
                let newSegment;
                let newColor;
                const yMeasure = measures.find((d) => d.id === newChartConfig.fields.y.componentId);
                // When switching from a table chart, a whole fields object is passed as oldValue.
                if (oldChartConfig.chartType === "table") {
                    const maybeSegmentAndColorFields = convertTableFieldsToSegmentAndColorFields({
                        fields: oldValue,
                        dimensions,
                        measures,
                    });
                    if (maybeSegmentAndColorFields) {
                        newSegment = {
                            ...maybeSegmentAndColorFields.segment,
                            sorting: DEFAULT_SORTING,
                            type: disableStacked(yMeasure) ? "grouped" : "stacked",
                            showValuesMapping: {},
                        };
                        newColor = maybeSegmentAndColorFields.color;
                    }
                    // Otherwise we are dealing with a segment field. We shouldn't take
                    // the segment from oldValue if the component has already been used as
                    // x axis.
                }
                else if (newChartConfig.fields.x.componentId !== oldValue.componentId) {
                    const oldSegment = oldValue;
                    const oldColor = isColorInConfig(oldChartConfig)
                        ? oldChartConfig.fields.color
                        : undefined;
                    const segmentDimension = dimensions.find((d) => d.id === oldValue.componentId);
                    newSegment = {
                        ...oldSegment,
                        showValuesMapping: (_a = oldSegment.showValuesMapping) !== null && _a !== void 0 ? _a : {},
                        // We could encounter byMeasure sorting type (Pie chart); we should
                        // switch to byTotalSize sorting then.
                        sorting: adjustSegmentSorting({
                            segment: oldSegment,
                            acceptedValues: COLUMN_SEGMENT_SORTING.map((d) => d.sortingType),
                            defaultValue: "byTotalSize",
                        }),
                        type: disableStacked(yMeasure) ? "grouped" : "stacked",
                    };
                    newColor = getSegmentColorField({
                        oldColorField: oldColor,
                        segmentDimension,
                    });
                }
                return produce(newChartConfig, (draft) => {
                    if (newSegment && (newColor === null || newColor === void 0 ? void 0 : newColor.type) === "segment") {
                        draft.fields.segment = newSegment;
                        draft.fields.color = newColor;
                    }
                });
            },
            animation: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    // Temporal dimension could be used as X axis, in this case we need to
                    // remove the animation.
                    if (newChartConfig.fields.x.componentId !== (oldValue === null || oldValue === void 0 ? void 0 : oldValue.componentId)) {
                        draft.fields.animation = oldValue;
                    }
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    bar: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, measures }) => {
                    if (measures.find((d) => d.id === oldValue)) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
                showValues: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.x.showValues = oldValue;
                    });
                },
                customDomain: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.x.customDomain = oldValue;
                    });
                },
            },
            y: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    // For most charts, y is a measure.
                    if (dimensions.find((d) => d.id === oldValue)) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.y.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            color: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    // Segment color type is migrated in tandem with the segment field below.
                    if (oldValue.type !== "segment") {
                        draft.fields.color = getSingleColorField({
                            oldColorField: oldValue,
                        });
                    }
                });
            },
            segment: ({ oldValue, oldChartConfig, newChartConfig, dimensions, measures, }) => {
                let newSegment;
                let newColor;
                const xMeasure = measures.find((d) => d.id === newChartConfig.fields.x.componentId);
                // When switching from a table chart, a whole fields object is passed as oldValue.
                if (oldChartConfig.chartType === "table") {
                    const maybeSegmentAndColorFields = convertTableFieldsToSegmentAndColorFields({
                        fields: oldValue,
                        dimensions,
                        measures,
                    });
                    if (maybeSegmentAndColorFields) {
                        newSegment = {
                            ...maybeSegmentAndColorFields.segment,
                            sorting: DEFAULT_SORTING,
                            type: disableStacked(xMeasure) ? "grouped" : "stacked",
                        };
                        newColor = maybeSegmentAndColorFields.color;
                    }
                    // Otherwise we are dealing with a segment field. We shouldn't take
                    // the segment from oldValue if the component has already been used as
                    // y axis.
                }
                else if (newChartConfig.fields.y.componentId !== oldValue.componentId) {
                    const oldSegment = oldValue;
                    const oldColor = isColorInConfig(oldChartConfig)
                        ? oldChartConfig.fields.color
                        : undefined;
                    const segmentDimension = dimensions.find((d) => d.id === oldValue.componentId);
                    newSegment = {
                        ...oldSegment,
                        // We could encounter byMeasure sorting type (Pie chart); we should
                        // switch to byTotalSize sorting then.
                        sorting: adjustSegmentSorting({
                            segment: oldSegment,
                            acceptedValues: COLUMN_SEGMENT_SORTING.map((d) => d.sortingType),
                            defaultValue: "byTotalSize",
                        }),
                        type: disableStacked(xMeasure) ? "grouped" : "stacked",
                    };
                    newColor = getSegmentColorField({
                        oldColorField: oldColor,
                        segmentDimension,
                    });
                }
                return produce(newChartConfig, (draft) => {
                    if (newSegment && (newColor === null || newColor === void 0 ? void 0 : newColor.type) === "segment") {
                        draft.fields.segment = newSegment;
                        draft.fields.color = newColor;
                    }
                });
            },
            animation: ({ oldValue, newChartConfig }) => {
                if (newChartConfig.chartType !== "bar") {
                    return produce(newChartConfig, (draft) => {
                        if (newChartConfig.fields.x.componentId !== (oldValue === null || oldValue === void 0 ? void 0 : oldValue.componentId)) {
                            draft.fields.animation = oldValue;
                        }
                    });
                }
                return produce(newChartConfig, (draft) => {
                    // Temporal dimension could be used as Y axis, in this case we need to
                    // remove the animation.
                    if (newChartConfig.fields.y.componentId !== (oldValue === null || oldValue === void 0 ? void 0 : oldValue.componentId)) {
                        draft.fields.animation = oldValue;
                    }
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    line: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType = "circle", ...rest }) => ({
                    ...rest,
                    symbolType,
                })));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    const ok = dimensions.find((d) => isTemporalDimension(d) && d.id === oldValue);
                    if (ok) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            y: {
                componentId: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.componentId = oldValue;
                    });
                },
                showValues: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.showValues = oldValue;
                    });
                },
                customDomain: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.customDomain = oldValue;
                    });
                },
            },
            color: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    // Segment color type is migrated in tandem with the segment field below.
                    if (oldValue.type !== "segment") {
                        draft.fields.color = getSingleColorField({
                            oldColorField: oldValue,
                        });
                    }
                });
            },
            segment: ({ oldValue, oldChartConfig, newChartConfig, dimensions, measures, }) => {
                var _a;
                let newSegment;
                let newColor;
                if (oldChartConfig.chartType === "table") {
                    const maybeSegmentAndColorFields = convertTableFieldsToSegmentAndColorFields({
                        fields: oldValue,
                        dimensions,
                        measures,
                    });
                    if (maybeSegmentAndColorFields) {
                        newSegment = maybeSegmentAndColorFields.segment;
                        newColor = maybeSegmentAndColorFields.color;
                    }
                }
                else {
                    const oldSegment = oldValue;
                    const oldColor = isColorInConfig(oldChartConfig)
                        ? oldChartConfig.fields.color
                        : undefined;
                    const segmentDimension = dimensions.find((d) => d.id === oldValue.componentId);
                    if (!isTemporalDimension(segmentDimension)) {
                        newSegment = {
                            componentId: oldSegment.componentId,
                            sorting: "sorting" in oldSegment &&
                                oldSegment.sorting &&
                                "sortingOrder" in oldSegment.sorting
                                ? ((_a = oldSegment.sorting) !== null && _a !== void 0 ? _a : DEFAULT_FIXED_COLOR_FIELD)
                                : DEFAULT_SORTING,
                            showValuesMapping: oldSegment.showValuesMapping,
                        };
                        newColor = getSegmentColorField({
                            oldColorField: oldColor,
                            segmentDimension,
                        });
                    }
                }
                return produce(newChartConfig, (draft) => {
                    if (newSegment && (newColor === null || newColor === void 0 ? void 0 : newColor.type) === "segment") {
                        draft.fields.segment = newSegment;
                        draft.fields.color = newColor;
                    }
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    area: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType = "circle", ...rest }) => ({
                    ...rest,
                    symbolType,
                })));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    const ok = dimensions.find((d) => isTemporalDimension(d) && d.id === oldValue);
                    if (ok) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            y: {
                componentId: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.componentId = oldValue;
                    });
                },
                showValues: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.showValues = oldValue;
                    });
                },
                customDomain: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.customDomain = oldValue;
                    });
                },
            },
            color: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    // Segment color type is migrated in tandem with the segment field below.
                    if (oldValue.type !== "segment") {
                        draft.fields.color = getSingleColorField({
                            oldColorField: oldValue,
                        });
                    }
                });
            },
            segment: ({ oldValue, oldChartConfig, newChartConfig, dimensions, measures, }) => {
                const yMeasure = measures.find((d) => d.id === newChartConfig.fields.y.componentId);
                if (disableStacked(yMeasure)) {
                    return produce(newChartConfig, (draft) => {
                        delete draft.fields.segment;
                    });
                }
                let newSegment;
                let newColor;
                if (oldChartConfig.chartType === "table") {
                    const maybeSegmentAndColorFields = convertTableFieldsToSegmentAndColorFields({
                        fields: oldValue,
                        dimensions,
                        measures,
                    });
                    if (maybeSegmentAndColorFields) {
                        newSegment = {
                            ...maybeSegmentAndColorFields.segment,
                            sorting: DEFAULT_SORTING,
                        };
                        newColor = maybeSegmentAndColorFields.color;
                    }
                }
                else {
                    const oldSegment = oldValue;
                    const oldColor = isColorInConfig(oldChartConfig)
                        ? oldChartConfig.fields.color
                        : undefined;
                    const segmentDimension = dimensions.find((d) => d.id === oldValue.componentId);
                    if (!isTemporalDimension(segmentDimension)) {
                        newSegment = {
                            componentId: oldSegment.componentId,
                            sorting: adjustSegmentSorting({
                                segment: oldSegment,
                                acceptedValues: AREA_SEGMENT_SORTING.map((d) => d.sortingType),
                                defaultValue: "byTotalSize",
                            }),
                            showValuesMapping: oldSegment.showValuesMapping,
                        };
                        newColor = getSegmentColorField({
                            oldColorField: oldColor,
                            segmentDimension,
                        });
                    }
                }
                return produce(newChartConfig, (draft) => {
                    if (newSegment && (newColor === null || newColor === void 0 ? void 0 : newColor.type) === "segment") {
                        draft.fields.segment = newSegment;
                        draft.fields.color = newColor;
                    }
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    scatterplot: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, measures }) => {
                    const numericalMeasures = measures.filter(isNumericalMeasure);
                    // If there is only one numerical measure then x & y are already filled correctly.
                    if (numericalMeasures.length > 1) {
                        if (numericalMeasures.map((d) => d.id).includes(oldValue)) {
                            return produce(newChartConfig, (draft) => {
                                draft.fields.x.componentId = oldValue;
                            });
                        }
                    }
                    return newChartConfig;
                },
            },
            y: {
                componentId: ({ oldValue, newChartConfig, measures }) => {
                    const numericalMeasures = measures.filter(isNumericalMeasure);
                    // If there is only one numerical measure then x & y are already filled correctly.
                    if (numericalMeasures.length > 1) {
                        if (numericalMeasures.map((d) => d.id).includes(oldValue) &&
                            newChartConfig.fields.x.componentId !== oldValue) {
                            return produce(newChartConfig, (draft) => {
                                draft.fields.y.componentId = oldValue;
                            });
                        }
                        else {
                            const newMeasure = numericalMeasures.find((d) => d.id !== newChartConfig.fields.x.componentId);
                            if (newMeasure) {
                                return produce(newChartConfig, (draft) => {
                                    draft.fields.y.componentId = newMeasure.id;
                                });
                            }
                        }
                    }
                    return newChartConfig;
                },
            },
            color: ({ oldValue, oldChartConfig, newChartConfig, dimensions }) => {
                return produce(newChartConfig, (draft) => {
                    if (oldValue.type === "single") {
                        const oldColor = isColorInConfig(oldChartConfig)
                            ? oldChartConfig.fields.color
                            : undefined;
                        const segmentDimension = dimensions.find((d) => { var _a; return d.id === ((_a = newChartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.componentId); });
                        draft.fields.color = getSegmentColorField({
                            oldColorField: oldColor,
                            segmentDimension,
                        });
                    }
                });
            },
            segment: ({ oldValue, oldChartConfig, newChartConfig, dimensions, measures, }) => {
                let newSegment;
                let newColor;
                const oldColor = isColorInConfig(oldChartConfig)
                    ? oldChartConfig.fields.color
                    : undefined;
                const segmentDimension = dimensions.find((d) => d.id === oldValue.componentId);
                if (oldChartConfig.chartType === "table") {
                    const maybeSegmentAndColorFields = convertTableFieldsToSegmentAndColorFields({
                        fields: oldValue,
                        dimensions,
                        measures,
                    });
                    if (maybeSegmentAndColorFields) {
                        newSegment = maybeSegmentAndColorFields.segment;
                        newColor = maybeSegmentAndColorFields.color;
                    }
                }
                else {
                    const oldSegment = oldValue;
                    newSegment = {
                        componentId: oldSegment.componentId,
                        showValuesMapping: oldSegment.showValuesMapping,
                    };
                    newColor = getSegmentColorField({
                        oldColorField: oldColor,
                        segmentDimension,
                    });
                }
                return produce(newChartConfig, (draft) => {
                    if (newSegment && (newColor === null || newColor === void 0 ? void 0 : newColor.type) === "segment") {
                        draft.fields.segment = newSegment;
                        draft.fields.color = newColor;
                    }
                });
            },
            animation: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    draft.fields.animation = oldValue;
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    pie: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            y: {
                componentId: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.componentId = oldValue;
                    });
                },
                showValues: ({ oldValue, newChartConfig }) => {
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y.showValues = oldValue;
                    });
                },
            },
            color: ({ oldValue, oldChartConfig, newChartConfig, dimensions }) => {
                return produce(newChartConfig, (draft) => {
                    if (oldValue.type === "single") {
                        const oldColor = isColorInConfig(oldChartConfig)
                            ? oldChartConfig.fields.color
                            : undefined;
                        const segmentDimension = dimensions.find((d) => d.id === newChartConfig.fields.segment.componentId);
                        draft.fields.color = getSegmentColorField({
                            oldColorField: oldColor,
                            segmentDimension,
                        });
                    }
                });
            },
            segment: ({ oldValue, oldChartConfig, newChartConfig, dimensions, measures, }) => {
                let newSegment;
                let newColor;
                if (oldChartConfig.chartType === "table") {
                    const maybeSegmentAndColorFields = convertTableFieldsToSegmentAndColorFields({
                        fields: oldValue,
                        dimensions,
                        measures,
                    });
                    if (maybeSegmentAndColorFields) {
                        newSegment = {
                            ...maybeSegmentAndColorFields.segment,
                            sorting: DEFAULT_SORTING,
                        };
                        newColor = maybeSegmentAndColorFields.color;
                    }
                }
                else {
                    const oldSegment = oldValue;
                    const oldColor = isColorInConfig(oldChartConfig)
                        ? oldChartConfig.fields.color
                        : undefined;
                    const segmentDimension = dimensions.find((d) => d.id === oldSegment.componentId);
                    newSegment = {
                        componentId: oldSegment.componentId,
                        sorting: adjustSegmentSorting({
                            segment: oldSegment,
                            acceptedValues: PIE_SEGMENT_SORTING.map((d) => d.sortingType),
                            defaultValue: "byMeasure",
                        }),
                        showValuesMapping: oldSegment.showValuesMapping,
                    };
                    newColor = getSegmentColorField({
                        oldColorField: oldColor,
                        segmentDimension,
                    });
                }
                return produce(newChartConfig, (draft) => {
                    if (newSegment && (newColor === null || newColor === void 0 ? void 0 : newColor.type) === "segment") {
                        draft.fields.segment = newSegment;
                        draft.fields.color = newColor;
                    }
                });
            },
            animation: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    draft.fields.animation = oldValue;
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    table: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue.map((cube) => ({
                    ...cube,
                    filters: Object.fromEntries(Object.entries(cube.filters).filter(([_, value]) => value.type !== "range")),
                }));
            });
        },
        fields: ({ oldValue, newChartConfig }) => {
            for (const componentId of Object.keys(newChartConfig.fields)) {
                if (componentId === oldValue.componentId) {
                    return produce(newChartConfig, (draft) => {
                        draft.fields[componentId].isGroup = true;
                    });
                }
            }
            return newChartConfig;
        },
    },
    map: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                // Filters have been reset by the initial config of the map.
                // We need to set them back to their old value, taking care not
                // to override the filters that have been set by the initial config
                // of the map.
                for (const oldCube of oldValue) {
                    const cube = draft.cubes.find((d) => d.iri === oldCube.iri);
                    for (const [id, value] of Object.entries(oldCube.filters)) {
                        if (cube.filters[id] === undefined) {
                            cube.filters[id] = value;
                        }
                    }
                    if (oldCube.joinBy !== undefined) {
                        cube.joinBy = oldCube.joinBy;
                    }
                }
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            areaLayer: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    const areaDimension = dimensions.find((d) => d.__typename === "GeoShapesDimension" && d.id === oldValue);
                    if (areaDimension) {
                        return produce(newChartConfig, (draft) => {
                            if (draft.fields.areaLayer) {
                                draft.fields.areaLayer.componentId = oldValue;
                            }
                        });
                    }
                    return newChartConfig;
                },
                color: {
                    componentId: ({ oldValue, newChartConfig }) => {
                        return produce(newChartConfig, (draft) => {
                            if (draft.fields.areaLayer) {
                                draft.fields.areaLayer.color.componentId = oldValue;
                            }
                            if (draft.fields.symbolLayer) {
                                draft.fields.symbolLayer.measureId = oldValue;
                            }
                        });
                    },
                },
            },
            animation: ({ oldValue, newChartConfig }) => {
                return produce(newChartConfig, (draft) => {
                    draft.fields.animation = oldValue;
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    comboLineSingle: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    const ok = dimensions.find((d) => isTemporalDimension(d) && d.id === oldValue);
                    if (ok) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            y: {
                componentIds: ({ oldValue, newChartConfig, oldChartConfig, measures, }) => {
                    var _a, _b;
                    const numericalMeasures = measures.filter((d) => isNumericalMeasure(d) && d.unit);
                    const { unit } = (_a = numericalMeasures.find((d) => d.id === oldValue)) !== null && _a !== void 0 ? _a : numericalMeasures[0];
                    const componentIds = numericalMeasures
                        .filter((d) => d.unit === unit)
                        .map((d) => d.id);
                    const paletteId = isColorInConfig(oldChartConfig)
                        ? ((_b = oldChartConfig.fields.color.paletteId) !== null && _b !== void 0 ? _b : DEFAULT_CATEGORICAL_PALETTE_ID)
                        : DEFAULT_CATEGORICAL_PALETTE_ID;
                    return produce(newChartConfig, (draft) => {
                        draft.fields.y = {
                            componentIds,
                        };
                        draft.fields.color = {
                            type: "measures",
                            paletteId: paletteId,
                            colorMapping: mapValueIrisToColor({
                                paletteId,
                                dimensionValues: componentIds.map((id) => ({
                                    value: id,
                                    label: id,
                                })),
                            }),
                        };
                    });
                },
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    comboLineDual: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    const ok = dimensions.find((d) => isTemporalDimension(d) && d.id === oldValue);
                    if (ok) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            y: ({ newChartConfig, oldChartConfig, measures, isAddingNewCube }) => {
                var _a, _b;
                const numericalMeasures = measures.filter(isNumericalMeasure);
                const numericalMeasureIds = numericalMeasures.map((d) => d.id);
                let leftMeasure = numericalMeasures.find((d) => d.id === numericalMeasureIds[0]);
                let rightMeasureId;
                const getLeftMeasure = (preferredId) => {
                    const preferredLeftMeasure = numericalMeasures.find((d) => d.id === preferredId);
                    if (isAddingNewCube) {
                        const rightMeasure = numericalMeasures.find((d) => d.id === rightMeasureId);
                        const overrideLeftMeasure = numericalMeasures.find((d) => d.cubeIri !== (rightMeasure === null || rightMeasure === void 0 ? void 0 : rightMeasure.cubeIri) &&
                            d.unit !== (rightMeasure === null || rightMeasure === void 0 ? void 0 : rightMeasure.unit));
                        return overrideLeftMeasure !== null && overrideLeftMeasure !== void 0 ? overrideLeftMeasure : preferredLeftMeasure;
                    }
                    else {
                        return preferredLeftMeasure;
                    }
                };
                switch (oldChartConfig.chartType) {
                    case "comboLineColumn": {
                        const { lineComponentId: lineId, lineAxisOrientation: lineOrientation, columnComponentId: columnId, } = oldChartConfig.fields.y;
                        const leftAxisId = lineOrientation === "left" ? lineId : columnId;
                        rightMeasureId = lineOrientation === "left" ? columnId : lineId;
                        leftMeasure = getLeftMeasure(leftAxisId);
                        break;
                    }
                    case "comboLineSingle": {
                        leftMeasure = getLeftMeasure(oldChartConfig.fields.y.componentIds[0]);
                        break;
                    }
                    case "area":
                    case "column":
                    case "line":
                    case "pie":
                    case "scatterplot": {
                        leftMeasure = getLeftMeasure(oldChartConfig.fields.y.componentId);
                        break;
                    }
                    case "map": {
                        const { areaLayer, symbolLayer } = oldChartConfig.fields;
                        const leftAxisId = (_a = areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.color.componentId) !== null && _a !== void 0 ? _a : symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.measureId;
                        if (leftAxisId) {
                            leftMeasure = getLeftMeasure(leftAxisId);
                        }
                        break;
                    }
                    case "bar": {
                        leftMeasure = getLeftMeasure(oldChartConfig.fields.x.componentId);
                        break;
                    }
                    case "comboLineDual":
                    case "table":
                        break;
                    default:
                        const _exhaustiveCheck = oldChartConfig;
                        return _exhaustiveCheck;
                }
                const rightMeasure = numericalMeasures.find((d) => rightMeasureId ? d.id === rightMeasureId : d.unit !== leftMeasure.unit);
                rightMeasureId = rightMeasure.id;
                leftMeasure = getLeftMeasure(leftMeasure.id);
                const paletteId = isColorInConfig(oldChartConfig)
                    ? ((_b = oldChartConfig.fields.color.paletteId) !== null && _b !== void 0 ? _b : DEFAULT_CATEGORICAL_PALETTE_ID)
                    : DEFAULT_CATEGORICAL_PALETTE_ID;
                return produce(newChartConfig, (draft) => {
                    draft.fields.y = {
                        leftAxisComponentId: leftMeasure.id,
                        rightAxisComponentId: rightMeasureId,
                    };
                    draft.fields.color = {
                        type: "measures",
                        paletteId: paletteId,
                        colorMapping: mapValueIrisToColor({
                            paletteId,
                            dimensionValues: [leftMeasure.id, rightMeasureId].map((id) => ({
                                value: id,
                                label: id,
                            })),
                        }),
                    };
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
    comboLineColumn: {
        cubes: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.cubes = oldValue;
            });
        },
        annotations: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.annotations = oldValue;
            });
        },
        limits: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.limits = mapValues(oldValue, (limits) => limits.map(({ symbolType, ...rest }) => rest));
            });
        },
        conversionUnitsByComponentId: ({ oldValue, newChartConfig }) => {
            return produce(newChartConfig, (draft) => {
                draft.conversionUnitsByComponentId = oldValue;
            });
        },
        fields: {
            x: {
                componentId: ({ oldValue, newChartConfig, dimensions }) => {
                    const ok = dimensions.find((d) => isTemporalDimension(d) && d.id === oldValue);
                    if (ok) {
                        return produce(newChartConfig, (draft) => {
                            draft.fields.x.componentId = oldValue;
                        });
                    }
                    return newChartConfig;
                },
            },
            y: ({ newChartConfig, oldChartConfig, measures }) => {
                var _a, _b;
                const numericalMeasures = measures.filter(isNumericalMeasure);
                const numericalMeasureIds = numericalMeasures.map((d) => d.id);
                let leftMeasure = numericalMeasures.find((d) => d.id === numericalMeasureIds[0]);
                let rightMeasureId;
                const getMeasure = (id) => {
                    return numericalMeasures.find((d) => d.id === id);
                };
                switch (oldChartConfig.chartType) {
                    case "comboLineDual": {
                        const leftAxisId = oldChartConfig.fields.y.leftAxisComponentId;
                        leftMeasure = getMeasure(leftAxisId);
                        rightMeasureId = oldChartConfig.fields.y.rightAxisComponentId;
                        break;
                    }
                    case "comboLineSingle": {
                        leftMeasure = getMeasure(oldChartConfig.fields.y.componentIds[0]);
                        break;
                    }
                    case "area":
                    case "column":
                    case "line":
                    case "pie":
                    case "scatterplot": {
                        leftMeasure = getMeasure(oldChartConfig.fields.y.componentId);
                        break;
                    }
                    case "map": {
                        const { areaLayer, symbolLayer } = oldChartConfig.fields;
                        const leftAxisId = (_a = areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.color.componentId) !== null && _a !== void 0 ? _a : symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.measureId;
                        if (leftAxisId) {
                            leftMeasure = getMeasure(leftAxisId);
                        }
                        break;
                    }
                    case "bar": {
                        leftMeasure = getMeasure(oldChartConfig.fields.x.componentId);
                        break;
                    }
                    case "comboLineColumn":
                    case "table":
                        break;
                    default:
                        const _exhaustiveCheck = oldChartConfig;
                        return _exhaustiveCheck;
                }
                const rightMeasure = numericalMeasures.find((d) => rightMeasureId ? d.id === rightMeasureId : d.unit !== leftMeasure.unit);
                const lineComponentId = rightMeasure.id;
                const paletteId = isColorInConfig(oldChartConfig)
                    ? ((_b = oldChartConfig.fields.color.paletteId) !== null && _b !== void 0 ? _b : DEFAULT_CATEGORICAL_PALETTE_ID)
                    : DEFAULT_CATEGORICAL_PALETTE_ID;
                return produce(newChartConfig, (draft) => {
                    draft.fields.y = {
                        columnComponentId: leftMeasure.id,
                        lineComponentId,
                        lineAxisOrientation: "right",
                    };
                    draft.fields.color = {
                        type: "measures",
                        paletteId: paletteId,
                        colorMapping: mapValueIrisToColor({
                            paletteId,
                            dimensionValues: [leftMeasure.id, lineComponentId].map((id) => ({
                                value: id,
                                label: id,
                            })),
                        }),
                    };
                });
            },
        },
        interactiveFiltersConfig: interactiveFiltersAdjusters,
    },
};
// Needed to correctly retain chart options when switching to maps and tables.
const chartConfigsPathOverrides = {
    column: {
        bar: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.x.showValues": [{ path: "fields.y.showValues" }],
            "fields.x.customDomain": [{ path: "fields.y.customDomain" }],
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
        },
        map: {
            "fields.areaLayer.componentId": [{ path: "fields.x.componentId" }],
            "fields.areaLayer.color.componentId": [{ path: "fields.y.componentId" }],
        },
        table: {
            fields: [{ path: "fields.segment" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [{ path: "fields.y.componentId" }],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    bar: {
        column: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
            "fields.y.showValues": [{ path: "fields.x.showValues" }],
            "fields.y.customDomain": [{ path: "fields.x.customDomain" }],
        },
        line: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
            "fields.y.showValues": [{ path: "fields.x.showValues" }],
            "fields.y.customDomain": [{ path: "fields.x.customDomain" }],
        },
        area: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
            "fields.y.showValues": [{ path: "fields.x.showValues" }],
            "fields.y.customDomain": [{ path: "fields.x.customDomain" }],
        },
        pie: {
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
            "fields.y.showValues": [{ path: "fields.x.showValues" }],
        },
        map: {
            "fields.areaLayer.componentId": [{ path: "fields.y.componentId" }],
            "fields.areaLayer.color.componentId": [{ path: "fields.x.componentId" }],
        },
        table: {
            fields: [{ path: "fields.segment" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.x.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [{ path: "fields.x.componentId" }],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.x.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    line: {
        bar: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.x.showValues": [{ path: "fields.y.showValues" }],
            "fields.x.customDomain": [{ path: "fields.y.customDomain" }],
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
        },
        map: {
            "fields.areaLayer.color.componentId": [{ path: "fields.y.componentId" }],
        },
        table: {
            fields: [{ path: "fields.segment" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [{ path: "fields.y.componentId" }],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    area: {
        bar: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.x.showValues": [{ path: "fields.y.showValues" }],
            "fields.x.customDomain": [{ path: "fields.y.customDomain" }],
            "fields.y.componentId": [{ path: "fields.x.componentId" }],
        },
        map: {
            "fields.areaLayer.color.componentId": [{ path: "fields.y.componentId" }],
        },
        table: {
            fields: [{ path: "fields.segment" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [{ path: "fields.y.componentId" }],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    scatterplot: {
        map: {
            "fields.areaLayer.color.componentId": [{ path: "fields.y.componentId" }],
        },
        table: {
            fields: [{ path: "fields.segment" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [{ path: "fields.y.componentId" }],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    pie: {
        bar: {
            "fields.x.componentId": [{ path: "fields.y.componentId" }],
            "fields.x.showValues": [{ path: "fields.y.showValues" }],
            // We want to avoid running the logic for the y component twice.
            "fields.y.componentId": [{ path: "SKIP" }],
        },
        map: {
            "fields.areaLayer.componentId": [{ path: "fields.segment.componentId" }],
            "fields.areaLayer.color.componentId": [{ path: "fields.y.componentId" }],
        },
        table: {
            fields: [{ path: "fields.segment" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [{ path: "fields.y.componentId" }],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.y.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    table: {
        column: {
            "fields.segment": [{ path: "fields" }],
        },
        line: {
            "fields.segment": [{ path: "fields" }],
        },
        area: {
            "fields.segment": [{ path: "fields" }],
        },
        scatterplot: {
            "fields.segment": [{ path: "fields" }],
        },
        pie: {
            "fields.segment": [{ path: "fields" }],
        },
    },
    map: {
        column: {
            "fields.x.componentId": [{ path: "fields.areaLayer.componentId" }],
            "fields.y.componentId": [{ path: "fields.areaLayer.color.componentId" }],
        },
        bar: {
            "fields.x.componentId": [{ path: "fields.areaLayer.color.componentId" }],
            "fields.y.componentId": [{ path: "fields.areaLayer.componentId" }],
        },
        line: {
            "fields.y.componentId": [{ path: "fields.areaLayer.color.componentId" }],
        },
        area: {
            "fields.y.componentId": [{ path: "fields.areaLayer.color.componentId" }],
        },
        scatterplot: {
            "fields.y.componentId": [{ path: "fields.areaLayer.color.componentId" }],
        },
        pie: {
            "fields.x.componentId": [{ path: "fields.areaLayer.componentId" }],
            "fields.y.componentId": [{ path: "fields.areaLayer.color.componentId" }],
        },
        comboLineSingle: {
            "fields.y.componentIds": [
                {
                    path: "fields.areaLayer.color.componentId",
                    oldValue: (d) => d[0],
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [
                { path: "fields.areaLayer.color.componentId" },
            ],
        },
        comboLineColumn: {
            "fields.y": [
                {
                    path: "fields.areaLayer.color.componentId",
                    oldValue: (d) => {
                        return d.lineAxisOrientation === "left"
                            ? d.lineComponentId
                            : d.columnComponentId;
                    },
                },
            ],
        },
    },
    comboLineSingle: {
        column: {
            "fields.y.componentId": [{ path: "fields.y.componentIds" }],
        },
        bar: {
            "fields.x.componentId": [{ path: "fields.y.componentIds" }],
        },
        line: {
            "fields.y.componentId": [{ path: "fields.y.componentIds" }],
        },
        area: {
            "fields.y.componentId": [{ path: "fields.y.componentIds" }],
        },
        scatterplot: {
            "fields.y.componentId": [{ path: "fields.y.componentIds" }],
        },
        pie: {
            "fields.y.componentId": [{ path: "fields.y.componentIds" }],
        },
        map: {
            "fields.areaLayer.color.componentId": [
                {
                    path: "fields.y.componentIds",
                },
            ],
        },
        comboLineDual: {
            "fields.y.leftAxisComponentId": [
                {
                    path: "fields.y.componentIds",
                },
            ],
        },
        comboLineColumn: {
            "fields.y.lineComponentId": [{ path: "fields.y.componentIds" }],
        },
    },
    comboLineDual: {
        column: {
            "fields.y": [{ path: "fields.y" }],
        },
        bar: {
            "fields.x": [{ path: "fields.y" }],
        },
        line: {
            "fields.y": [{ path: "fields.y" }],
        },
        area: {
            "fields.y": [{ path: "fields.y" }],
        },
        scatterplot: {
            "fields.y": [{ path: "fields.y" }],
        },
        pie: {
            "fields.y": [{ path: "fields.y" }],
        },
        map: {
            "fields.areaLayer": [{ path: "fields.y" }],
        },
        comboLineSingle: {
            "fields.y": [{ path: "fields.y" }],
        },
        comboLineColumn: {
            "fields.y": [{ path: "fields.y" }],
        },
    },
    comboLineColumn: {
        column: {
            "fields.y": [{ path: "fields.y" }],
        },
        bar: {
            "fields.x": [{ path: "fields.y" }],
        },
        line: {
            "fields.y": [{ path: "fields.y" }],
        },
        area: {
            "fields.y": [{ path: "fields.y" }],
        },
        scatterplot: {
            "fields.y": [{ path: "fields.y" }],
        },
        pie: {
            "fields.y": [{ path: "fields.y" }],
        },
        map: {
            "fields.areaLayer": [{ path: "fields.y" }],
        },
        comboLineSingle: {
            "fields.y": [{ path: "fields.y" }],
        },
        comboLineDual: {
            "fields.y": [{ path: "fields.y" }],
        },
    },
};
const adjustSegmentSorting = ({ segment, acceptedValues, defaultValue, }) => {
    const sorting = segment.sorting;
    const sortingType = sorting === null || sorting === void 0 ? void 0 : sorting.sortingType;
    const newSorting = sorting
        ? sortingType && acceptedValues.includes(sortingType)
            ? sorting
            : { ...sorting, sortingType: defaultValue }
        : DEFAULT_SORTING;
    return newSorting;
};
const categoricalEnabledChartTypes = [
    "column",
    "bar",
    "pie",
];
const geoEnabledChartTypes = [
    "column",
    "bar",
    "map",
    "pie",
];
const multipleNumericalMeasuresEnabledChartTypes = [
    "scatterplot",
];
const timeEnabledChartTypes = [
    "area",
    "column",
    "bar",
    "line",
];
export const getEnabledChartTypes = ({ dimensions, measures, cubeCount, }) => {
    const numericalMeasures = measures.filter(isNumericalMeasure);
    const ordinalMeasures = measures.filter(isOrdinalMeasure);
    const categoricalDimensions = getCategoricalDimensions(dimensions);
    const geoDimensions = getGeoDimensions(dimensions);
    const temporalDimensions = dimensions.filter((d) => isTemporalDimension(d) || isTemporalEntityDimension(d));
    const possibleChartTypesDict = Object.fromEntries(chartTypes.map((chartType) => [
        chartType,
        {
            enabled: chartType === "table",
            message: undefined,
        },
    ]));
    const enableChartType = (chartType) => {
        possibleChartTypesDict[chartType] = {
            enabled: true,
            message: undefined,
        };
    };
    const enableChartTypes = (chartTypes) => {
        for (const chartType of chartTypes) {
            enableChartType(chartType);
        }
    };
    const maybeDisableChartType = (chartType, message) => {
        if (!possibleChartTypesDict[chartType].enabled &&
            !possibleChartTypesDict[chartType].message) {
            possibleChartTypesDict[chartType] = {
                enabled: false,
                message,
            };
        }
    };
    const maybeDisableChartTypes = (chartTypes, message) => {
        for (const chartType of chartTypes) {
            maybeDisableChartType(chartType, message);
        }
    };
    if (numericalMeasures.length > 0) {
        if (categoricalDimensions.length > 0) {
            enableChartTypes(categoricalEnabledChartTypes);
        }
        else {
            maybeDisableChartTypes(categoricalEnabledChartTypes, t({
                id: "controls.chart.disabled.categorical",
                message: "At least one categorical dimension is required.",
            }));
        }
        if (geoDimensions.length > 0) {
            enableChartTypes(geoEnabledChartTypes);
        }
        else {
            maybeDisableChartTypes(geoEnabledChartTypes, t({
                id: "controls.chart.disabled.geographical",
                message: "At least one geographical dimension is required.",
            }));
        }
        if (numericalMeasures.length > 1) {
            enableChartTypes(multipleNumericalMeasuresEnabledChartTypes);
            if (temporalDimensions.length > 0) {
                const measuresWithUnit = numericalMeasures.filter((d) => d.unit);
                const uniqueUnits = Array.from(new Set(measuresWithUnit.map((d) => d.unit)));
                if (uniqueUnits.length > 1) {
                    enableChartTypes(comboDifferentUnitChartTypes);
                }
                else {
                    maybeDisableChartTypes(comboDifferentUnitChartTypes, t({
                        id: "controls.chart.disabled.different-unit",
                        message: "At least two numerical measures with different units are required.",
                    }));
                }
                const unitCounts = rollup(measuresWithUnit, (v) => v.length, (d) => d.unit);
                if (Array.from(unitCounts.values()).some((d) => d > 1)) {
                    enableChartTypes(comboSameUnitChartTypes);
                }
                else {
                    maybeDisableChartTypes(comboSameUnitChartTypes, t({
                        id: "controls.chart.disabled.same-unit",
                        message: "At least two numerical measures with the same unit are required.",
                    }));
                }
            }
            else {
                maybeDisableChartTypes(comboChartTypes, t({
                    id: "controls.chart.disabled.temporal",
                    message: "At least one temporal dimension is required.",
                }));
            }
        }
        else {
            maybeDisableChartTypes([...multipleNumericalMeasuresEnabledChartTypes, ...comboChartTypes], t({
                id: "controls.chart.disabled.multiple-measures",
                message: "At least two numerical measures are required.",
            }));
        }
        if (temporalDimensions.length > 0) {
            enableChartTypes(timeEnabledChartTypes);
        }
        else {
            maybeDisableChartTypes(timeEnabledChartTypes, t({
                id: "controls.chart.disabled.temporal",
                message: "At least one temporal dimension is required.",
            }));
        }
    }
    else {
        maybeDisableChartTypes(chartTypes.filter((d) => d !== "table"), t({
            id: "controls.chart.disabled.numerical",
            message: "At least one numerical measure is required.",
        }));
    }
    if (ordinalMeasures.length > 0 && geoDimensions.length > 0) {
        enableChartType("map");
    }
    else {
        maybeDisableChartType("map", "At least one ordinal measure and one geographical dimension are required.");
    }
    const chartTypesOrder = getChartTypeOrder({ cubeCount });
    const enabledChartTypes = chartTypes
        .filter((d) => possibleChartTypesDict[d].enabled)
        .sort((a, b) => chartTypesOrder[a] - chartTypesOrder[b]);
    return {
        enabledChartTypes,
        possibleChartTypesDict,
    };
};
export const getFieldComponentIds = (fields) => {
    return new Set(Object.values(fields).flatMap((f) => (f === null || f === void 0 ? void 0 : f.componentId) ? [f.componentId] : []));
};
export const getGroupedFieldIds = (fields) => {
    return new Set(Object.values(fields).flatMap((f) => f && f.isGroup ? [f.componentId] : []));
};
export const getHiddenFieldIds = (fields) => {
    return new Set(Object.values(fields).flatMap((f) => f && f.isHidden ? [f.componentId] : []));
};
export const getFieldComponentId = (fields, field) => {
    var _a;
    // Multi axis charts have multiple component ids in the y field.
    return (_a = fields[field]) === null || _a === void 0 ? void 0 : _a.componentId;
};
const getSingleColorField = ({ oldColorField, }) => {
    return {
        type: "single",
        paletteId: oldColorField.paletteId,
        color: oldColorField.type === "single"
            ? oldColorField.color
            : Object.values(oldColorField.colorMapping)[0],
    };
};
const getSegmentColorField = ({ oldColorField, segmentDimension, }) => {
    var _a, _b;
    const paletteId = (_a = oldColorField === null || oldColorField === void 0 ? void 0 : oldColorField.paletteId) !== null && _a !== void 0 ? _a : DEFAULT_CATEGORICAL_PALETTE_ID;
    return {
        type: "segment",
        paletteId,
        colorMapping: mapValueIrisToColor({
            paletteId,
            dimensionValues: (_b = segmentDimension === null || segmentDimension === void 0 ? void 0 : segmentDimension.values) !== null && _b !== void 0 ? _b : [],
            colorMapping: (oldColorField === null || oldColorField === void 0 ? void 0 : oldColorField.type) === "segment"
                ? oldColorField.colorMapping
                : undefined,
        }),
    };
};
const convertTableFieldsToSegmentAndColorFields = ({ fields, dimensions, measures, }) => {
    var _a;
    const groupedColumns = (_a = group(Object.values(fields), (d) => d.isGroup)
        .get(true)) === null || _a === void 0 ? void 0 : _a.filter((d) => SEGMENT_ENABLED_COMPONENTS.includes(d.componentType)).sort((a, b) => a.index - b.index);
    const component = groupedColumns === null || groupedColumns === void 0 ? void 0 : groupedColumns[0];
    if (!component) {
        return;
    }
    const { componentId } = component;
    const actualComponent = [...dimensions, ...measures].find((d) => d.id === componentId);
    const paletteId = getDefaultCategoricalPaletteId(actualComponent);
    return {
        segment: {
            componentId,
            showValuesMapping: {},
        },
        color: {
            type: "segment",
            paletteId: paletteId,
            colorMapping: mapValueIrisToColor({
                paletteId: paletteId,
                dimensionValues: actualComponent.values,
            }),
        },
    };
};
export const getChartSymbol = (chartType) => {
    switch (chartType) {
        case "area":
        case "column":
        case "bar":
        case "comboLineColumn":
        case "pie":
        case "map":
        case "table":
            return "square";
        case "comboLineDual":
        case "comboLineSingle":
        case "line":
            return "line";
        case "scatterplot":
            return "circle";
        default:
            const _exhaustiveCheck = chartType;
            return _exhaustiveCheck;
    }
};
