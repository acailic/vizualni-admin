import { unitsToNode } from "@/rdf/mappings";
const ComponentsRenderingConfig = {
    NominalDimension: {
        enableAnimation: false,
        enableCustomSort: true,
        enableMultiFilter: true,
        enableSegment: true,
    },
    OrdinalDimension: {
        enableAnimation: false,
        enableCustomSort: false,
        enableMultiFilter: true,
        enableSegment: true,
    },
    TemporalDimension: {
        enableAnimation: true,
        enableCustomSort: false,
        enableMultiFilter: false,
        enableSegment: true,
    },
    TemporalEntityDimension: {
        enableAnimation: true,
        enableCustomSort: false,
        // FIXME: should behave like TemporalDimension
        enableMultiFilter: true,
        enableSegment: true,
    },
    TemporalOrdinalDimension: {
        enableAnimation: true,
        enableCustomSort: false,
        enableMultiFilter: true,
        enableSegment: true,
    },
    GeoCoordinatesDimension: {
        enableAnimation: false,
        enableCustomSort: true,
        enableMultiFilter: true,
        enableSegment: true,
    },
    GeoShapesDimension: {
        enableAnimation: false,
        enableCustomSort: true,
        enableMultiFilter: true,
        enableSegment: true,
    },
    NumericalMeasure: {
        enableAnimation: false,
        enableCustomSort: false,
        enableMultiFilter: false,
        enableSegment: false,
    },
    OrdinalMeasure: {
        enableAnimation: false,
        enableCustomSort: false,
        enableMultiFilter: false,
        enableSegment: false,
    },
    StandardErrorDimension: {
        enableAnimation: false,
        enableCustomSort: false,
        enableMultiFilter: false,
        enableSegment: false,
    },
    ConfidenceUpperBoundDimension: {
        enableAnimation: false,
        enableCustomSort: false,
        enableMultiFilter: false,
        enableSegment: false,
    },
    ConfidenceLowerBoundDimension: {
        enableAnimation: false,
        enableCustomSort: false,
        enableMultiFilter: false,
        enableSegment: false,
    },
};
export const ANIMATION_ENABLED_COMPONENTS = Object.entries(ComponentsRenderingConfig)
    .filter(([, config]) => config.enableAnimation)
    .map(([type]) => type);
export const CUSTOM_SORT_ENABLED_COMPONENTS = Object.entries(ComponentsRenderingConfig)
    .filter(([, config]) => config.enableCustomSort)
    .map(([type]) => type);
export const MULTI_FILTER_ENABLED_COMPONENTS = Object.entries(ComponentsRenderingConfig)
    .filter(([, config]) => config.enableMultiFilter)
    .map(([type]) => type);
export const SEGMENT_ENABLED_COMPONENTS = Object.entries(ComponentsRenderingConfig)
    .filter(([, config]) => config.enableSegment)
    .map(([type]) => type);
export const isJoinByComponent = (d) => {
    return !!("isJoinByDimension" in d &&
        d.isJoinByDimension &&
        "originalIds" in d);
};
// TODO
/** Currently, the formatted date for month- and year-based temporal entities
 * is stored in the `position` field. This will be changed in the future, once
 * there will be datasets with other temporal entity types.
 *
 * Also see Zulip conversation about having a unified way of accessing formatted
 * temporal entity values.
 *
 * https://zulip.zazuko.com/#narrow/stream/40-bafu-ext/topic/temporal.20entity.20and.20schema.3AsameAs
 * @see {resolveDimensionType}
 */
export const getTemporalEntityValue = (value) => {
    var _a;
    return (_a = value.position) !== null && _a !== void 0 ? _a : value.value;
};
export const dimensionValuesToGeoCoordinates = (values) => {
    return values
        .filter((d) => d.latitude && d.longitude)
        .map((d) => ({
        iri: d.value,
        label: d.label,
        latitude: d.latitude,
        longitude: d.longitude,
    }));
};
const xmlSchema = "http://www.w3.org/2001/XMLSchema#";
const parseRDFLiteral = (value) => {
    const v = value.value;
    const dt = value.datatype.value.replace(xmlSchema, "");
    switch (dt) {
        case "string":
        case "boolean":
            return v;
        case "float":
        case "integer":
        case "long":
        case "double":
        case "decimal":
        case "nonPositiveInteger":
        case "nonNegativeInteger":
        case "negativeInteger":
        case "int":
        case "unsignedLong":
        case "positiveInteger":
        case "short":
        case "unsignedInt":
        case "byte":
        case "unsignedShort":
        case "unsignedByte":
            return +v;
        default:
            return v;
    }
};
export const parseTerm = (term) => {
    if (!term) {
        return;
    }
    if (term.termType !== "Literal") {
        return term.value;
    }
    return parseRDFLiteral(term);
};
/**
 * Parse observation values (values returned from query.execute()) to native JS types
 *
 * @param observationValue
 */
export const parseObservationValue = ({ label, value, }) => {
    // Prefer the label – if it's not empty (which is currently the case for years)
    if (label && label.value !== "") {
        return label.value;
    }
    // Parse literals to native JS types
    if (value.termType === "Literal") {
        return parseRDFLiteral(value);
    }
    // Return the IRI of named nodes
    return value.value;
};
export const isDimension = (component) => {
    return !isMeasure(component);
};
export const isMeasure = (component) => {
    return isNumericalMeasure(component) || isOrdinalMeasure(component);
};
export const isNumericalMeasure = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "NumericalMeasure";
};
export const isOrdinalMeasure = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "OrdinalMeasure";
};
const isCategoricalDimension = (d) => {
    return (isNominalDimension(d) ||
        isOrdinalDimension(d) ||
        isTemporalOrdinalDimension(d));
};
export const getCategoricalDimensions = (dimensions) => dimensions.filter(isCategoricalDimension);
export const getGeoDimensions = (dimensions) => dimensions.filter(isGeoDimension);
export const getComponentsFilteredByType = ({ dimensionTypes, dimensions, measures, }) => {
    return [...measures, ...dimensions].filter((c) => dimensionTypes.includes(c.__typename));
};
const isNominalDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "NominalDimension";
};
export const isOrdinalDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "OrdinalDimension";
};
export const isGeoDimension = (dimension) => {
    return (isGeoCoordinatesDimension(dimension) || isGeoShapesDimension(dimension));
};
export const isGeoCoordinatesDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "GeoCoordinatesDimension";
};
export const isGeoShapesDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "GeoShapesDimension";
};
export const isTemporalDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "TemporalDimension";
};
export const isTemporalEntityDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "TemporalEntityDimension";
};
export const canDimensionBeTimeFiltered = (dimension) => {
    return isTemporalDimension(dimension) || isTemporalEntityDimension(dimension);
};
export const canDimensionBeMultiFiltered = (dimension) => {
    return (isNominalDimension(dimension) ||
        isOrdinalDimension(dimension) ||
        isTemporalOrdinalDimension(dimension) ||
        isGeoShapesDimension(dimension) ||
        isGeoCoordinatesDimension(dimension));
};
export const isTemporalOrdinalDimension = (dimension) => {
    return (dimension === null || dimension === void 0 ? void 0 : dimension.__typename) === "TemporalOrdinalDimension";
};
export const isTemporalDimensionWithTimeUnit = (dimension) => {
    return !!dimension && "timeUnit" in dimension;
};
export const isDimensionOfTimeUnit = (dimension, timeUnit) => {
    return (!!dimension &&
        "timeUnit" in dimension &&
        dimension.timeUnit &&
        unitsToNode.get(timeUnit));
};
const isStandardErrorResolvedDimension = (dim) => {
    var _a;
    return (_a = dim.data) === null || _a === void 0 ? void 0 : _a.related.some((r) => r.type === "StandardError");
};
const isConfidenceLowerBoundResolvedDimension = (dim) => {
    var _a;
    return (_a = dim.data) === null || _a === void 0 ? void 0 : _a.related.some((r) => r.type === "ConfidenceLowerBound");
};
const isConfidenceUpperBoundResolvedDimension = (dim) => {
    var _a;
    return (_a = dim.data) === null || _a === void 0 ? void 0 : _a.related.some((r) => r.type === "ConfidenceUpperBound");
};
export const isStandardErrorDimension = (dim) => {
    return dim.__typename === "StandardErrorDimension";
};
export const isConfidenceUpperBoundDimension = (dim) => {
    return dim.__typename === "ConfidenceUpperBoundDimension";
};
export const isConfidenceLowerBoundDimension = (dim) => {
    return dim.__typename === "ConfidenceLowerBoundDimension";
};
export const shouldLoadMinMaxValues = (dim) => {
    const { data: { isNumerical, scaleType, dataKind }, } = dim;
    return ((isNumerical && scaleType !== "Ordinal" && dataKind !== "Time") ||
        isStandardErrorResolvedDimension(dim) ||
        isConfidenceUpperBoundResolvedDimension(dim) ||
        isConfidenceLowerBoundResolvedDimension(dim));
};
