import { truthy } from "@/domain/types";
import { ScaleType, } from "@/graphql/query-hooks";
import { timeFormats, timeUnitFormats, timeUnits } from "@/rdf/mappings";
import * as ns from "@/rdf/namespace";
import { hasHierarchy } from "@/rdf/queries";
import { getQueryLocales } from "@/rdf/query-utils";
export const getScaleType = (scaleTypeTerm) => {
    return (scaleTypeTerm === null || scaleTypeTerm === void 0 ? void 0 : scaleTypeTerm.equals(ns.qudt.NominalScale))
        ? ScaleType.Nominal
        : (scaleTypeTerm === null || scaleTypeTerm === void 0 ? void 0 : scaleTypeTerm.equals(ns.qudt.OrdinalScale))
            ? ScaleType.Ordinal
            : (scaleTypeTerm === null || scaleTypeTerm === void 0 ? void 0 : scaleTypeTerm.equals(ns.qudt.RatioScale))
                ? ScaleType.Ratio
                : (scaleTypeTerm === null || scaleTypeTerm === void 0 ? void 0 : scaleTypeTerm.equals(ns.qudt.IntervalScale))
                    ? ScaleType.Interval
                    : undefined;
};
export const getDataKind = (term) => {
    return (term === null || term === void 0 ? void 0 : term.equals(ns.time.GeneralDateTimeDescription))
        ? "Time"
        : (term === null || term === void 0 ? void 0 : term.equals(ns.schema.GeoCoordinates))
            ? "GeoCoordinates"
            : (term === null || term === void 0 ? void 0 : term.equals(ns.schema.GeoShape))
                ? "GeoShape"
                : undefined;
};
export const parseDimensionDatatype = (dim) => {
    var _a, _b, _c, _d, _e, _f;
    const isLiteral = (_b = (_a = dim.out(ns.sh.nodeKind).term) === null || _a === void 0 ? void 0 : _a.equals(ns.sh.Literal)) !== null && _b !== void 0 ? _b : false;
    let dataType = (_c = dim.datatype) !== null && _c !== void 0 ? _c : (_d = dim.out(ns.sh.datatype).terms) === null || _d === void 0 ? void 0 : _d[0];
    let hasUndefinedValues = false;
    if (!dataType) {
        // Maybe it has multiple datatypes
        const dataTypes = [
            ...((_e = dim.out(ns.sh.or).list()) !== null && _e !== void 0 ? _e : dim.out(ns.sh.or).toArray()),
        ].flatMap((d) => d.out(ns.sh.datatype).terms);
        hasUndefinedValues = dataTypes.some((d) => ns.cube.Undefined.equals(d));
        const definedDataTypes = dataTypes.filter((d) => !ns.cube.Undefined.equals(d));
        if (definedDataTypes.length > 1) {
            console.warn(`WARNING: dimension <${(_f = dim.path) === null || _f === void 0 ? void 0 : _f.value}> has more than 1 non-undefined datatype`, definedDataTypes);
        }
        if (definedDataTypes.length > 0) {
            dataType = definedDataTypes[0];
        }
    }
    return { isLiteral, dataType, hasUndefinedValues };
};
const sparqlRelationToVisualizeRelation = {
    "https://cube.link/relation/StandardError": "StandardError",
    "https://cube.link/relation/ConfidenceUpperBound": "ConfidenceUpperBound",
    "https://cube.link/relation/ConfidenceLowerBound": "ConfidenceLowerBound",
};
export const parseRelatedDimensions = (dim) => {
    const relatedDimensionNodes = dim.out(ns.cube `meta/dimensionRelation`);
    return relatedDimensionNodes
        .map((n) => {
        var _a;
        const rawType = n.out(ns.rdf("type")).value;
        const type = rawType
            ? sparqlRelationToVisualizeRelation[rawType]
            : undefined;
        const iri = (_a = n.out(ns.cube `meta/relatesTo`)) === null || _a === void 0 ? void 0 : _a.value;
        if (!iri || !type) {
            return null;
        }
        return { type, iri };
    })
        .filter(truthy);
};
export const parseCubeDimension = ({ dim, cube, locale, units, limits, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const iri = (_a = dim.path) === null || _a === void 0 ? void 0 : _a.value;
    const outOpts = { language: getQueryLocales(locale) };
    const name = (_b = dim.out(ns.schema.name, outOpts).value) !== null && _b !== void 0 ? _b : (_c = dim.path) === null || _c === void 0 ? void 0 : _c.value;
    const description = dim.out(ns.schema.description, outOpts).value;
    const dataKindTerm = dim.out(ns.cube `meta/dataKind`).out(ns.rdf.type).term;
    const related = parseRelatedDimensions(dim);
    const timeUnitTerm = dim
        .out(ns.cube `meta/dataKind`)
        .out(ns.time.unitType).term;
    const { isLiteral, dataType, hasUndefinedValues } = parseDimensionDatatype(dim);
    const isDecimal = (_d = dataType === null || dataType === void 0 ? void 0 : dataType.equals(ns.xsd.decimal)) !== null && _d !== void 0 ? _d : false;
    const isNumerical = getIsNumerical(dataType);
    const isKeyDimension = dim
        .out(ns.rdf.type)
        .terms.some((t) => t.equals(ns.cube.KeyDimension));
    const isMeasureDimension = dim
        .out(ns.rdf.type)
        .terms.some((t) => t.equals(ns.cube.MeasureDimension));
    // Keeping qudt:unit format for backwards compatibility.
    const unitTerm = (_e = dim.out(ns.qudt.unit).term) !== null && _e !== void 0 ? _e : dim.out(ns.qudt.hasUnit).term;
    const unit = unitTerm ? units === null || units === void 0 ? void 0 : units.get(unitTerm.value) : undefined;
    const unitLabel = (_f = unit === null || unit === void 0 ? void 0 : unit.label) === null || _f === void 0 ? void 0 : _f.value;
    const resolution = parseResolution(dataType);
    const timeUnit = getTimeUnit(timeUnitTerm);
    const timeFormat = getTimeFormat(dataType, timeUnit);
    return {
        cube,
        dimension: dim,
        locale,
        data: {
            iri,
            name,
            description,
            related,
            isDecimal,
            isLiteral,
            isNumerical,
            isKeyDimension,
            isMeasureDimension,
            hasUndefinedValues,
            hasHierarchy: hasHierarchy(dim),
            unit: unitLabel,
            dataType: dataType === null || dataType === void 0 ? void 0 : dataType.value,
            resolution,
            isCurrency: !!((_g = unit === null || unit === void 0 ? void 0 : unit.isCurrency) === null || _g === void 0 ? void 0 : _g.value),
            currencyExponent: ((_h = unit === null || unit === void 0 ? void 0 : unit.currencyExponent) === null || _h === void 0 ? void 0 : _h.value)
                ? parseInt(unit.currencyExponent.value)
                : undefined,
            order: parseNumericalTerm(dim.out(ns.sh.order).term),
            dataKind: getDataKind(dataKindTerm),
            timeUnit,
            timeFormat,
            scaleType: getScaleType(dim.out(ns.qudt.scaleType).term),
            limits,
        },
    };
};
export const parseNumericalTerm = (term) => {
    return term !== undefined ? parseInt(term.value, 10) : undefined;
};
export const getTimeUnit = (timeUnitTerm) => {
    var _a;
    return timeUnits.get((_a = timeUnitTerm === null || timeUnitTerm === void 0 ? void 0 : timeUnitTerm.value) !== null && _a !== void 0 ? _a : "");
};
export const getTimeFormat = (dataTypeTerm, timeUnit) => {
    var _a, _b;
    return ((_b = timeFormats.get((_a = dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.value) !== null && _a !== void 0 ? _a : "")) !== null && _b !== void 0 ? _b : (timeUnit ? timeUnitFormats.get(timeUnit) : undefined));
};
export const parseResolution = (dataTypeTerm) => {
    return (dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.int)) ||
        (dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.integer))
        ? 0
        : undefined;
};
export const getIsNumerical = (dataTypeTerm) => {
    return ((dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.int)) ||
        (dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.integer)) ||
        (dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.float)) ||
        (dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.double)) ||
        (dataTypeTerm === null || dataTypeTerm === void 0 ? void 0 : dataTypeTerm.equals(ns.xsd.decimal)) ||
        false);
};
