/* eslint-disable no-redeclare */
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
// Define PALETTE_TYPE locally to avoid Prisma client dependency for static builds
export var PALETTE_TYPE;
(function (PALETTE_TYPE) {
    PALETTE_TYPE["SEQUENTIAL"] = "SEQUENTIAL";
    PALETTE_TYPE["DIVERGING"] = "DIVERGING";
    PALETTE_TYPE["CATEGORICAL"] = "CATEGORICAL";
})(PALETTE_TYPE || (PALETTE_TYPE = {}));
const DimensionType = t.union([
    t.literal("NominalDimension"),
    t.literal("OrdinalDimension"),
    t.literal("TemporalDimension"),
    t.literal("TemporalEntityDimension"),
    t.literal("TemporalOrdinalDimension"),
    t.literal("GeoCoordinatesDimension"),
    t.literal("GeoShapesDimension"),
    t.literal("StandardErrorDimension"),
    t.literal("ConfidenceUpperBoundDimension"),
    t.literal("ConfidenceLowerBoundDimension"),
]);
const MeasureType = t.union([
    t.literal("NumericalMeasure"),
    t.literal("OrdinalMeasure"),
]);
const ComponentType = t.union([DimensionType, MeasureType]);
// Filters
const FilterValueSingle = t.intersection([
    t.type({
        type: t.literal("single"),
        value: t.union([t.string, t.number]),
    }, "FilterValueSingle"),
    t.partial({
        position: t.number,
    }),
]);
const FilterValueMulti = t.intersection([
    t.type({
        type: t.literal("multi"),
        values: t.record(t.string, t.literal(true)), // undefined values will be removed when serializing to JSON
    }, "FilterValueMulti"),
    t.partial({
        position: t.number,
    }),
]);
const FilterValueRange = t.intersection([
    t.type({
        type: t.literal("range"),
        from: t.string,
        to: t.string,
    }, "FilterValueRange"),
    t.partial({
        position: t.number,
    }),
]);
const FilterValue = t.union([FilterValueSingle, FilterValueMulti, FilterValueRange], "FilterValue");
const Filters = t.record(t.string, FilterValue, "Filters");
const SingleFilters = t.record(t.string, FilterValueSingle, "SingleFilters");
const Title = t.type({
    "sr-Latn": t.string,
    "sr-Cyrl": t.string,
    en: t.string,
});
const Description = t.type({
    "sr-Latn": t.string,
    "sr-Cyrl": t.string,
    en: t.string,
});
const Label = t.type({
    "sr-Latn": t.string,
    "sr-Cyrl": t.string,
    en: t.string,
});
const Meta = t.type({
    title: Title,
    description: Description,
    label: Label,
});
const InteractiveFiltersLegend = t.type({
    active: t.boolean,
    componentId: t.string,
});
const InteractiveFiltersTimeRange = t.type({
    active: t.boolean,
    componentId: t.string,
    presets: t.type({
        type: t.literal("range"),
        from: t.string,
        to: t.string,
    }),
});
const DefaultValueOverrides = t.record(t.string, t.array(t.string));
const InteractiveDataFilterType = t.union([
    t.literal("single"),
    t.literal("multi"),
]);
const InteractiveFiltersDataConfig = t.intersection([
    t.type({
        active: t.boolean,
        componentIds: t.array(t.string),
        defaultValueOverrides: DefaultValueOverrides,
        filterTypes: t.record(t.string, InteractiveDataFilterType),
    }),
    t.partial({
        defaultOpen: t.boolean,
    }),
]);
const CalculationType = t.union([t.literal("identity"), t.literal("percent")]);
const InteractiveFiltersCalculation = t.type({
    active: t.boolean,
    type: CalculationType,
});
const InteractiveFiltersConfig = t.type({
    legend: InteractiveFiltersLegend,
    timeRange: InteractiveFiltersTimeRange,
    dataFilters: InteractiveFiltersDataConfig,
    calculation: InteractiveFiltersCalculation,
});
// Chart Config
const ColorMapping = t.record(t.string, t.string);
const SingleColorField = t.type({
    type: t.literal("single"),
    paletteId: t.string,
    color: t.string,
});
const SegmentColorField = t.type({
    type: t.literal("segment"),
    paletteId: t.string,
    colorMapping: ColorMapping,
});
const MeasuresColorField = t.type({
    type: t.literal("measures"),
    paletteId: t.string,
    colorMapping: ColorMapping,
});
const ColorField = t.union([
    SingleColorField,
    SegmentColorField,
    MeasuresColorField,
]);
const GenericField = t.intersection([
    t.type({ componentId: t.string }),
    t.partial({ useAbbreviations: t.boolean }),
]);
const GenericFields = t.record(t.string, t.union([GenericField, t.undefined]));
const AnimationType = t.union([t.literal("continuous"), t.literal("stepped")]);
const AnimationField = t.intersection([
    GenericField,
    t.type({
        showPlayButton: t.boolean,
        type: AnimationType,
        duration: t.number,
        dynamicScales: t.boolean,
    }),
]);
const SortingOrder = t.union([t.literal("asc"), t.literal("desc")]);
const SortingType = t.union([
    t.literal("byDimensionLabel"),
    t.literal("byMeasure"),
    t.literal("byTotalSize"),
    t.literal("byAuto"),
]);
const SortingField = t.partial({
    sorting: t.type({
        sortingType: SortingType,
        sortingOrder: SortingOrder,
    }),
});
const ShowValuesBySegmentFieldExtension = t.type({
    showValuesMapping: t.record(t.string, t.boolean),
});
export const shouldEnableSettingShowValuesBySegment = (chartConfig) => {
    var _a;
    return ((isBarConfig(chartConfig) || isColumnConfig(chartConfig)) &&
        ((_a = chartConfig.fields.segment) === null || _a === void 0 ? void 0 : _a.type) === "stacked");
};
const Cube = t.intersection([
    t.type({
        /** * Cube iri at publish time (stored in the database) and latest one on the client side. */
        iri: t.string,
        filters: Filters,
    }),
    t.partial({
        joinBy: t.array(t.string),
    }),
]);
const AnnotationTarget = t.type({
    componentId: t.string,
    value: t.string,
});
const HighlightAnnotation = t.type({
    key: t.string,
    type: t.literal("highlight"),
    targets: t.array(AnnotationTarget),
    text: t.type({
        "sr-Latn": t.string,
        "sr-Cyrl": t.string,
        en: t.string,
    }),
    highlightType: t.union([t.literal("none"), t.literal("filled")]),
    color: t.union([t.string, t.undefined]),
    defaultOpen: t.boolean,
});
const Annotation = HighlightAnnotation;
export const supportsAnnotations = (chartConfig) => {
    switch (chartConfig.chartType) {
        case "area":
        case "bar":
        case "column":
        case "line":
        case "pie":
        case "scatterplot":
            return true;
        case "comboLineColumn":
        case "comboLineDual":
        case "comboLineSingle":
        case "map":
        case "table":
            return false;
        default:
            const _exhaustiveCheck = chartConfig;
            return _exhaustiveCheck;
    }
};
const Limit = t.intersection([
    t.type({
        related: t.array(t.type({
            dimensionId: t.string,
            value: t.string,
        })),
        color: t.string,
        lineType: t.union([t.literal("dashed"), t.literal("solid")]),
    }),
    t.partial({
        symbolType: t.union([
            t.literal("cross"),
            t.literal("circle"),
            t.literal("triangle"),
        ]),
    }),
]);
const ConversionUnit = t.type({
    multiplier: t.number,
    labels: t.type({
        de: t.string,
        fr: t.string,
        it: t.string,
        en: t.string,
        "sr-Latn": t.string,
        "sr-Cyrl": t.string,
    }),
});
const GenericChartConfig = t.type({
    key: t.string,
    version: t.string,
    meta: Meta,
    cubes: t.array(Cube),
    interactiveFiltersConfig: InteractiveFiltersConfig,
    annotations: t.array(Annotation),
    limits: t.record(t.string, t.array(Limit)),
    conversionUnitsByComponentId: t.record(t.string, ConversionUnit),
    activeField: t.union([t.string, t.undefined]),
});
const ShowTitleFieldExtension = t.partial({
    showTitle: t.boolean,
});
const ShowValuesFieldExtension = t.partial({
    showValues: t.boolean,
});
const UncertaintyFieldExtension = t.partial({
    showStandardError: t.boolean,
    showConfidenceInterval: t.boolean,
});
const CustomScaleDomainFieldExtension = t.partial({
    customDomain: t.tuple([t.number, t.number]),
});
const ChartSubType = t.union([t.literal("stacked"), t.literal("grouped")]);
const ColumnSegmentField = t.intersection([
    GenericField,
    SortingField,
    t.type({ type: ChartSubType }),
    ShowTitleFieldExtension,
    ShowValuesBySegmentFieldExtension,
]);
const ColumnFields = t.intersection([
    t.type({
        x: t.intersection([GenericField, SortingField]),
        y: t.intersection([
            GenericField,
            ShowValuesFieldExtension,
            UncertaintyFieldExtension,
            CustomScaleDomainFieldExtension,
        ]),
        color: t.union([SegmentColorField, SingleColorField]),
    }),
    t.partial({
        segment: ColumnSegmentField,
        animation: AnimationField,
    }),
]);
const ColumnConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("column"),
        fields: ColumnFields,
    }, "ColumnConfig"),
]);
const BarSegmentField = t.intersection([
    GenericField,
    SortingField,
    t.type({ type: ChartSubType }),
    ShowTitleFieldExtension,
    ShowValuesBySegmentFieldExtension,
]);
const BarFields = t.intersection([
    t.type({
        x: t.intersection([
            GenericField,
            ShowValuesFieldExtension,
            CustomScaleDomainFieldExtension,
        ]),
        y: t.intersection([GenericField, SortingField]),
        color: t.union([SegmentColorField, SingleColorField]),
    }),
    t.partial({
        segment: BarSegmentField,
        animation: AnimationField,
    }),
]);
const BarConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("bar"),
        fields: BarFields,
    }, "BarConfig"),
]);
const LineSegmentField = t.intersection([
    GenericField,
    SortingField,
    ShowTitleFieldExtension,
    ShowValuesBySegmentFieldExtension,
]);
const ShowDotsSize = t.union([
    t.literal("Small"),
    t.literal("Medium"),
    t.literal("Large"),
]);
const LineFields = t.intersection([
    t.type({
        x: GenericField,
        y: t.intersection([
            GenericField,
            ShowValuesFieldExtension,
            UncertaintyFieldExtension,
            CustomScaleDomainFieldExtension,
            t.partial({
                showDots: t.boolean,
                showDotsSize: ShowDotsSize,
            }),
        ]),
        color: t.union([SegmentColorField, SingleColorField]),
    }),
    t.partial({
        segment: LineSegmentField,
    }),
]);
const LineConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("line"),
        fields: LineFields,
    }, "LineConfig"),
]);
const AreaSegmentField = t.intersection([
    GenericField,
    SortingField,
    ShowTitleFieldExtension,
    ShowValuesBySegmentFieldExtension,
]);
const ImputationType = t.union([
    t.literal("none"),
    t.literal("zeros"),
    t.literal("linear"),
]);
export const IMPUTATION_TYPES = ["none", "zeros", "linear"];
const AreaFields = t.intersection([
    t.type({
        x: GenericField,
        y: t.intersection([
            GenericField,
            ShowValuesFieldExtension,
            CustomScaleDomainFieldExtension,
            t.partial({ imputationType: ImputationType }),
        ]),
        color: t.union([SegmentColorField, SingleColorField]),
    }),
    t.partial({
        segment: AreaSegmentField,
    }),
]);
const AreaConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("area"),
        fields: AreaFields,
    }, "AreaConfig"),
]);
const ScatterPlotSegmentField = t.intersection([
    GenericField,
    ShowTitleFieldExtension,
    ShowValuesBySegmentFieldExtension,
]);
const ScatterPlotFields = t.intersection([
    t.type({
        x: GenericField,
        y: GenericField,
        color: t.union([SegmentColorField, SingleColorField]),
    }),
    t.partial({
        segment: ScatterPlotSegmentField,
        animation: AnimationField,
    }),
]);
const ScatterPlotConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("scatterplot"),
        fields: ScatterPlotFields,
    }, "ScatterPlotConfig"),
]);
const PieSegmentField = t.intersection([
    GenericField,
    SortingField,
    ShowTitleFieldExtension,
    ShowValuesBySegmentFieldExtension,
]);
const PieFields = t.intersection([
    t.type({
        y: t.intersection([GenericField, ShowValuesFieldExtension]),
        segment: PieSegmentField,
        color: SegmentColorField,
    }),
    t.partial({ animation: AnimationField }),
]);
const PieConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("pie"),
        fields: PieFields,
    }, "PieConfig"),
]);
const DivergingPaletteType = t.union([
    t.literal("BrBG"),
    t.literal("PiYG"),
    t.literal("PRGn"),
    t.literal("PuOr"),
    t.literal("RdBu"),
    t.literal("RdYlBu"),
    t.literal("RdYlGn"),
]);
const SequentialPaletteType = t.union([
    t.literal("blues"),
    t.literal("greens"),
    t.literal("greys"),
    t.literal("oranges"),
    t.literal("purples"),
    t.literal("reds"),
]);
const DimensionPaletteType = t.literal("dimension");
const CategoricalPaletteType = t.union([
    DimensionPaletteType,
    t.literal("accent"),
    t.literal("category10"),
    t.literal("dark2"),
    t.literal("paired"),
    t.literal("pastel1"),
    t.literal("pastel2"),
    t.literal("set1"),
    t.literal("set2"),
    t.literal("set3"),
    t.literal("tableau10"),
]);
const DivergingPalette = t.type({
    type: t.literal("diverging"),
    paletteId: DivergingPaletteType,
    name: DivergingPaletteType,
});
const SequentialPalette = t.type({
    type: t.literal("sequential"),
    paletteId: SequentialPaletteType,
    name: SequentialPaletteType,
});
const CategoricalPalette = t.type({
    type: t.literal("categorical"),
    paletteId: CategoricalPaletteType,
    name: CategoricalPaletteType,
});
const CustomPalette = t.type({
    type: t.union([
        t.literal("diverging"),
        t.literal("sequential"),
        t.literal("categorical"),
    ]),
    paletteId: t.string,
    name: t.string,
    colors: t.array(t.string),
});
export const convertPaletteTypeToDBType = (type) => {
    switch (type) {
        case "diverging":
            return PALETTE_TYPE.DIVERGING;
        case "sequential":
            return PALETTE_TYPE.SEQUENTIAL;
        case "categorical":
            return PALETTE_TYPE.CATEGORICAL;
        default:
            const _exhaustiveCheck = type;
            return _exhaustiveCheck;
    }
};
export const convertDBTypeToPaletteType = (type) => {
    switch (type) {
        case PALETTE_TYPE.DIVERGING:
            return "diverging";
        case PALETTE_TYPE.SEQUENTIAL:
            return "sequential";
        case PALETTE_TYPE.CATEGORICAL:
            return "categorical";
        default:
            const _exhaustiveCheck = type;
            return _exhaustiveCheck;
    }
};
export const PaletteType = t.union([
    DivergingPalette,
    SequentialPalette,
    CategoricalPalette,
    CustomPalette,
]);
const ColorScaleType = t.union([
    t.literal("continuous"),
    t.literal("discrete"),
]);
const ColorScaleInterpolationType = t.union([
    t.literal("linear"),
    t.literal("quantize"),
    t.literal("quantile"),
    t.literal("jenks"),
]);
const ColumnTextStyle = t.union([t.literal("regular"), t.literal("bold")]);
const ColumnStyleText = t.type({
    type: t.literal("text"),
    textStyle: ColumnTextStyle,
    textColor: t.string,
    columnColor: t.string,
});
const ColumnStyleCategory = t.type({
    type: t.literal("category"),
    textStyle: ColumnTextStyle,
    paletteId: t.string,
    colorMapping: ColorMapping,
});
const ColumnStyleHeatmap = t.type({
    type: t.literal("heatmap"),
    textStyle: ColumnTextStyle,
    paletteId: DivergingPaletteType,
});
const ColumnStyleBar = t.type({
    type: t.literal("bar"),
    textStyle: ColumnTextStyle,
    barColorPositive: t.string,
    barColorNegative: t.string,
    barColorBackground: t.string,
    barShowBackground: t.boolean,
});
const ColumnStyle = t.union([
    ColumnStyleText,
    ColumnStyleCategory,
    ColumnStyleHeatmap,
    ColumnStyleBar,
]);
const TableColumn = t.type({
    componentId: t.string,
    componentType: ComponentType,
    index: t.number,
    isGroup: t.boolean,
    isHidden: t.boolean,
    columnStyle: ColumnStyle,
});
const TableSettings = t.type({
    showSearch: t.boolean,
    showAllRows: t.boolean,
});
const TableLinks = t.type({
    enabled: t.boolean,
    baseUrl: t.string,
    componentId: t.string,
    targetComponentId: t.string,
});
const TableFields = t.record(t.string, TableColumn);
const TableSortingOption = t.type({
    componentId: t.string,
    componentType: ComponentType,
    sortingOrder: SortingOrder,
});
const TableConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("table"),
        fields: TableFields,
        settings: TableSettings,
        links: TableLinks,
        sorting: t.array(TableSortingOption),
    }, "TableConfig"),
]);
const BBox = t.tuple([
    t.tuple([t.number, t.number]),
    t.tuple([t.number, t.number]),
]);
const ColorFieldOpacity = t.type({
    opacity: t.number,
});
const ColorFieldType = t.union([
    t.literal("fixed"),
    t.literal("categorical"),
    t.literal("numerical"),
]);
const FixedColorField = t.intersection([
    t.type({
        type: t.literal("fixed"),
        value: t.string,
    }),
    ColorFieldOpacity,
]);
const CategoricalColorField = t.intersection([
    t.type({
        type: t.literal("categorical"),
        componentId: t.string,
        paletteId: t.string,
        colorMapping: ColorMapping,
    }),
    t.partial({ useAbbreviations: t.boolean }),
    ColorFieldOpacity,
]);
const NumericalColorField = t.intersection([
    t.type({
        type: t.literal("numerical"),
        componentId: t.string,
        paletteId: t.string,
    }),
    t.partial({
        paletteType: t.union([t.literal("sequential"), t.literal("diverging")]),
        colors: t.array(t.string),
    }),
    t.union([
        t.type({
            scaleType: t.literal("continuous"),
            interpolationType: t.literal("linear"),
        }),
        t.type({
            scaleType: t.literal("discrete"),
            interpolationType: t.union([
                t.literal("quantize"),
                t.literal("quantile"),
                t.literal("jenks"),
            ]),
            nbClass: t.number,
        }),
    ]),
    ColorFieldOpacity,
]);
const MapAreaLayer = t.type({
    componentId: t.string,
    // FIXME: convert to new color field type
    color: t.union([CategoricalColorField, NumericalColorField]),
});
const MapSymbolLayer = t.type({
    componentId: t.string,
    /** Symbol radius (size) */
    measureId: t.string,
    // FIXME: convert to new color field type
    color: t.union([FixedColorField, CategoricalColorField, NumericalColorField]),
});
const BaseCustomLayer = t.type({
    id: t.string,
    isBehindAreaLayer: t.boolean,
    syncTemporalFilters: t.boolean,
    endpoint: t.union([t.string, t.undefined]),
});
const WMSCustomLayer = t.intersection([
    t.type({
        type: t.literal("wms"),
        endpoint: t.string,
    }),
    BaseCustomLayer,
]);
export const getWMSCustomLayers = (customLayers) => {
    return customLayers.filter((l) => l.type === "wms");
};
const WMTSCustomLayer = t.intersection([
    t.type({
        type: t.literal("wmts"),
        url: t.string,
    }),
    BaseCustomLayer,
]);
export const getWMTSCustomLayers = (customLayers) => {
    return customLayers.filter((l) => l.type === "wmts");
};
const BaseLayer = t.type({
    show: t.boolean,
    locked: t.boolean,
    bbox: t.union([BBox, t.undefined]),
    customLayers: t.array(t.union([WMSCustomLayer, WMTSCustomLayer])),
});
const MapFields = t.partial({
    areaLayer: MapAreaLayer,
    symbolLayer: MapSymbolLayer,
    animation: AnimationField,
});
const MapConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("map"),
        fields: MapFields,
        baseLayer: BaseLayer,
    }, "MapConfig"),
]);
const ComboLineSingleFields = t.type({
    x: GenericField,
    y: t.type({
        componentIds: t.array(t.string),
    }),
    color: MeasuresColorField,
});
const ComboLineSingleConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("comboLineSingle"),
        fields: ComboLineSingleFields,
    }, "ComboLineSingleConfig"),
]);
const ComboLineDualFields = t.type({
    x: GenericField,
    y: t.type({
        leftAxisComponentId: t.string,
        rightAxisComponentId: t.string,
    }),
    color: MeasuresColorField,
});
const ComboLineDualConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("comboLineDual"),
        fields: ComboLineDualFields,
    }, "ComboLineDualConfig"),
]);
const ComboLineColumnFields = t.type({
    x: GenericField,
    y: t.type({
        lineComponentId: t.string,
        lineAxisOrientation: t.union([t.literal("left"), t.literal("right")]),
        columnComponentId: t.string,
    }),
    color: MeasuresColorField,
});
const ComboLineColumnConfig = t.intersection([
    GenericChartConfig,
    t.type({
        chartType: t.literal("comboLineColumn"),
        fields: ComboLineColumnFields,
    }, "ComboLineColumnConfig"),
]);
const RegularChartConfig = t.union([
    AreaConfig,
    ColumnConfig,
    BarConfig,
    LineConfig,
    MapConfig,
    PieConfig,
    ScatterPlotConfig,
    TableConfig,
]);
const ComboChartConfig = t.union([
    ComboLineSingleConfig,
    ComboLineDualConfig,
    ComboLineColumnConfig,
]);
export const ChartConfig = t.union([RegularChartConfig, ComboChartConfig]);
export const decodeChartConfig = (chartConfig) => {
    return pipe(ChartConfig.decode(chartConfig), fold((err) => {
        console.error("Error while decoding chart config", err);
        return undefined;
    }, (d) => d));
};
export const isComboChartConfig = (chartConfig) => {
    return (isComboLineSingleConfig(chartConfig) ||
        isComboLineDualConfig(chartConfig) ||
        isComboLineColumnConfig(chartConfig));
};
export const fieldHasComponentId = (chartConfig) => {
    const validFields = Object.entries(chartConfig.fields).reduce((acc, [key, field]) => {
        if (field && typeof field.componentId === "string") {
            acc[key] = field;
        }
        return acc;
    }, {});
    return validFields;
};
export const isAreaConfig = (chartConfig) => {
    return chartConfig.chartType === "area";
};
export const isColumnConfig = (chartConfig) => {
    return chartConfig.chartType === "column";
};
export const isBarConfig = (chartConfig) => {
    return chartConfig.chartType === "bar";
};
export const isComboLineSingleConfig = (chartConfig) => {
    return chartConfig.chartType === "comboLineSingle";
};
export const isComboLineDualConfig = (chartConfig) => {
    return chartConfig.chartType === "comboLineDual";
};
export const isComboLineColumnConfig = (chartConfig) => {
    return chartConfig.chartType === "comboLineColumn";
};
export const isLineConfig = (chartConfig) => {
    return chartConfig.chartType === "line";
};
export const isScatterPlotConfig = (chartConfig) => {
    return chartConfig.chartType === "scatterplot";
};
export const isPieConfig = (chartConfig) => {
    return chartConfig.chartType === "pie";
};
export const isTableConfig = (chartConfig) => {
    return chartConfig.chartType === "table";
};
export const isMapConfig = (chartConfig) => {
    return chartConfig.chartType === "map";
};
export const canBeNormalized = (chartConfig) => {
    return (chartConfig.chartType === "area" ||
        (chartConfig.chartType === "column" &&
            chartConfig.fields.segment !== undefined &&
            chartConfig.fields.segment.type === "stacked") ||
        (chartConfig.chartType === "bar" &&
            chartConfig.fields.segment !== undefined &&
            chartConfig.fields.segment.type === "stacked"));
};
export const isSegmentInConfig = (chartConfig) => {
    return ["area", "column", "bar", "line", "pie", "scatterplot"].includes(chartConfig.chartType);
};
export const isColorInConfig = (chartConfig) => {
    return !isTableConfig(chartConfig) && !isMapConfig(chartConfig);
};
export const isNotTableOrMap = (chartConfig) => {
    return !isTableConfig(chartConfig) && !isMapConfig(chartConfig);
};
export const isSortingInConfig = (chartConfig) => {
    return ["area", "column", "bar", "line", "pie"].includes(chartConfig.chartType);
};
export const isAnimationInConfig = (chartConfig) => {
    return ["column", "bar", "map", "pie", "scatterplot"].includes(chartConfig.chartType);
};
export const getAnimationField = (chartConfig) => {
    if (isAnimationInConfig(chartConfig)) {
        return chartConfig.fields.animation;
    }
};
export const isColorFieldInConfig = (chartConfig) => {
    return isMapConfig(chartConfig);
};
const DataSource = t.type({
    type: t.union([t.literal("sql"), t.literal("sparql")]),
    url: t.string,
});
const ResizeHandle = t.keyof({
    s: null,
    w: null,
    e: null,
    n: null,
    sw: null,
    nw: null,
    se: null,
    ne: null,
});
const ReactGridLayoutType = t.type({
    w: t.number,
    h: t.number,
    minH: t.union([t.number, t.undefined]),
    x: t.number,
    y: t.number,
    i: t.string,
    resizeHandles: t.union([t.array(ResizeHandle), t.undefined]),
});
export const ReactGridLayoutsType = t.record(t.string, t.array(ReactGridLayoutType));
const LayoutChartBlock = t.type({
    type: t.literal("chart"),
    key: t.string,
});
const LayoutTextBlock = t.type({
    type: t.literal("text"),
    key: t.string,
    text: t.type({
        de: t.string,
        fr: t.string,
        it: t.string,
        en: t.string,
        "sr-Latn": t.string,
        "sr-Cyrl": t.string,
    }),
});
const LayoutBlock = t.intersection([
    t.union([LayoutChartBlock, LayoutTextBlock]),
    t.type({ initialized: t.boolean }),
]);
const Layout = t.intersection([
    t.type({
        activeField: t.union([t.undefined, t.string]),
        meta: Meta,
        blocks: t.array(LayoutBlock),
    }),
    t.union([
        t.type({
            type: t.literal("tab"),
        }),
        t.type({
            type: t.literal("dashboard"),
            layout: t.union([t.literal("vertical"), t.literal("tall")]),
        }),
        t.type({
            type: t.literal("dashboard"),
            layout: t.literal("canvas"),
            layouts: ReactGridLayoutsType,
        }),
        t.type({
            type: t.literal("singleURLs"),
            publishableChartKeys: t.array(t.string),
        }),
    ]),
]);
const DashboardTimeRangeFilter = t.type({
    active: t.boolean,
    timeUnit: t.string,
    presets: t.type({
        from: t.string,
        to: t.string,
    }),
});
const DashboardDataFiltersConfig = t.type({
    componentIds: t.array(t.string),
    filters: SingleFilters,
});
const DashboardFiltersConfig = t.type({
    timeRange: DashboardTimeRangeFilter,
    dataFilters: DashboardDataFiltersConfig,
});
export const areDataFiltersActive = (dashboardFilters) => {
    return !!(dashboardFilters === null || dashboardFilters === void 0 ? void 0 : dashboardFilters.dataFilters.componentIds.length);
};
const Config = t.intersection([
    t.type({
        version: t.string,
        dataSource: DataSource,
        layout: Layout,
        chartConfigs: t.array(ChartConfig),
        activeChartKey: t.string,
        dashboardFilters: t.union([DashboardFiltersConfig, t.undefined]),
    }, "Config"),
    t.partial({ key: t.string }),
]);
const ConfiguratorStateInitial = t.type({
    state: t.literal("INITIAL"),
    version: t.string,
    dataSource: DataSource,
});
const ConfiguratorStateSelectingDataSet = t.type({
    state: t.literal("SELECTING_DATASET"),
    version: t.string,
    dataSource: DataSource,
    chartConfigs: t.undefined,
    layout: t.undefined,
    activeChartKey: t.undefined,
});
const ConfiguratorStateConfiguringChart = t.intersection([
    t.type({ state: t.literal("CONFIGURING_CHART") }),
    Config,
]);
export const CONFIGURATOR_STATE_LAYOUTING = "LAYOUTING";
const ConfiguratorStateLayouting = t.intersection([
    t.type({ state: t.literal(CONFIGURATOR_STATE_LAYOUTING) }),
    Config,
]);
export const enableLayouting = (state) => {
    return state.chartConfigs.length > 1;
};
const ConfiguratorStatePublishing = t.intersection([
    t.type({
        state: t.literal("PUBLISHING"),
    }),
    Config,
]);
const ConfiguratorStatePublished = t.intersection([
    t.type({
        state: t.literal("PUBLISHED"),
    }),
    Config,
]);
export const ConfiguratorState = t.union([
    ConfiguratorStateInitial,
    ConfiguratorStateSelectingDataSet,
    ConfiguratorStateConfiguringChart,
    ConfiguratorStateLayouting,
    ConfiguratorStatePublishing,
    ConfiguratorStatePublished,
]);
export const decodeConfiguratorState = (state) => {
    return pipe(ConfiguratorState.decode(state), fold((err) => {
        console.error("Error while decoding configurator state", err);
        return undefined;
    }, (d) => d));
};
