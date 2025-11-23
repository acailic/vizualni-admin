import { ascending, index } from "d3-array";
import keyBy from "lodash/keyBy";
import mapKeys from "lodash/mapKeys";
import { LookupSource, View } from "rdf-cube-view-query";
import rdf from "rdf-ext";
import { parseObservationValue, shouldLoadMinMaxValues, } from "@/domain/data";
import { isMostRecentValue } from "@/domain/most-recent-value";
import { parseComponentId, stringifyComponentId, } from "@/graphql/make-component-id";
import { resolveDimensionType } from "@/graphql/resolvers";
import { createSource, pragmas } from "@/rdf/create-source";
import { getDimensionLimits } from "@/rdf/limits";
import * as ns from "@/rdf/namespace";
import { parseCubeDimension, parseRelatedDimensions } from "@/rdf/parse";
import { queryCubeUnversionedIri } from "@/rdf/query-cube-unversioned-iri";
import { loadDimensionsValuesWithMetadata, loadMaxDimensionValue, loadMinMaxDimensionValues, } from "@/rdf/query-dimension-values";
import { loadUnits } from "@/rdf/query-unit-labels";
import { getQueryLocales } from "@/rdf/query-utils";
const DIMENSION_VALUE_UNDEFINED = ns.cube.Undefined.value;
/** Adds a suffix to an iri to mark its label */
const labelDimensionIri = (iri) => `${iri}/__label__`;
const iriDimensionIri = (iri) => `${iri}/__iri__`;
const unversionedDimensionIri = (iri) => `${iri}/__unversioned__`;
const getDimensionUnits = (d) => {
    var _a;
    // Keeping qudt:unit format for backwards compatibility.
    const t = (_a = d.out(ns.qudt.unit).term) !== null && _a !== void 0 ? _a : d.out(ns.qudt.hasUnit).term;
    return t ? [t] : [];
};
export const getCubeDimensions = async ({ cube, locale, sparqlClient, unversionedCubeIri, componentIris, cache, }) => {
    try {
        const dimensions = cube.dimensions
            .filter(isObservationDimension)
            .filter((d) => {
            var _a;
            if (componentIris) {
                const iri = (_a = d.path) === null || _a === void 0 ? void 0 : _a.value;
                return (componentIris.includes(iri) ||
                    parseRelatedDimensions(d).some((r) => componentIris.includes(r.iri)));
            }
            return true;
        });
        const dimensionUnits = dimensions.flatMap(getDimensionUnits);
        const dimensionUnitIndex = index(await loadUnits({
            ids: dimensionUnits,
            locale,
            sparqlClient,
            cache,
        }), (d) => d.iri.value);
        const limits = await createCubeDimensionLimitsLoader({
            locale,
            unversionedCubeIri,
            sparqlClient,
        })(dimensions);
        return dimensions
            .map((dim, i) => {
            return parseCubeDimension({
                dim,
                cube,
                locale,
                units: dimensionUnitIndex,
                limits: limits[i],
            });
        })
            .sort((a, b) => ascending(a.data.order, b.data.order));
    }
    catch (e) {
        console.error(`Failed to get cube dimensions for ${unversionedCubeIri}:`, e);
        return [];
    }
};
const createCubeDimensionLimitsLoader = (options) => async (dimensions) => {
    return Promise.all(dimensions.map((dimension) => getDimensionLimits(dimension, options)));
};
export const createCubeDimensionValuesLoader = (sparqlClient, cache, filters) => async (resolvedDimensions) => {
    return await getCubeDimensionsValues(resolvedDimensions, {
        sparqlClient,
        filters,
        cache,
    });
};
const getCubeDimensionsValues = async (resolvedDimensions, { sparqlClient, filters, cache, }) => {
    const dimensionIris = resolvedDimensions.map((d) => d.data.iri);
    const { minMaxDimensions, regularDimensions } = resolvedDimensions.reduce((acc, dimension) => {
        if (shouldLoadMinMaxValues(dimension)) {
            acc.minMaxDimensions.push(dimension);
        }
        else {
            acc.regularDimensions.push(dimension);
        }
        return acc;
    }, { minMaxDimensions: [], regularDimensions: [] });
    const result = await Promise.all([
        getMinMaxDimensionsValues(minMaxDimensions, {
            sparqlClient,
            cache,
        }),
        getRegularDimensionsValues(regularDimensions, {
            sparqlClient,
            filters,
            cache,
        }),
    ]);
    return result
        .flat()
        .sort((a, b) => dimensionIris.indexOf(a.dimensionIri) -
        dimensionIris.indexOf(b.dimensionIri))
        .map(({ values }) => values);
};
const getMinMaxDimensionsValues = async (resolvedDimensions, { sparqlClient, cache, }) => {
    return await Promise.all(resolvedDimensions.map(async (resolvedDimension) => {
        return {
            dimensionIri: resolvedDimension.data.iri,
            values: await getMinMaxDimensionValues(resolvedDimension, {
                sparqlClient,
                cache,
            }),
        };
    }));
};
const getMinMaxDimensionValues = async (resolvedDimension, { sparqlClient, cache, }) => {
    var _a, _b, _c;
    const { dimension, cube } = resolvedDimension;
    const { minInclusive, maxInclusive } = dimension;
    if (typeof minInclusive !== "undefined" &&
        typeof maxInclusive !== "undefined") {
        const min = (_a = parseObservationValue({ value: minInclusive })) !== null && _a !== void 0 ? _a : 0;
        const max = (_b = parseObservationValue({ value: maxInclusive })) !== null && _b !== void 0 ? _b : 0;
        return [
            { value: min, label: `${min}` },
            { value: max, label: `${max}` },
        ];
    }
    // Try to get min/max values from a list of values.
    let listItemPointer = dimension.out(ns.sh.or);
    while (listItemPointer.out(ns.rdf.rest).value &&
        // Only try until we reach the end of the list.
        !((_c = listItemPointer.out(ns.rdf.rest).term) === null || _c === void 0 ? void 0 : _c.equals(ns.rdf.nil))) {
        const item = listItemPointer.out(ns.rdf.first);
        const itemMin = item.out(ns.sh.minInclusive);
        const itemMax = item.out(ns.sh.maxInclusive);
        if (typeof itemMin.value !== "undefined" &&
            typeof itemMax.value !== "undefined") {
            const min = +itemMin.value;
            const max = +itemMax.value;
            return [
                { value: min, label: `${min}` },
                { value: max, label: `${max}` },
            ];
        }
        listItemPointer = listItemPointer.out(ns.rdf.rest);
    }
    if (cube.term && dimension.path) {
        const result = await loadMinMaxDimensionValues({
            datasetIri: cube.term.value,
            dimensionIri: dimension.path.value,
            sparqlClient,
            cache,
        });
        if (result) {
            const [min, max] = result;
            return [
                { value: min, label: `${min}` },
                { value: max, label: `${max}` },
            ];
        }
        return [];
    }
    return [];
};
const getRegularDimensionsValues = async (resolvedDimensions, { sparqlClient, filters, cache, }) => {
    var _a;
    if (resolvedDimensions.length === 0) {
        return [];
    }
    // `cube` and `locale` are the same for all dimensions
    const { cube, locale } = resolvedDimensions[0];
    const cubeIri = (_a = cube.term) === null || _a === void 0 ? void 0 : _a.value;
    return await loadDimensionsValuesWithMetadata(cubeIri, {
        dimensionIris: resolvedDimensions.map((d) => d.data.iri),
        cubeDimensions: cube.dimensions,
        sparqlClient,
        filters,
        locale,
        cache,
    });
};
const isObservationDimension = (dim) => {
    var _a;
    return !!(dim.path &&
        ![ns.rdf.type.value, ns.cube.observedBy.value].includes((_a = dim.path.value) !== null && _a !== void 0 ? _a : ""));
};
export const dimensionIsVersioned = (dimension) => { var _a; return !!((_a = dimension.out(ns.schema.version)) === null || _a === void 0 ? void 0 : _a.value); };
export const getCubeObservations = async ({ cube, locale, sparqlClient, filters, preview, limit, raw, componentIris, cache, }) => {
    var _a, _b;
    const cubeIri = (_a = cube.term) === null || _a === void 0 ? void 0 : _a.value;
    const cubeView = View.fromCube(cube, false);
    const unversionedCubeIri = (_b = (await queryCubeUnversionedIri(sparqlClient, cubeIri))) !== null && _b !== void 0 ? _b : cubeIri;
    const allResolvedDimensions = await getCubeDimensions({
        cube,
        locale,
        sparqlClient,
        unversionedCubeIri,
        cache,
    });
    const resolvedDimensions = allResolvedDimensions.filter((d) => {
        if (componentIris) {
            return (componentIris.includes(d.data.iri) ||
                d.data.related.find((r) => componentIris === null || componentIris === void 0 ? void 0 : componentIris.includes(r.iri)));
        }
        return true;
    });
    const resolvedDimensionsByIri = keyBy(resolvedDimensions, (d) => d.data.iri);
    componentIris = resolvedDimensions.map((d) => d.data.iri);
    const serverFilters = {};
    let dbFilters = {};
    for (const [k, v] of Object.entries(filters !== null && filters !== void 0 ? filters : {})) {
        if (v.type !== "multi") {
            dbFilters[k] = v;
        }
        else {
            const count = Object.keys(v.values).length;
            if (count > 100) {
                // Apply server-side filter when filter values count exceeds threshold
                serverFilters[k] = v;
            }
            else {
                dbFilters[k] = v;
            }
        }
    }
    const observationFilters = filters
        ? await buildFilters({
            cube,
            view: cubeView,
            filters: dbFilters,
            locale,
            sparqlClient,
            cache,
        })
        : [];
    const observationDimensions = buildDimensions({
        cubeView,
        dimensionIris: componentIris,
        resolvedDimensions,
        cube,
        locale,
        observationFilters,
        raw,
    });
    const observationsView = new View({
        dimensions: observationDimensions,
        filters: observationFilters,
    });
    // In order to fix an error with cartesian products introduced in preview query
    // when using #pragma join.hash off, we need to have a clean source without
    // decorating the sparql client. However we still need to keep the pragmas
    // for the full query, to vastly improve performance.
    observationsView.getMainSource = preview
        ? () => createSource(sparqlClient)
        : cubeView.getMainSource;
    const { query, observationsRaw } = await fetchViewObservations({
        preview,
        limit,
        observationsView,
        disableDistinct: !filters || Object.keys(filters).length === 0,
    });
    const serverFilter = Object.keys(serverFilters).length > 0
        ? makeServerFilter(serverFilters, resolvedDimensionsByIri)
        : null;
    const filteredObservationsRaw = [];
    const observations = [];
    const observationParser = parseObservation(resolvedDimensions, raw);
    for (const d of observationsRaw) {
        if (!serverFilter || serverFilter(d)) {
            const obs = observationParser(d);
            observations.push(obs);
            filteredObservationsRaw.push(d);
        }
    }
    return {
        query,
        observations: observations.map((obs) => mapKeys(obs, (_, iri) => stringifyComponentId({
            unversionedCubeIri,
            unversionedComponentIri: iri,
        }))),
    };
};
const makeServerFilter = (filters, resolvedDimensionsByIri) => {
    const sets = new Map();
    for (const [iri, filter] of Object.entries(filters)) {
        const valueSet = new Set(Object.keys(filter.values));
        sets.set(iri, valueSet);
    }
    return (d) => {
        var _a, _b, _c, _d;
        for (const [iri, valueSet] of sets.entries()) {
            const resolvedDimension = resolvedDimensionsByIri[iri];
            const isVersioned = resolvedDimension && dimensionIsVersioned(resolvedDimension.dimension);
            const valueToCheck = isVersioned
                ? ((_b = (_a = d[unversionedDimensionIri(iri)]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : (_c = d[iri]) === null || _c === void 0 ? void 0 : _c.value)
                : (_d = d[iri]) === null || _d === void 0 ? void 0 : _d.value;
            return valueSet.has(valueToCheck);
        }
        return true;
    };
};
export const hasHierarchy = (dim) => {
    return dim.out(ns.cubeMeta.inHierarchy).values.length > 0;
};
const buildFilters = async ({ cube, view, filters, locale, sparqlClient, cache, }) => {
    const lookupSource = LookupSource.fromSource(cube.source);
    lookupSource.queryPrefix = pragmas;
    return await Promise.all(Object.entries(filters).flatMap(async ([filterComponentId, filter]) => {
        var _a, _b, _c;
        const iri = (_a = parseComponentId(filterComponentId)
            .unversionedComponentIri) !== null && _a !== void 0 ? _a : filterComponentId;
        const cubeDimension = cube.dimensions.find((d) => { var _a; return ((_a = d.path) === null || _a === void 0 ? void 0 : _a.value) === iri; });
        if (!cubeDimension) {
            console.warn(`WARNING: No cube dimension ${iri}`);
            return [];
        }
        const dimension = view.dimension({ cubeDimension: iri });
        if (!dimension) {
            console.warn(`WARNING: No dimension ${iri}`);
            return [];
        }
        // FIXME: Adding this dimension will make the query return nothing for dimensions that don't have it (no way to make it optional)
        /**
         * When dealing with a versioned dimension, the value provided from the config is unversioned
         * The relationship is expressed with schema:sameAs, so we need to look up the *versioned* value to apply the filter
         * If the dimension is not versioned (e.g. if its values are Literals), it can be used directly to filter
         */
        const filterDimension = dimensionIsVersioned(cubeDimension)
            ? view.createDimension({
                source: lookupSource,
                path: ns.schema.sameAs,
                join: dimension,
                as: labelDimensionIri(`${iri}/__sameAs__`), // Just a made up dimension name that is used in the generated query but nowhere else
            })
            : dimension;
        const resolvedDimension = parseCubeDimension({
            dim: cubeDimension,
            cube,
            locale,
            // We don't need to know the limits when filtering.
            limits: [],
        });
        const { dataType, dataKind, scaleType, timeUnit, related } = resolvedDimension.data;
        const dimensionType = resolveDimensionType(dataKind, scaleType, timeUnit, related);
        if (ns.rdf.langString.value === dataType) {
            throw Error(`Dimension <${iri}> has dataType 'langString', which is not supported by Visualize. In order to fix it, change the dataType to 'string' in the cube definition.`);
        }
        const dimensionHasHierarchy = hasHierarchy(cubeDimension);
        const toRDFValue = (d) => {
            return dataType && !dimensionHasHierarchy
                ? resolvedDimension.data.hasUndefinedValues &&
                    d === DIMENSION_VALUE_UNDEFINED
                    ? rdf.literal("", ns.cube.Undefined)
                    : rdf.literal(d, dataType)
                : rdf.namedNode(d);
        };
        switch (filter.type) {
            case "single": {
                if (isMostRecentValue(filter.value)) {
                    const maxValue = await loadMaxDimensionValue((_b = cube.term) === null || _b === void 0 ? void 0 : _b.value, {
                        dimensionIri: resolvedDimension.data.iri,
                        cubeDimensions: cube.dimensions,
                        sparqlClient,
                        filters,
                        cache,
                    });
                    return [filterDimension.filter.eq(toRDFValue(maxValue))];
                }
                return [filterDimension.filter.eq(toRDFValue(`${filter.value}`))];
            }
            case "multi": {
                // If values is an empty object, we filter by something that doesn't exist
                return [
                    filterDimension.filter.in(Object.keys(filter.values).length > 0
                        ? Object.entries(filter.values).flatMap(([iri, selected]) => selected ? [toRDFValue(iri)] : [])
                        : [rdf.namedNode("EMPTY_VALUE")]),
                ];
            }
            case "range": {
                const isTemporalEntityDimension = dimensionType === "TemporalEntityDimension";
                const maxValue = isMostRecentValue(filter.to)
                    ? await loadMaxDimensionValue((_c = cube.term) === null || _c === void 0 ? void 0 : _c.value, {
                        dimensionIri: resolvedDimension.data.iri,
                        cubeDimensions: cube.dimensions,
                        sparqlClient,
                        filters,
                        cache,
                    })
                    : filter.to;
                if (!isTemporalEntityDimension) {
                    return [
                        filterDimension.filter.gte(toRDFValue(filter.from)),
                        filterDimension.filter.lte(toRDFValue(maxValue)),
                    ];
                }
                const filterDimensionPosition = view.createDimension({
                    source: lookupSource,
                    path: ns.schema.position,
                    join: filterDimension,
                    as: labelDimensionIri(`${iri}/__position__`),
                });
                return [
                    filterDimensionPosition.filter.gte(rdf.literal(filter.from, ns.xsd.string)),
                    filterDimensionPosition.filter.lte(rdf.literal(maxValue, ns.xsd.string)),
                ];
            }
            default:
                const _exhaustiveCheck = filter;
                return _exhaustiveCheck;
        }
    })).then((d) => d.flat());
};
async function fetchViewObservations({ preview, limit, observationsView, disableDistinct, }) {
    /**
     * Add LIMIT to query
     */
    if (!preview && limit !== undefined) {
        // From https://github.com/zazuko/cube-creator/blob/a32a90ff93b2c6c1c5ab8fd110a9032a8d179670/apis/core/lib/domain/observations/lib/index.ts#L41
        observationsView.ptr.addOut(ns.cubeView.projection, (projection) => projection.addOut(ns.cubeView.limit, limit));
    }
    const fullQuery = observationsView.observationsQuery({ disableDistinct });
    const query = pragmas
        .concat(preview && limit ? fullQuery.previewQuery({ limit }) : fullQuery.query)
        .toString();
    let observationsRaw;
    try {
        observationsRaw = await (preview && limit
            ? observationsView.preview({ limit })
            : observationsView.observations({ disableDistinct }));
    }
    catch (e) {
        console.warn("Observations query failed!", query);
        throw Error(`Could not retrieve data: ${e instanceof Error ? e.message : e}`);
    }
    return {
        query,
        observationsRaw,
    };
}
function parseObservation(cubeDimensions, raw) {
    return (obs) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const res = {};
        for (const d of cubeDimensions) {
            const label = (_a = obs[labelDimensionIri(d.data.iri)]) === null || _a === void 0 ? void 0 : _a.value;
            const termType = (_b = obs[d.data.iri]) === null || _b === void 0 ? void 0 : _b.termType;
            const isVersioned = dimensionIsVersioned(d.dimension);
            const value = termType === "Literal" &&
                ns.cube.Undefined.equals((_c = obs[d.data.iri]) === null || _c === void 0 ? void 0 : _c.datatype)
                ? null
                : termType === "NamedNode" &&
                    ns.cube.Undefined.equals(obs[d.data.iri])
                    ? "–"
                    : (_d = obs[d.data.iri]) === null || _d === void 0 ? void 0 : _d.value;
            const rawValue = parseObservationValue({ value: obs[d.data.iri] });
            const unversionedValue = isVersioned
                ? (_e = obs[unversionedDimensionIri(d.data.iri)]) === null || _e === void 0 ? void 0 : _e.value
                : undefined;
            const finalValue = (_g = unversionedValue !== null && unversionedValue !== void 0 ? unversionedValue : (_f = obs[d.data.iri]) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : null;
            res[iriDimensionIri(d.data.iri)] = finalValue;
            res[d.data.iri] = raw
                ? rawValue
                : ((_j = (_h = label !== null && label !== void 0 ? label : unversionedValue) !== null && _h !== void 0 ? _h : value) !== null && _j !== void 0 ? _j : null);
        }
        return res;
    };
}
function buildDimensions({ cubeView, dimensionIris, resolvedDimensions, cube, locale, observationFilters, raw, }) {
    const observationDimensions = cubeView.dimensions.filter((d) => d.cubeDimensions.every((cd) => isObservationDimension(cd) &&
        (dimensionIris ? dimensionIris.includes(cd.path.value) : true)));
    // Find dimensions which are NOT literal
    const namedDimensions = resolvedDimensions.filter(({ data: { isLiteral } }) => !isLiteral);
    // Find versioned dimensions for unversioning
    const versionedDimensions = resolvedDimensions.filter(({ dimension }) => dimensionIsVersioned(dimension));
    const lookupSource = LookupSource.fromSource(cube.source);
    lookupSource.queryPrefix = pragmas;
    // Override sourceGraph from cube source, so lookups also work outside of that graph
    lookupSource.ptr.deleteOut(ns.cubeView.graph);
    lookupSource.ptr.addOut(ns.cubeView.graph, rdf.defaultGraph());
    for (const dimension of namedDimensions) {
        if (raw) {
            continue;
        }
        const labelDimension = cubeView.createDimension({
            source: lookupSource,
            path: ns.schema.name,
            join: cubeView.dimension({ cubeDimension: dimension.data.iri }),
            as: labelDimensionIri(dimension.data.iri),
        });
        observationDimensions.push(labelDimension);
        observationFilters.push(labelDimension.filter.lang(getQueryLocales(locale)));
    }
    for (const dimension of versionedDimensions) {
        const baseDimension = cubeView.dimension({
            cubeDimension: dimension.data.iri,
        });
        if (baseDimension) {
            const unversionedDimension = cubeView.createDimension({
                source: lookupSource,
                path: ns.schema.sameAs,
                join: baseDimension,
                as: unversionedDimensionIri(dimension.data.iri),
            });
            observationDimensions.push(unversionedDimension);
        }
    }
    return observationDimensions;
}
