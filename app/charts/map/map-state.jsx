import { extent } from "d3-array";
import { scaleQuantile, scaleQuantize, scaleSequential, scaleSqrt, scaleThreshold, } from "d3-scale";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import { useCallback, useMemo } from "react";
import { ckmeans } from "simple-statistics";
import { getBBox } from "@/charts/map/helpers";
import { useMapStateData, useMapStateVariables, } from "@/charts/map/map-state-props";
import { MapTooltipProvider } from "@/charts/map/map-tooltip";
import { useOptionalNumericVariable, useStringVariable, } from "@/charts/shared/chart-helpers";
import { ChartContext, useNumericalYErrorVariables, } from "@/charts/shared/chart-state";
import { colorToRgbArray } from "@/charts/shared/colors";
import { InteractionProvider } from "@/charts/shared/use-interaction";
import { useSize } from "@/charts/shared/use-size";
import { isGeoShapesDimension, } from "@/domain/data";
import { truthy } from "@/domain/types";
import { getColorInterpolator } from "@/palettes";
import { getFittingColorInterpolator } from "@/utils/color-palette-utils";
const useMapState = (chartProps, variables, data) => {
    var _a, _b, _c, _d;
    const { width } = useSize();
    const { chartConfig, measures, dimensions } = chartProps;
    const { chartData, scalesData, allData, features } = data;
    const { fields, baseLayer } = chartConfig;
    const { areaLayer, symbolLayer } = fields;
    const areaLayerState = useLayerState({
        componentId: (_a = fields.areaLayer) === null || _a === void 0 ? void 0 : _a.componentId,
        measureId: (_b = fields.areaLayer) === null || _b === void 0 ? void 0 : _b.color.componentId,
        data: scalesData,
        features,
        dimensions,
        measures,
    });
    const areaColors = useColors({
        color: areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.color,
        data: areaLayerState.data,
        dimensions,
        measures,
    });
    const preparedAreaLayerState = useMemo(() => {
        if ((areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.componentId) === undefined) {
            return;
        }
        return {
            data: areaLayerState.data,
            dataDomain: areaLayerState.dataDomain,
            getLabel: areaLayerState.getLabel,
            colors: areaColors,
        };
    }, [areaColors, areaLayer, areaLayerState]);
    const symbolLayerState = useLayerState({
        componentId: symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.componentId,
        measureId: symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.measureId,
        data: scalesData,
        features,
        dimensions,
        measures,
    });
    const symbolColors = useColors({
        color: symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.color,
        data: symbolLayerState.data,
        dimensions,
        measures,
    });
    const radiusScale = useMemo(() => {
        // Measure dimension is undefined. Can be useful when the user wants to
        // encode only the color of symbols, and the size is irrelevant.
        if (symbolLayerState.dataDomain[1] === undefined) {
            return scaleSqrt().range([0, 12]).unknown(12);
        }
        const baseScale = scaleSqrt()
            .domain([0, symbolLayerState.dataDomain[1]])
            .range([0, 24]);
        const wrappedScale = (x) => {
            if (x === null || x === undefined)
                return 0;
            if (x === 0)
                return 0;
            const scaled = baseScale(x);
            return Math.max(2, scaled);
        };
        Object.assign(wrappedScale, baseScale);
        return wrappedScale;
    }, [symbolLayerState.dataDomain]);
    const preparedSymbolLayerState = useMemo(() => {
        if ((symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.componentId) === undefined) {
            return;
        }
        return {
            ...symbolLayerState,
            colors: symbolColors,
            radiusScale,
        };
    }, [symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.componentId, symbolLayerState, radiusScale, symbolColors]);
    const identicalLayerComponentIds = (areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.componentId) !== undefined &&
        (symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.componentId) !== undefined &&
        areaLayer.componentId === symbolLayer.componentId;
    const height = width * 0.5;
    const bounds = {
        width,
        height,
        aspectRatio: height / width,
        margins: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        chartWidth: width,
        chartHeight: width * 0.5,
    };
    const featuresBBox = useMemo(() => {
        var _a, _b;
        return getBBox((areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.componentId) !== undefined
            ? filterFeatureCollection((_a = features.areaLayer) === null || _a === void 0 ? void 0 : _a.shapes, (f) => { var _a; return !!((_a = f === null || f === void 0 ? void 0 : f.properties) === null || _a === void 0 ? void 0 : _a.observation); })
            : undefined, (symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.componentId) !== undefined
            ? (_b = features.symbolLayer) === null || _b === void 0 ? void 0 : _b.points.filter((p) => { var _a; return !!((_a = p === null || p === void 0 ? void 0 : p.properties) === null || _a === void 0 ? void 0 : _a.observation); })
            : undefined);
    }, [
        areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.componentId,
        (_c = features.areaLayer) === null || _c === void 0 ? void 0 : _c.shapes,
        symbolLayer === null || symbolLayer === void 0 ? void 0 : symbolLayer.componentId,
        (_d = features.symbolLayer) === null || _d === void 0 ? void 0 : _d.points,
    ]);
    return {
        chartType: "map",
        chartData,
        allData,
        bounds,
        features,
        showBaseLayer: baseLayer.show,
        locked: baseLayer.locked || false,
        lockedBBox: baseLayer.bbox,
        featuresBBox,
        identicalLayerComponentIds,
        areaLayer: preparedAreaLayerState,
        symbolLayer: preparedSymbolLayerState,
        ...variables,
    };
};
const getNumericalColorScale = ({ color, getValue, data, dataDomain, }) => {
    const interpolator = getFittingColorInterpolator({ color }, getColorInterpolator);
    switch (color.scaleType) {
        case "continuous":
            switch (color.interpolationType) {
                case "linear":
                    return scaleSequential(interpolator).domain(dataDomain);
            }
        case "discrete":
            const range = Array.from({ length: color.nbClass }, (_, i) => interpolator(i / (color.nbClass - 1)));
            switch (color.interpolationType) {
                case "jenks":
                    const ckMeansThresholds = ckmeans(data.map((d) => { var _a; return (_a = getValue(d)) !== null && _a !== void 0 ? _a : null; }).filter(truthy), Math.min(color.nbClass, data.length)).map((v) => v.pop() || 0);
                    return scaleThreshold()
                        .domain(ckMeansThresholds)
                        .range(range);
                case "quantile":
                    return scaleQuantile()
                        .domain(data.map((d) => getValue(d)))
                        .range(range);
                case "quantize":
                    return scaleQuantize().domain(dataDomain).range(range);
            }
        default:
            const _exhaustiveCheck = color;
            return _exhaustiveCheck;
    }
};
const useFixedColors = (colorSpec) => {
    return useMemo(() => {
        if ((colorSpec === null || colorSpec === void 0 ? void 0 : colorSpec.type) !== "fixed") {
            return;
        }
        const color = colorToRgbArray(colorSpec.value, colorSpec.opacity * 2.55);
        return {
            type: "fixed",
            getColor: () => color,
        };
    }, [colorSpec]);
};
const useCategoricalColors = (colorSpec, { dimensions, measures, }) => {
    return useMemo(() => {
        var _a, _b;
        if ((colorSpec === null || colorSpec === void 0 ? void 0 : colorSpec.type) !== "categorical") {
            return;
        }
        const component = [...dimensions, ...measures].find((d) => d.id === colorSpec.componentId);
        const valuesByLabel = keyBy(component.values, (d) => d.label);
        const valuesByAbbreviationOrLabel = keyBy(component.values, colorSpec.useAbbreviations
            ? (d) => { var _a; return (_a = d.alternateName) !== null && _a !== void 0 ? _a : d.label; }
            : (d) => d.label);
        const domain = (_a = component.values.map((d) => `${d.value}`)) !== null && _a !== void 0 ? _a : [];
        const rgbColorMapping = mapValues(colorSpec.colorMapping, (c) => colorToRgbArray(c, colorSpec.opacity * 2.55));
        const getDimensionValue = (d) => {
            var _a;
            const abbreviationOrLabel = d[colorSpec.componentId];
            return ((_a = valuesByAbbreviationOrLabel[abbreviationOrLabel]) !== null && _a !== void 0 ? _a : valuesByLabel[abbreviationOrLabel]);
        };
        return {
            type: "categorical",
            paletteId: colorSpec.paletteId,
            component,
            domain,
            getValue: colorSpec.useAbbreviations
                ? (d) => {
                    const v = getDimensionValue(d);
                    return v.alternateName || v.label;
                }
                : (d) => {
                    return getDimensionValue(d).label;
                },
            getColor: (d) => {
                const value = getDimensionValue(d);
                return rgbColorMapping[value.value];
            },
            useAbbreviations: (_b = colorSpec.useAbbreviations) !== null && _b !== void 0 ? _b : false,
        };
    }, [colorSpec, dimensions, measures]);
};
const useNumericalColors = (colorSpec, { data, dimensions, measures, }) => {
    const componentId = (colorSpec === null || colorSpec === void 0 ? void 0 : colorSpec.type) === "numerical" ? colorSpec.componentId : "";
    const getValue = useCallback((d) => d[componentId] !== null ? Number(d[componentId]) : null, [componentId]);
    const { getFormattedYUncertainty } = useNumericalYErrorVariables({ componentId }, { getValue, dimensions, measures });
    return useMemo(() => {
        if ((colorSpec === null || colorSpec === void 0 ? void 0 : colorSpec.type) !== "numerical") {
            return;
        }
        const component = measures.find((d) => d.id === componentId);
        const domain = extent(data.map(getValue).filter(truthy));
        const colorScale = getNumericalColorScale({
            color: colorSpec,
            getValue,
            data,
            dataDomain: domain,
        });
        return {
            type: "continuous",
            paletteId: colorSpec.paletteId,
            component,
            scale: colorScale,
            interpolationType: colorSpec.interpolationType,
            getValue,
            getColor: (d) => {
                const value = getValue(d);
                if (value !== null) {
                    const c = colorScale(value);
                    if (c) {
                        return colorToRgbArray(c, colorSpec.opacity * 2.55);
                    }
                }
                return [0, 0, 0, 255 * 0.1];
            },
            getFormattedError: getFormattedYUncertainty,
            domain,
        };
    }, [
        colorSpec,
        componentId,
        data,
        getFormattedYUncertainty,
        getValue,
        measures,
    ]);
};
const useColors = ({ color, data, dimensions, measures, }) => {
    const fixedColors = useFixedColors(color);
    const categoricalColors = useCategoricalColors(color, {
        dimensions,
        measures,
    });
    const numericalColors = useNumericalColors(color, {
        data,
        dimensions,
        measures,
    });
    if (!color) {
        return undefined;
    }
    switch (color.type) {
        case "fixed":
            return fixedColors;
        case "categorical":
            return categoricalColors;
        case "numerical":
            return numericalColors;
        default:
            const _exhaustiveCheck = color;
            return _exhaustiveCheck;
    }
};
const usePreparedData = ({ geoDimensionId, getLabel, data, dimensions, features, }) => {
    var _a;
    return useMemo(() => {
        var _a, _b;
        if (geoDimensionId === "") {
            return [];
        }
        const dimension = dimensions.find((d) => d.id === geoDimensionId);
        if (isGeoShapesDimension(dimension) &&
            ((_b = (_a = features.areaLayer) === null || _a === void 0 ? void 0 : _a.shapes) === null || _b === void 0 ? void 0 : _b.features)) {
            const hierarchyLabels = features.areaLayer.shapes.features.map((d) => d.properties.label);
            return data.filter((d) => hierarchyLabels.includes(getLabel(d)));
        }
        return data;
    }, [
        geoDimensionId,
        getLabel,
        data,
        dimensions,
        (_a = features.areaLayer) === null || _a === void 0 ? void 0 : _a.shapes.features,
    ]);
};
const useLayerState = ({ componentId = "", measureId = "", data, features, dimensions, measures, }) => {
    const getLabel = useStringVariable(componentId);
    const getValue = useOptionalNumericVariable(measureId);
    const measureDimension = measures.find((d) => d.id === measureId);
    const { showYUncertainty, getFormattedYUncertainty } = useNumericalYErrorVariables({ componentId: measureId }, { getValue, dimensions, measures });
    const preparedData = usePreparedData({
        geoDimensionId: componentId,
        getLabel,
        data,
        dimensions,
        features,
    });
    const dataDomain = useMemo(() => {
        return (extent(preparedData, (d) => getValue(d)) || [0, 100]);
    }, [getValue, preparedData]);
    return {
        data: preparedData,
        dataDomain,
        measureDimension,
        measureLabel: (measureDimension === null || measureDimension === void 0 ? void 0 : measureDimension.label) || "",
        getLabel,
        getValue,
        getFormattedError: showYUncertainty ? getFormattedYUncertainty : null,
    };
};
const filterFeatureCollection = (fc, predicate) => {
    if (!fc) {
        return fc;
    }
    return {
        ...fc,
        features: fc.features.filter(predicate),
    };
};
const MapChartProvider = (props) => {
    const { children, ...chartProps } = props;
    const variables = useMapStateVariables(chartProps);
    const data = useMapStateData(chartProps, variables);
    const state = useMapState(chartProps, variables, data);
    return (<ChartContext.Provider value={state}>{children}</ChartContext.Provider>);
};
export const MapChart = (props) => {
    const { children, ...rest } = props;
    return (<InteractionProvider>
      <MapChartProvider {...rest}>
        <MapTooltipProvider>{children}</MapTooltipProvider>
      </MapChartProvider>
    </InteractionProvider>);
};
