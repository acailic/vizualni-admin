import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";
import rdf from "rdf-ext";
import { truthy } from "@/domain/types";
import { stringifyComponentId } from "@/graphql/make-component-id";
import { resolveDimensionType, resolveMeasureType } from "@/graphql/resolvers";
import * as ns from "./namespace";
import { getDataKind, getIsNumerical, getScaleType, getTimeFormat, getTimeUnit, parseNumericalTerm, parseResolution, } from "./parse";
import { buildLocalizedSubQuery } from "./query-utils";
export const getCubePreview = async (iri, options) => {
    const { unversionedIri, sparqlClient, locale } = options;
    const qs = await sparqlClient.query.construct(`PREFIX cube: <https://cube.link/>
PREFIX meta: <https://cube.link/meta/>
PREFIX qudt: <http://qudt.org/schema/qudt/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX time: <http://www.w3.org/2006/time#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

CONSTRUCT {
  ?dimension sh:path ?dimensionIri .
  ?dimension rdf:type ?dimensionType .
  ?dimension qudt:scaleType ?dimensionScaleType .
  ?dimension qudt:unit ?dimensionUnit .
  ?dimensionUnit schema:name ?dimensionUnitLabel .
  ?dimensionUnit qudt:CurrencyUnit ?dimensionUnitIsCurrency .
  ?dimensionUnit qudt:currencyExponent ?dimensionUnitCurrencyExponent .
  ?dimension sh:order ?dimensionOrder .
  ?dimension meta:dataKind ?dimensionDataKind .
  ?dimensionDataKind rdf:type ?dimensionDataKindType .
  ?dimensionDataKind time:unitType ?dimensionTimeUnitType .
  ?dimension schema:name ?dimensionLabel .
  ?dimension schema:description ?dimensionDescription .

  ?observation ?observationPredicate ?observationValue .
  ?observation ?observationPredicate ?observationLabel .
  ?observationValue schema:position ?observationPosition .
} WHERE {
  VALUES ?cube { <${iri}> }
  FILTER(EXISTS { ?cube a cube:Cube . })
  {
    ?cube cube:observationConstraint/sh:property ?dimension .
    ?dimension sh:path ?dimensionIri .
    OPTIONAL { ?dimension rdf:type ?dimensionType . }
    OPTIONAL { ?dimension qudt:scaleType ?dimensionScaleType . }
    OPTIONAL {
      { ?dimension qudt:unit ?dimensionUnit . }
      UNION { ?dimension qudt:hasUnit ?dimensionUnit . }
      OPTIONAL { ?dimensionUnit rdfs:label ?dimensionUnitRdfsLabel . }
      OPTIONAL { ?dimensionUnit qudt:symbol ?dimensionUnitSymbol . }
      OPTIONAL { ?dimensionUnit qudt:ucumCode ?dimensionUnitUcumCode . }
      OPTIONAL { ?dimensionUnit qudt:expression ?dimensionUnitExpression . }
      OPTIONAL { ?dimensionUnit ?dimensionUnitIsCurrency qudt:CurrencyUnit . }
      OPTIONAL { ?dimensionUnit qudt:currencyExponent ?dimensionUnitCurrencyExponent . }
      BIND(STR(COALESCE(STR(?dimensionUnitSymbol), STR(?dimensionUnitUcumCode), STR(?dimensionUnitExpression), STR(?dimensionUnitRdfsLabel))) AS ?dimensionUnitLabel)
      FILTER (LANG(?dimensionUnitRdfsLabel) = "${locale}" || LANG(?dimensionUnitRdfsLabel) = "en" || datatype(?dimensionUnitRdfsLabel) = xsd:string)
    }
    OPTIONAL { ?dimension sh:order ?dimensionOrder . }
    OPTIONAL {
      ?dimension meta:dataKind ?dimensionDataKind .
      ?dimensionDataKind rdf:type ?dimensionDataKindType .
    }
    OPTIONAL {
      ?dimension meta:dataKind ?dimensionDataKind .
      ?dimensionDataKind time:unitType ?dimensionTimeUnitType .
    }
    ${buildLocalizedSubQuery("dimension", "schema:name", "dimensionLabel", {
        locale,
    })}
    ${buildLocalizedSubQuery("dimension", "schema:description", "dimensionDescription", { locale })}
    FILTER(?dimensionIri != cube:observedBy && ?dimensionIri != rdf:type)
  } UNION {
    VALUES ?cube { <${iri}> }
    ?cube cube:observationConstraint/sh:property/sh:path ?observationPredicate .
    { SELECT ?observation ?observationPredicate ?observationValue ?observationLabel ?observationPosition WHERE {
    { 
#pragma evaluate on  ## improve preview speed (wrt Stardog issue 2094 on Stardog >= 10 // see also SBAR-1122)
      SELECT ?observation WHERE {
      VALUES ?cube { <${iri}> }
      ?cube cube:observationSet ?observationSet .
      ?observationSet cube:observation ?observation .
      FILTER(EXISTS { ?cube cube:observationConstraint/sh:property/sh:datatype cube:Undefined . } || NOT EXISTS { ?observation ?p ""^^cube:Undefined . })
    } LIMIT 10 }
      ?observation ?observationPredicate ?observationValue .
      ${buildLocalizedSubQuery("observationValue", "schema:name", "observationLabel", { locale })}
      OPTIONAL { ?observationValue schema:position ?observationPosition . }
      FILTER(?observationPredicate != cube:observedBy && ?observationPredicate != rdf:type)
    }}
  }
}`, { operation: "postUrlencoded" });
    if (qs.length === 0) {
        throw Error(`No cube found for ${iri}!`);
    }
    const sQs = groupBy(qs, (q) => q.subject.value);
    const spQs = Object.fromEntries(Object.entries(sQs).map(([k, v]) => {
        const pQs = groupBy(v, (q) => q.predicate.value);
        return [k, pQs];
    }));
    const dimensions = [];
    const measures = [];
    const observations = [];
    const qsDims = qs.filter(({ predicate: p }) => p.equals(ns.sh.path));
    const dimMetadataByDimIri = qsDims.reduce((acc, dim) => {
        acc[dim.object.value] = {
            values: [],
            dataType: rdf.namedNode(""),
        };
        return acc;
    }, {});
    // Only take quads that use dimension iris as predicates (observation values)
    const qUniqueObservations = uniqBy(qs.filter(({ subject: s, predicate: p }) => 
    // Exclude situations where the subject is a blank node (e.g. dimension IRI
    // is not unique, but something like ns.schema.name)
    s.termType !== "BlankNode" && qsDims.some((q) => q.object.equals(p))), ({ subject: s }) => s.value);
    qUniqueObservations.forEach(({ subject: s }) => {
        const sqDimValues = uniqBy(qsDims
            .map((quad) => { var _a; return (_a = spQs[s.value]) === null || _a === void 0 ? void 0 : _a[quad.object.value]; })
            .flat()
            .filter(truthy), (d) => d.predicate.value);
        const observation = {};
        sqDimValues.forEach((quad) => {
            var _a, _b, _c;
            const qDimIri = quad.predicate;
            const dimIri = qDimIri.value;
            const qDimValue = quad.object;
            let qPosition;
            if (!observation[dimIri]) {
                // Retrieve the label of the observation value if it's a named node
                if (qDimValue.termType === "NamedNode") {
                    const sIri = qs.find((q) => q.object.equals(quad.object));
                    const qLabel = qs.find(({ subject: s, predicate: p, object: o }) => s.equals(sIri === null || sIri === void 0 ? void 0 : sIri.subject) &&
                        p.equals(qDimIri) &&
                        o.termType === "Literal");
                    if ((qLabel === null || qLabel === void 0 ? void 0 : qLabel.object.termType) === "Literal") {
                        dimMetadataByDimIri[dimIri].dataType = qLabel.object.datatype;
                    }
                    if (sIri === null || sIri === void 0 ? void 0 : sIri.object.value) {
                        qPosition =
                            (_b = (_a = spQs[sIri.object.value]) === null || _a === void 0 ? void 0 : _a[ns.schema.position.value]) === null || _b === void 0 ? void 0 : _b[0];
                    }
                    observation[qDimIri.value] = (_c = qLabel === null || qLabel === void 0 ? void 0 : qLabel.object.value) !== null && _c !== void 0 ? _c : qDimValue.value;
                }
                else {
                    if (qDimValue.termType === "Literal") {
                        dimMetadataByDimIri[dimIri].dataType = qDimValue.datatype;
                    }
                    observation[qDimIri.value] = qDimValue.value;
                }
            }
            const dimensionValue = {
                value: qDimValue.value,
                label: `${observation[qDimIri.value]}`,
                position: qPosition ? +qPosition.object.value : undefined,
            };
            dimMetadataByDimIri[dimIri].values.push(dimensionValue);
        });
        observations.push(Object.fromEntries(Object.entries(observation).map(([k, v]) => {
            return [
                stringifyComponentId({
                    unversionedCubeIri: unversionedIri,
                    unversionedComponentIri: k,
                }),
                v,
            ];
        })));
    });
    for (const dimIri in dimMetadataByDimIri) {
        dimMetadataByDimIri[dimIri].values = uniqBy(dimMetadataByDimIri[dimIri].values, (d) => d.value).sort((a, b) => { var _a, _b; return ((_a = a.position) !== null && _a !== void 0 ? _a : a.label) > ((_b = b.position) !== null && _b !== void 0 ? _b : b.label) ? 1 : -1; });
    }
    qsDims.map(({ subject: s, object: o }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const dimIri = o.value;
        const qsDim = sQs[s.value];
        const pQsDim = groupBy(qsDim, (q) => q.predicate.value);
        const qLabel = (_a = pQsDim[ns.schema.name.value]) === null || _a === void 0 ? void 0 : _a[0];
        const qDesc = (_b = pQsDim[ns.schema.description.value]) === null || _b === void 0 ? void 0 : _b[0];
        const qOrder = (_c = pQsDim[ns.sh.order.value]) === null || _c === void 0 ? void 0 : _c[0];
        const qsType = pQsDim[ns.rdf.type.value];
        const qScaleType = (_d = pQsDim[ns.qudt.scaleType.value]) === null || _d === void 0 ? void 0 : _d[0];
        const scaleType = getScaleType(qScaleType === null || qScaleType === void 0 ? void 0 : qScaleType.object);
        const dataType = dimMetadataByDimIri[dimIri].dataType;
        const qUnit = (_e = pQsDim[ns.qudt.unit.value]) === null || _e === void 0 ? void 0 : _e[0];
        const qUnitLabel = (_g = (_f = spQs[qUnit === null || qUnit === void 0 ? void 0 : qUnit.object.value]) === null || _f === void 0 ? void 0 : _f[ns.schema.name.value]) === null || _g === void 0 ? void 0 : _g[0];
        const qDataKind = (_h = pQsDim[ns.cube("meta/dataKind").value]) === null || _h === void 0 ? void 0 : _h[0];
        const qDataKindType = (_k = (_j = spQs[qDataKind === null || qDataKind === void 0 ? void 0 : qDataKind.object.value]) === null || _j === void 0 ? void 0 : _j[ns.rdf.type.value]) === null || _k === void 0 ? void 0 : _k[0];
        const qTimeUnitType = (_m = (_l = spQs[qDataKind === null || qDataKind === void 0 ? void 0 : qDataKind.object.value]) === null || _l === void 0 ? void 0 : _l[ns.time.unitType.value]) === null || _m === void 0 ? void 0 : _m[0];
        const qIsCurrency = (_p = (_o = spQs[qUnit === null || qUnit === void 0 ? void 0 : qUnit.object.value]) === null || _o === void 0 ? void 0 : _o[ns.qudt.CurrencyUnit.value]) === null || _p === void 0 ? void 0 : _p[0];
        const qCurrencyExponent = (_r = (_q = spQs[qUnit === null || qUnit === void 0 ? void 0 : qUnit.object.value]) === null || _q === void 0 ? void 0 : _q[ns.qudt.currencyExponent.value]) === null || _r === void 0 ? void 0 : _r[0];
        const isKeyDimension = qsType === null || qsType === void 0 ? void 0 : qsType.some((q) => q.object.equals(ns.cube.KeyDimension));
        const isMeasureDimension = qsType === null || qsType === void 0 ? void 0 : qsType.some((q) => q.object.equals(ns.cube.MeasureDimension));
        const baseComponent = {
            cubeIri: iri,
            id: stringifyComponentId({
                unversionedCubeIri: unversionedIri,
                unversionedComponentIri: dimIri,
            }),
            label: (_s = qLabel === null || qLabel === void 0 ? void 0 : qLabel.object.value) !== null && _s !== void 0 ? _s : "",
            description: qDesc === null || qDesc === void 0 ? void 0 : qDesc.object.value,
            scaleType,
            unit: qUnitLabel === null || qUnitLabel === void 0 ? void 0 : qUnitLabel.object.value,
            order: parseNumericalTerm(qOrder === null || qOrder === void 0 ? void 0 : qOrder.object),
            isNumerical: false,
            isKeyDimension,
            values: dimMetadataByDimIri[dimIri].values,
            relatedLimitValues: [],
        };
        if (isMeasureDimension) {
            const isDecimal = (_t = dataType.equals(ns.xsd.decimal)) !== null && _t !== void 0 ? _t : false;
            const result = {
                ...baseComponent,
                __typename: resolveMeasureType(scaleType),
                isCurrency: qIsCurrency ? true : false,
                isDecimal,
                currencyExponent: parseNumericalTerm(qCurrencyExponent === null || qCurrencyExponent === void 0 ? void 0 : qCurrencyExponent.object),
                resolution: parseResolution(dataType),
                isNumerical: getIsNumerical(dataType),
                limits: [],
            };
            measures.push(result);
        }
        else {
            const timeUnit = getTimeUnit(qTimeUnitType === null || qTimeUnitType === void 0 ? void 0 : qTimeUnitType.object);
            const dimensionType = resolveDimensionType(getDataKind(qDataKindType === null || qDataKindType === void 0 ? void 0 : qDataKindType.object), scaleType, timeUnit, []);
            const baseDimension = baseComponent;
            switch (dimensionType) {
                case "TemporalDimension":
                case "TemporalEntityDimension": {
                    const timeFormat = getTimeFormat(dataType, timeUnit);
                    if (!timeFormat || !timeUnit) {
                        throw Error(`Temporal dimension ${dimIri} has no timeFormat or timeUnit!`);
                    }
                    const dimension = {
                        ...baseDimension,
                        __typename: dimensionType,
                        timeFormat,
                        timeUnit,
                    };
                    dimensions.push(dimension);
                    break;
                }
                default: {
                    const dimension = {
                        ...baseDimension,
                        __typename: dimensionType,
                    };
                    dimensions.push(dimension);
                }
            }
        }
    });
    return {
        dimensions,
        measures,
        observations,
    };
};
