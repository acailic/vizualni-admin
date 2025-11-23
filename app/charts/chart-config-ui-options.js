import { i18n } from "@lingui/core";
import { defineMessage, t } from "@lingui/macro";
import { extent, group } from "d3-array";
import { scaleLinear } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import get from "lodash/get";
import setWith from "lodash/setWith";
import unset from "lodash/unset";
import { DEFAULT_SORTING, initializeMapLayerField } from "@/charts";
import { DEFAULT_FIXED_COLOR_FIELD, getDefaultCategoricalColorField, getDefaultNumericalColorField, } from "@/charts/map/constants";
import { checkForMissingValuesInSegments, getSegment, parseOptionalNumericVariable, parseStringVariable, } from "@/charts/shared/chart-helpers";
import { getStackedXScale, getStackedYScale, } from "@/charts/shared/stacked-helpers";
import { fieldHasComponentId, getAnimationField, isSortingInConfig, } from "@/config-types";
import { makeMultiFilter } from "@/config-utils";
import { getFieldLabel } from "@/configurator/components/field-i18n";
import { mapValueIrisToColor } from "@/configurator/components/ui-helpers";
import { ANIMATION_ENABLED_COMPONENTS, isNumericalMeasure, isOrdinalMeasure, isTemporalDimension, isTemporalEntityDimension, isTemporalOrdinalDimension, MULTI_FILTER_ENABLED_COMPONENTS, SEGMENT_ENABLED_COMPONENTS, } from "@/domain/data";
import { getDefaultCategoricalPaletteId, getPalette } from "@/palettes";
const onColorComponentScaleTypeChange = (value, { chartConfig, field }) => {
    const basePath = `fields.${field}`;
    const interpolationTypePath = `${basePath}.color.interpolationType`;
    const nbClassPath = `${basePath}.color.nbClass`;
    if (value === "continuous") {
        setWith(chartConfig, interpolationTypePath, "linear", Object);
        unset(chartConfig, nbClassPath);
    }
    else if (value === "discrete") {
        setWith(chartConfig, interpolationTypePath, "jenks", Object);
        setWith(chartConfig, nbClassPath, 3, Object);
    }
};
const onColorComponentIdChange = (id, { chartConfig, dimensions, measures, field }) => {
    const basePath = `fields["${field}"]`;
    const components = [...dimensions, ...measures];
    let newField = DEFAULT_FIXED_COLOR_FIELD;
    const component = components.find((d) => d.id === id);
    const currentColorComponentId = get(chartConfig, `${basePath}.color.componentId`);
    if (component) {
        const colorPalette = get(chartConfig, `${basePath}.color.palette`);
        if (MULTI_FILTER_ENABLED_COMPONENTS.includes(component.__typename) ||
            isOrdinalMeasure(component)) {
            const paletteId = getDefaultCategoricalPaletteId(component, colorPalette === null || colorPalette === void 0 ? void 0 : colorPalette.paletteId);
            newField = getDefaultCategoricalColorField({
                id,
                paletteId,
                dimensionValues: component.values,
            });
        }
        else if (isNumericalMeasure(component)) {
            newField = getDefaultNumericalColorField({
                id,
                colorPalette,
            });
        }
        // Remove old filter.
        const cube = chartConfig.cubes.find((d) => d.iri === component.cubeIri);
        if (cube) {
            unset(cube, `filters["${currentColorComponentId}"]`);
        }
    }
    setWith(chartConfig, `${basePath}.color`, newField, Object);
};
const getDefaultSegmentSorting = () => [
    {
        sortingType: "byAuto",
        sortingOrder: ["asc", "desc"],
    },
    {
        sortingType: "byDimensionLabel",
        sortingOrder: ["asc", "desc"],
    },
    {
        sortingType: "byTotalSize",
        sortingOrder: ["asc", "desc"],
        getDisabledState: (chartConfig) => {
            const animationPresent = !!getAnimationField(chartConfig);
            if (animationPresent) {
                return {
                    disabled: true,
                    warnMessage: t({
                        id: "controls.sorting.byTotalSize.disabled-by-animation",
                        message: "Sorting by total size is disabled during animation.",
                    }),
                };
            }
            return {
                disabled: false,
            };
        },
    },
];
export const AREA_SEGMENT_SORTING = getDefaultSegmentSorting();
const LINE_SEGMENT_SORTING = [
    { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
    { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
];
export const COLUMN_SEGMENT_SORTING = getDefaultSegmentSorting();
const BAR_SEGMENT_SORTING = getDefaultSegmentSorting();
export const PIE_SEGMENT_SORTING = [
    { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
    { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
    { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
];
export const ANIMATION_FIELD_SPEC = {
    field: "animation",
    optional: true,
    idAttributes: [],
    componentTypes: ANIMATION_ENABLED_COMPONENTS,
    filters: true,
    hide: true,
    disableInteractiveFilters: true,
    onChange: (id, { chartConfig, initializing }) => {
        if (initializing || !chartConfig.fields.animation) {
            chartConfig.fields.animation = {
                componentId: id,
                showPlayButton: true,
                duration: 30,
                type: "continuous",
                dynamicScales: false,
            };
        }
        else {
            chartConfig.fields.animation.componentId = id;
        }
    },
    getDisabledState: (chartConfig, components) => {
        var _a, _b;
        const temporalDimensions = components.filter((d) => {
            return (isTemporalDimension(d) ||
                isTemporalEntityDimension(d) ||
                isTemporalOrdinalDimension(d));
        });
        const noTemporalDimensions = temporalDimensions.length === 0;
        if (noTemporalDimensions) {
            return {
                disabled: true,
                warnMessage: t({
                    id: "controls.section.animation.no-temporal-dimensions",
                    message: "There is no dimension that can be animated.",
                }),
            };
        }
        const fieldComponentsMap = Object.fromEntries(Object.entries(fieldHasComponentId(chartConfig))
            .filter((d) => d[0] !== "animation")
            .map(([k, v]) => [v.componentId, k]));
        const temporalFieldComponentIds = temporalDimensions.filter((d) => {
            return fieldComponentsMap[d.id];
        });
        if (temporalDimensions.length === temporalFieldComponentIds.length) {
            return {
                disabled: true,
                warnMessage: i18n._(defineMessage({
                    id: "controls.section.animation.no-available-temporal-dimensions",
                    message: "There are no available temporal dimensions to use. Change some of the following encodings: {fields} to enable animation.",
                }), {
                    fields: temporalFieldComponentIds
                        .map((d) => getFieldLabel(fieldComponentsMap[d.id]))
                        .join(", "),
                }),
            };
        }
        if (isSortingInConfig(chartConfig) &&
            ((_b = (_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.sorting) === null || _b === void 0 ? void 0 : _b.sortingType) === "byTotalSize") {
            return {
                disabled: true,
                warnMessage: t({
                    id: "controls.section.animation.disabled-by-sorting",
                    message: "Animation is disabled when sorting by total size.",
                }),
            };
        }
        return {
            disabled: false,
        };
    },
};
const isMissingDataPresent = (chartConfig, data) => {
    const { fields } = chartConfig;
    const grouped = group(data.filter((d) => {
        const y = d[fields.y.componentId];
        return y !== null && y !== undefined;
    }), (d) => d[fields.x.componentId]);
    const segments = Array.from(new Set(data.map((d) => { var _a; return getSegment((_a = fields.segment) === null || _a === void 0 ? void 0 : _a.componentId)(d); })));
    return checkForMissingValuesInSegments(grouped, segments);
};
export const disableStacked = (d) => {
    return (d === null || d === void 0 ? void 0 : d.scaleType) !== "Ratio";
};
export const defaultSegmentOnChange = (id, { chartConfig, dimensions, measures, selectedValues }) => {
    const components = [...dimensions, ...measures];
    const component = components.find((d) => d.id === id);
    const paletteId = getDefaultCategoricalPaletteId(component, chartConfig.fields.color && "paletteId" in chartConfig.fields.color
        ? chartConfig.fields.color.paletteId
        : undefined);
    const colorMapping = mapValueIrisToColor({
        paletteId,
        dimensionValues: component ? component.values : selectedValues,
    });
    if (chartConfig.fields.segment) {
        chartConfig.fields.segment.componentId = id;
        chartConfig.fields.segment.showValuesMapping = {};
    }
    else {
        chartConfig.fields.segment = {
            componentId: id,
            sorting: DEFAULT_SORTING,
            showValuesMapping: {},
        };
        chartConfig.fields.color = {
            type: "segment",
            paletteId: paletteId,
            colorMapping,
        };
    }
    if (!selectedValues.length || !component) {
        return;
    }
    const multiFilter = makeMultiFilter(selectedValues.map((d) => d.value));
    const cube = chartConfig.cubes.find((d) => d.iri === component.cubeIri);
    if (cube) {
        cube.filters[id] = multiFilter;
    }
};
const onMapFieldChange = (id, { chartConfig, dimensions, measures, field }) => {
    initializeMapLayerField({
        chartConfig,
        field,
        componentId: id,
        dimensions,
        measures,
    });
};
const getNonStackedDomain = (observations, getValue) => {
    const [min, max] = extent(observations.map(getValue));
    return scaleLinear()
        .domain([Math.min(min, 0), max])
        .nice()
        .domain();
};
export const getChartSpec = (chartConfig) => {
    return chartConfigOptionsUISpec[chartConfig.chartType];
};
const chartConfigOptionsUISpec = {
    area: {
        chartType: "area",
        encodings: [
            {
                field: "y",
                idAttributes: ["componentId"],
                optional: false,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                onChange: (id, { chartConfig, measures }) => {
                    const yMeasure = measures.find((d) => d.id === id);
                    if (disableStacked(yMeasure)) {
                        delete chartConfig.fields.segment;
                    }
                },
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "schemaCategory10",
                        color: schemeCategory10[0],
                    },
                    showValues: {
                        getDisabledState: (chartConfig) => {
                            return {
                                disabled: !!chartConfig.fields.segment,
                            };
                        },
                    },
                    adjustScaleDomain: {
                        getDefaultDomain: ({ chartConfig, observations }) => {
                            const { segment } = chartConfig.fields;
                            const getX = (o) => {
                                const x = o[chartConfig.fields.x.componentId];
                                return parseStringVariable(x);
                            };
                            const getY = (o) => {
                                var _a, _b;
                                const y = (_a = o[chartConfig.fields.y.componentId]) !== null && _a !== void 0 ? _a : null;
                                return (_b = parseOptionalNumericVariable(y)) !== null && _b !== void 0 ? _b : 0;
                            };
                            if (segment) {
                                const yScale = getStackedYScale(observations, {
                                    normalize: chartConfig.interactiveFiltersConfig.calculation.type ===
                                        "percent",
                                    getX,
                                    getY,
                                });
                                return yScale.domain();
                            }
                            return getNonStackedDomain(observations, getY);
                        },
                    },
                    convertUnit: {},
                },
            },
            {
                field: "x",
                idAttributes: ["componentId"],
                optional: false,
                componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
                filters: true,
            },
            {
                field: "segment",
                optional: true,
                idAttributes: ["componentId"],
                componentTypes: SEGMENT_ENABLED_COMPONENTS,
                filters: true,
                sorting: AREA_SEGMENT_SORTING,
                onChange: (id, options) => {
                    defaultSegmentOnChange(id, options);
                    delete options.chartConfig.fields.y.customDomain;
                },
                onDelete: ({ chartConfig }) => {
                    delete chartConfig.fields.y.customDomain;
                },
                getDisabledState: (chartConfig, components, data) => {
                    const yId = chartConfig.fields.y.componentId;
                    const yDimension = components.find((d) => d.id === yId);
                    const disabledStacked = disableStacked(yDimension);
                    if (disabledStacked) {
                        return {
                            disabled: true,
                            warnMessage: t({
                                id: "controls.segment.stacked.disabled-by-scale-type",
                                message: "Stacked layout can only be enabled if the vertical axis dimension has a ratio scale.",
                            }),
                        };
                    }
                    const missingDataPresent = isMissingDataPresent(chartConfig, data);
                    const imputationType = chartConfig.fields.y.imputationType;
                    const disabled = false;
                    const warnMessage = missingDataPresent && (!imputationType || imputationType === "none")
                        ? t({
                            id: "controls.section.imputation.explanation",
                            message: "For this chart type, replacement values should be assigned to missing values. Decide on the imputation logic or switch to another chart type.",
                        })
                        : undefined;
                    return {
                        disabled,
                        warnMessage,
                    };
                },
                options: {
                    calculation: {},
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    imputation: {
                        shouldShow: (chartConfig, data) => {
                            return isMissingDataPresent(chartConfig, data);
                        },
                    },
                    useAbbreviations: {},
                },
            },
        ],
        interactiveFilters: ["legend", "timeRange"],
    },
    column: {
        chartType: "column",
        encodings: [
            {
                field: "y",
                optional: false,
                idAttributes: ["componentId"],
                componentTypes: ["NumericalMeasure"],
                filters: false,
                onChange: (id, { chartConfig, measures }) => {
                    var _a;
                    if (((_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.type) === "stacked") {
                        const yMeasure = measures.find((d) => d.id === id);
                        if (disableStacked(yMeasure)) {
                            setWith(chartConfig, "fields.segment.type", "grouped", Object);
                            if (chartConfig.interactiveFiltersConfig.calculation) {
                                setWith(chartConfig, "interactiveFiltersConfig.calculation", { active: false, type: "identity" }, Object);
                            }
                        }
                    }
                },
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    showValues: {
                        getDisabledState: (chartConfig) => {
                            return {
                                disabled: !!chartConfig.fields.segment,
                            };
                        },
                    },
                    showStandardError: {},
                    showConfidenceInterval: {},
                    adjustScaleDomain: {
                        getDefaultDomain: ({ chartConfig, observations }) => {
                            const { segment } = chartConfig.fields;
                            const getX = (o) => {
                                const x = o[chartConfig.fields.x.componentId];
                                return parseStringVariable(x);
                            };
                            const getY = (o) => {
                                var _a, _b;
                                const y = (_a = o[chartConfig.fields.y.componentId]) !== null && _a !== void 0 ? _a : null;
                                return (_b = parseOptionalNumericVariable(y)) !== null && _b !== void 0 ? _b : 0;
                            };
                            if (segment && segment.type === "stacked") {
                                const yScale = getStackedYScale(observations, {
                                    normalize: chartConfig.interactiveFiltersConfig.calculation.type ===
                                        "percent",
                                    getX,
                                    getY,
                                });
                                return yScale.domain();
                            }
                            return getNonStackedDomain(observations, getY);
                        },
                    },
                    convertUnit: {},
                },
            },
            {
                field: "x",
                optional: false,
                idAttributes: ["componentId"],
                componentTypes: [
                    "TemporalDimension",
                    "TemporalEntityDimension",
                    "TemporalOrdinalDimension",
                    "NominalDimension",
                    "OrdinalDimension",
                    "GeoCoordinatesDimension",
                    "GeoShapesDimension",
                ],
                filters: true,
                sorting: [
                    { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
                    { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
                    { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
                ],
                onChange: (id, { chartConfig, dimensions }) => {
                    const component = dimensions.find((d) => d.id === id);
                    if (!isTemporalDimension(component)) {
                        setWith(chartConfig, "interactiveFiltersConfig.timeRange.active", false, Object);
                    }
                },
                options: {
                    useAbbreviations: {},
                },
            },
            {
                field: "segment",
                optional: true,
                idAttributes: ["componentId"],
                componentTypes: SEGMENT_ENABLED_COMPONENTS,
                filters: true,
                sorting: COLUMN_SEGMENT_SORTING,
                onChange: (id, options) => {
                    const { chartConfig, dimensions, measures } = options;
                    defaultSegmentOnChange(id, options);
                    chartConfig.fields.y.showValues = false;
                    delete chartConfig.fields.y.customDomain;
                    const components = [...dimensions, ...measures];
                    const segment = get(chartConfig, "fields.segment");
                    const yComponent = components.find((d) => d.id === chartConfig.fields.y.componentId);
                    setWith(chartConfig, "fields.segment", {
                        ...segment,
                        type: disableStacked(yComponent) ? "grouped" : "stacked",
                    }, Object);
                },
                onDelete: ({ chartConfig }) => {
                    delete chartConfig.fields.y.customDomain;
                },
                options: {
                    calculation: {
                        getDisabledState: (chartConfig) => {
                            var _a;
                            const grouped = ((_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.type) === "grouped";
                            return {
                                disabled: grouped,
                                warnMessage: grouped
                                    ? t({
                                        id: "controls.calculation.disabled-by-grouped",
                                        message: "100% mode cannot be used with a grouped layout.",
                                    })
                                    : undefined,
                            };
                        },
                    },
                    chartSubType: {
                        getValues: (chartConfig, dimensions) => {
                            const yId = chartConfig.fields.y.componentId;
                            const yDimension = dimensions.find((d) => d.id === yId);
                            const disabledStacked = disableStacked(yDimension);
                            return [
                                {
                                    value: "stacked",
                                    disabled: disabledStacked,
                                    warnMessage: disabledStacked
                                        ? t({
                                            id: "controls.segment.stacked.disabled-by-scale-type",
                                            message: "Stacked layout can only be enabled if the vertical axis dimension has a ratio scale.",
                                        })
                                        : undefined,
                                },
                                {
                                    value: "grouped",
                                    disabled: false,
                                },
                            ];
                        },
                        onChange: (d, { chartConfig }) => {
                            if (chartConfig.interactiveFiltersConfig && d === "grouped") {
                                const path = "interactiveFiltersConfig.calculation";
                                setWith(chartConfig, path, { active: false, type: "identity" });
                            }
                        },
                    },
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    useAbbreviations: {},
                },
            },
            ANIMATION_FIELD_SPEC,
        ],
        interactiveFilters: ["legend", "timeRange", "animation"],
    },
    bar: {
        chartType: "bar",
        encodings: [
            {
                field: "x",
                optional: false,
                idAttributes: ["componentId"],
                componentTypes: ["NumericalMeasure"],
                filters: false,
                onChange: (id, { chartConfig, measures }) => {
                    var _a;
                    if (((_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.type) === "stacked") {
                        const xMeasure = measures.find((d) => d.id === id);
                        if (disableStacked(xMeasure)) {
                            setWith(chartConfig, "fields.segment.type", "grouped", Object);
                            if (chartConfig.interactiveFiltersConfig.calculation) {
                                setWith(chartConfig, "interactiveFiltersConfig.calculation", { active: false, type: "identity" }, Object);
                            }
                        }
                    }
                },
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    showValues: {
                        getDisabledState: (chartConfig) => {
                            return {
                                disabled: !!chartConfig.fields.segment,
                            };
                        },
                    },
                    showStandardError: {},
                    showConfidenceInterval: {},
                    adjustScaleDomain: {
                        getDefaultDomain: ({ chartConfig, observations }) => {
                            const { segment } = chartConfig.fields;
                            const getX = (o) => {
                                var _a, _b;
                                const x = (_a = o[chartConfig.fields.x.componentId]) !== null && _a !== void 0 ? _a : null;
                                return (_b = parseOptionalNumericVariable(x)) !== null && _b !== void 0 ? _b : 0;
                            };
                            const getY = (o) => {
                                const y = o[chartConfig.fields.y.componentId];
                                return parseStringVariable(y);
                            };
                            if (segment && segment.type === "stacked") {
                                const xScale = getStackedXScale(observations, {
                                    normalize: chartConfig.interactiveFiltersConfig.calculation.type ===
                                        "percent",
                                    getX,
                                    getY,
                                });
                                return xScale.domain();
                            }
                            return getNonStackedDomain(observations, getX);
                        },
                    },
                    convertUnit: {},
                },
            },
            {
                field: "y",
                optional: false,
                idAttributes: ["componentId"],
                componentTypes: [
                    "TemporalDimension",
                    "TemporalEntityDimension",
                    "TemporalOrdinalDimension",
                    "NominalDimension",
                    "OrdinalDimension",
                    "GeoCoordinatesDimension",
                    "GeoShapesDimension",
                ],
                filters: true,
                sorting: [
                    { sortingType: "byAuto", sortingOrder: ["asc", "desc"] },
                    { sortingType: "byMeasure", sortingOrder: ["asc", "desc"] },
                    { sortingType: "byDimensionLabel", sortingOrder: ["asc", "desc"] },
                ],
                onChange: (id, { chartConfig, dimensions }) => {
                    const component = dimensions.find((d) => d.id === id);
                    if (!isTemporalDimension(component)) {
                        setWith(chartConfig, "interactiveFiltersConfig.timeRange.active", false, Object);
                    }
                },
                options: {
                    useAbbreviations: {},
                },
            },
            {
                field: "segment",
                optional: true,
                idAttributes: ["componentId"],
                componentTypes: SEGMENT_ENABLED_COMPONENTS,
                filters: true,
                sorting: BAR_SEGMENT_SORTING,
                onChange: (id, options) => {
                    const { chartConfig, dimensions, measures } = options;
                    defaultSegmentOnChange(id, options);
                    chartConfig.fields.x.showValues = false;
                    delete chartConfig.fields.x.customDomain;
                    const components = [...dimensions, ...measures];
                    const segment = get(chartConfig, "fields.segment");
                    const xComponent = components.find((d) => d.id === chartConfig.fields.x.componentId);
                    setWith(chartConfig, "fields.segment", {
                        ...segment,
                        type: disableStacked(xComponent) ? "grouped" : "stacked",
                    }, Object);
                },
                onDelete: ({ chartConfig }) => {
                    delete chartConfig.fields.x.customDomain;
                },
                options: {
                    calculation: {
                        getDisabledState: (chartConfig) => {
                            var _a;
                            const grouped = ((_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.type) === "grouped";
                            return {
                                disabled: grouped,
                                warnMessage: grouped
                                    ? t({
                                        id: "controls.calculation.disabled-by-grouped",
                                        message: "100% mode cannot be used with a grouped layout.",
                                    })
                                    : undefined,
                            };
                        },
                    },
                    chartSubType: {
                        getValues: (chartConfig, dimensions) => {
                            const xId = chartConfig.fields.x.componentId;
                            const xDimension = dimensions.find((d) => d.id === xId);
                            const disabledStacked = disableStacked(xDimension);
                            return [
                                {
                                    value: "stacked",
                                    disabled: disabledStacked,
                                    warnMessage: disabledStacked
                                        ? t({
                                            id: "controls.segment.stacked.disabled-by-scale-type",
                                            message: "Stacked layout can only be enabled if the vertical axis dimension has a ratio scale.",
                                        })
                                        : undefined,
                                },
                                {
                                    value: "grouped",
                                    disabled: false,
                                },
                            ];
                        },
                        onChange: (d, { chartConfig }) => {
                            if (chartConfig.interactiveFiltersConfig && d === "grouped") {
                                const path = "interactiveFiltersConfig.calculation";
                                setWith(chartConfig, path, { active: false, type: "identity" });
                            }
                        },
                    },
                    colorPalette: {},
                    useAbbreviations: {},
                },
            },
            ANIMATION_FIELD_SPEC,
        ],
        interactiveFilters: ["legend", "timeRange", "animation"],
    },
    line: {
        chartType: "line",
        encodings: [
            {
                idAttributes: ["componentId"],
                field: "y",
                optional: false,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    showValues: {
                        getDisabledState: (chartConfig) => {
                            return {
                                disabled: !!chartConfig.fields.segment,
                            };
                        },
                    },
                    showStandardError: {},
                    showConfidenceInterval: {},
                    adjustScaleDomain: {
                        getDefaultDomain: ({ chartConfig, observations }) => {
                            const getY = (o) => {
                                var _a, _b;
                                const y = (_a = o[chartConfig.fields.y.componentId]) !== null && _a !== void 0 ? _a : null;
                                return (_b = parseOptionalNumericVariable(y)) !== null && _b !== void 0 ? _b : 0;
                            };
                            return getNonStackedDomain(observations, getY);
                        },
                    },
                    convertUnit: {},
                    showDots: {},
                    showDotsSize: {},
                },
            },
            {
                idAttributes: ["componentId"],
                field: "x",
                optional: false,
                componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
                filters: true,
            },
            {
                idAttributes: ["componentId"],
                field: "segment",
                optional: true,
                componentTypes: SEGMENT_ENABLED_COMPONENTS,
                filters: true,
                sorting: LINE_SEGMENT_SORTING,
                onChange: (id, options) => {
                    defaultSegmentOnChange(id, options);
                    delete options.chartConfig.fields.y.customDomain;
                },
                onDelete: ({ chartConfig }) => {
                    delete chartConfig.fields.y.customDomain;
                },
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    useAbbreviations: {},
                },
            },
        ],
        interactiveFilters: ["legend", "timeRange"],
    },
    map: {
        chartType: "map",
        encodings: [
            // Should this even be an encoding when it's not mapped to a component?
            {
                idAttributes: [],
                field: "baseLayer",
                optional: true,
                componentTypes: [],
                filters: false,
            },
            {
                idAttributes: ["componentId", "color.componentId"],
                field: "areaLayer",
                optional: true,
                componentTypes: ["GeoShapesDimension"],
                exclusive: false,
                filters: true,
                onChange: onMapFieldChange,
                options: {
                    colorComponent: {
                        componentTypes: [
                            "NumericalMeasure",
                            "OrdinalMeasure",
                            "TemporalOrdinalDimension",
                        ],
                        optional: false,
                        enableUseAbbreviations: true,
                        onComponentIdChange: onColorComponentIdChange,
                        onScaleTypeChange: onColorComponentScaleTypeChange,
                    },
                    convertUnit: {},
                },
            },
            {
                idAttributes: ["componentId", "color.componentId"],
                field: "symbolLayer",
                optional: true,
                componentTypes: ["GeoCoordinatesDimension", "GeoShapesDimension"],
                exclusive: false,
                filters: true,
                onChange: onMapFieldChange,
                options: {
                    colorComponent: {
                        componentTypes: [
                            "NumericalMeasure",
                            "OrdinalMeasure",
                            "GeoCoordinatesDimension",
                            "GeoShapesDimension",
                            "NominalDimension",
                            "OrdinalDimension",
                            "TemporalOrdinalDimension",
                        ],
                        optional: true,
                        enableUseAbbreviations: true,
                        onComponentIdChange: onColorComponentIdChange,
                        onScaleTypeChange: onColorComponentScaleTypeChange,
                    },
                    size: {
                        componentTypes: ["NumericalMeasure"],
                        optional: true,
                    },
                    convertUnit: {},
                },
            },
            {
                idAttributes: [],
                field: "customLayers",
                optional: true,
                componentTypes: [],
                filters: false,
            },
            ANIMATION_FIELD_SPEC,
        ],
        interactiveFilters: ["animation"],
    },
    pie: {
        chartType: "pie",
        encodings: [
            {
                idAttributes: ["componentId"],
                field: "y",
                optional: false,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    showValues: {},
                    convertUnit: {},
                },
            },
            {
                idAttributes: ["componentId"],
                field: "segment",
                optional: false,
                componentTypes: SEGMENT_ENABLED_COMPONENTS,
                filters: true,
                sorting: PIE_SEGMENT_SORTING,
                onChange: defaultSegmentOnChange,
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    useAbbreviations: {},
                },
            },
            ANIMATION_FIELD_SPEC,
        ],
        interactiveFilters: ["legend", "animation"],
    },
    scatterplot: {
        chartType: "scatterplot",
        encodings: [
            {
                idAttributes: ["componentId"],
                field: "x",
                optional: false,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    convertUnit: {},
                },
            },
            {
                idAttributes: ["componentId"],
                field: "y",
                optional: false,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    convertUnit: {},
                },
            },
            {
                idAttributes: ["componentId"],
                field: "segment",
                optional: false,
                componentTypes: SEGMENT_ENABLED_COMPONENTS,
                filters: true,
                onChange: defaultSegmentOnChange,
                options: {
                    colorPalette: {
                        type: "single",
                        paletteId: "category10",
                        color: schemeCategory10[0],
                    },
                    useAbbreviations: {},
                },
            },
            ANIMATION_FIELD_SPEC,
        ],
        interactiveFilters: ["legend", "animation"],
    },
    table: {
        // TODO: Add abbreviations here.
        chartType: "table",
        encodings: [],
        interactiveFilters: [],
    },
    comboLineSingle: {
        chartType: "comboLineSingle",
        encodings: [
            {
                idAttributes: ["componentIds"],
                field: "y",
                optional: false,
                // TODO: maybe we should even create the components here?
                customComponent: true,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    componentIds: {
                        onChange: (ids, options) => {
                            const { chartConfig } = options;
                            const { fields } = chartConfig;
                            const { color } = fields;
                            const palette = getPalette({ paletteId: color.paletteId });
                            const newColorMapping = Object.fromEntries(ids.map((id, i) => { var _a; return [id, (_a = color.colorMapping[i]) !== null && _a !== void 0 ? _a : palette[i]]; }));
                            chartConfig.fields.color.colorMapping = newColorMapping;
                        },
                    },
                    convertUnit: {},
                },
            },
            {
                idAttributes: ["componentId"],
                field: "x",
                optional: false,
                componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
                filters: true,
            },
        ],
        interactiveFilters: [],
    },
    comboLineDual: {
        chartType: "comboLineDual",
        encodings: [
            {
                field: "y",
                idAttributes: ["leftAxisComponentId", "rightAxisComponentId"],
                optional: false,
                customComponent: true,
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    leftAxisComponentId: {
                        onChange: (id, options) => {
                            const { chartConfig } = options;
                            const { fields } = chartConfig;
                            const { y, color } = fields;
                            chartConfig.fields.color.colorMapping = {
                                [id]: color.colorMapping[y.leftAxisComponentId],
                                [y.rightAxisComponentId]: color.colorMapping[y.rightAxisComponentId],
                            };
                        },
                    },
                    rightAxisComponentId: {
                        onChange: (id, options) => {
                            const { chartConfig } = options;
                            const { fields } = chartConfig;
                            const { y, color } = fields;
                            chartConfig.fields.color.colorMapping = {
                                [y.leftAxisComponentId]: color.colorMapping[y.leftAxisComponentId],
                                [id]: color.colorMapping[y.rightAxisComponentId],
                            };
                        },
                    },
                    convertUnit: {},
                },
            },
            {
                idAttributes: ["componentId"],
                field: "x",
                optional: false,
                componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
                filters: true,
            },
        ],
        interactiveFilters: [],
    },
    comboLineColumn: {
        chartType: "comboLineColumn",
        encodings: [
            {
                field: "y",
                optional: false,
                customComponent: true,
                idAttributes: ["lineComponentId", "columnComponentId"],
                componentTypes: ["NumericalMeasure"],
                filters: false,
                options: {
                    lineComponentId: {
                        onChange: (id, options) => {
                            const { chartConfig } = options;
                            const { fields } = chartConfig;
                            const { y, color } = fields;
                            const lineColor = color.colorMapping[y.lineComponentId];
                            const columnColor = color.colorMapping[y.columnComponentId];
                            chartConfig.fields.color.colorMapping =
                                y.lineAxisOrientation === "left"
                                    ? { [id]: lineColor, [y.columnComponentId]: columnColor }
                                    : { [y.columnComponentId]: columnColor, [id]: lineColor };
                        },
                    },
                    columnComponentId: {
                        onChange: (id, options) => {
                            const { chartConfig } = options;
                            const { fields } = chartConfig;
                            const { y, color } = fields;
                            const columnColor = color.colorMapping[y.columnComponentId];
                            const lineColor = color.colorMapping[y.lineComponentId];
                            chartConfig.fields.color.colorMapping =
                                y.lineAxisOrientation === "left"
                                    ? { [y.lineComponentId]: lineColor, [id]: columnColor }
                                    : { [id]: columnColor, [y.lineComponentId]: lineColor };
                        },
                    },
                    lineAxisOrientation: {
                        onChange: (_, options) => {
                            const { chartConfig } = options;
                            const { fields } = chartConfig;
                            const { y, color } = fields;
                            const lineAxisLeft = y.lineAxisOrientation === "left";
                            // Need the correct order to not enable "Reset color palette" button.
                            const firstId = lineAxisLeft
                                ? y.columnComponentId
                                : y.lineComponentId;
                            const secondId = lineAxisLeft
                                ? y.lineComponentId
                                : y.columnComponentId;
                            chartConfig.fields.color.colorMapping = {
                                [firstId]: color.colorMapping[secondId],
                                [secondId]: color.colorMapping[firstId],
                            };
                        },
                    },
                    convertUnit: {},
                },
            },
            {
                field: "x",
                idAttributes: ["componentId"],
                optional: false,
                componentTypes: ["TemporalDimension", "TemporalEntityDimension"],
                filters: true,
            },
        ],
        interactiveFilters: [],
    },
};
export const getChartFieldChangeSideEffect = (chartConfig, field) => {
    const chartSpec = getChartSpec(chartConfig);
    const encoding = chartSpec.encodings.find((d) => d.field === field);
    return encoding === null || encoding === void 0 ? void 0 : encoding.onChange;
};
export const getChartFieldDeleteSideEffect = (chartConfig, field) => {
    const chartSpec = getChartSpec(chartConfig);
    const encoding = chartSpec.encodings.find((d) => d.field === field);
    return encoding === null || encoding === void 0 ? void 0 : encoding.onDelete;
};
export const getChartFieldOptionChangeSideEffect = (chartConfig, field, path) => {
    const chartSpec = getChartSpec(chartConfig);
    const encoding = chartSpec.encodings.find((d) => d.field === field);
    switch (`${field}.${path}`) {
        case "segment.type":
            return get(encoding, "options.chartSubType.onChange");
        case "areaLayer.color.componentId":
        case "symbolLayer.color.componentId":
            return get(encoding, "options.colorComponent.onComponentIdChange");
        case "areaLayer.color.scaleType":
        case "symbolLayer.color.scaleType":
            return get(encoding, "options.colorComponent.onScaleTypeChange");
        case "y.componentIds":
            return get(encoding, "options.componentIds.onChange");
        case "y.lineAxisOrientation":
            return get(encoding, "options.lineAxisOrientation.onChange");
        case "y.leftAxisComponentId":
            return get(encoding, "options.leftAxisComponentId.onChange");
        case "y.rightAxisComponentId":
            return get(encoding, "options.rightAxisComponentId.onChange");
        case "y.lineComponentId":
            return get(encoding, "options.lineComponentId.onChange");
        case "y.columnComponentId":
            return get(encoding, "options.columnComponentId.onChange");
    }
};
