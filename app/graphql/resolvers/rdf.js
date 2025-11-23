import { ascending, descending } from "d3-array";
import DataLoader from "dataloader";
import groupBy from "lodash/groupBy";
import { topology } from "topojson-server";
import { parse as parseWKT } from "wellknown";
import { isMeasure, } from "@/domain/data";
import { truthy } from "@/domain/types";
import { getFiltersByComponentIris, parseComponentId, stringifyComponentId, } from "@/graphql/make-component-id";
import { SearchCubeResultOrder, } from "@/graphql/resolver-types";
import { resolveDimensionType, resolveMeasureType } from "@/graphql/resolvers";
import { LightCube } from "@/rdf/light-cube";
import { createCubeDimensionValuesLoader, getCubeDimensions, getCubeObservations, } from "@/rdf/queries";
import { queryCubeUnversionedIri } from "@/rdf/query-cube-unversioned-iri";
import { parseHierarchy, queryHierarchies } from "@/rdf/query-hierarchies";
import { queryLatestCubeIri } from "@/rdf/query-latest-cube-iri";
import { getPossibleFilters } from "@/rdf/query-possible-filters";
import { searchCubes as _searchCubes } from "@/rdf/query-search";
import { getSparqlEditorUrl } from "@/rdf/sparql-utils";
export const dataCubeLatestIri = async (_, { cubeFilter }, { setup }, info) => {
    var _a;
    const { sparqlClient } = await setup(info);
    return ((_a = (await queryLatestCubeIri(sparqlClient, cubeFilter.iri))) !== null && _a !== void 0 ? _a : cubeFilter.iri);
};
export const dataCubeUnversionedIri = async (_, { cubeFilter }, { setup }, info) => {
    var _a;
    const { iri } = cubeFilter;
    const { sparqlClient } = await setup(info);
    return (_a = (await queryCubeUnversionedIri(sparqlClient, iri))) !== null && _a !== void 0 ? _a : iri;
};
const sortResults = (results, order, locale) => {
    switch (order) {
        case SearchCubeResultOrder.TitleAsc:
            results.sort((a, b) => a.cube.title.localeCompare(b.cube.title, locale !== null && locale !== void 0 ? locale : undefined));
            break;
        case SearchCubeResultOrder.CreatedDesc:
        case undefined:
        case null:
            results.sort((a, b) => {
                var _a, _b;
                const ra = (_a = a.cube.datePublished) !== null && _a !== void 0 ? _a : "0";
                const rb = (_b = b.cube.datePublished) !== null && _b !== void 0 ? _b : "0";
                return descending(ra, rb);
            });
            break;
        case SearchCubeResultOrder.Score:
            break;
        default:
            const _exhaustiveCheck = order;
            return _exhaustiveCheck;
    }
    return results;
};
export const searchCubes = async (_, { locale, query, order, includeDrafts, fetchDimensionTermsets, filters }, { setup }, info) => {
    const { sparqlClient } = await setup(info);
    const cubes = await _searchCubes({
        locale,
        includeDrafts,
        fetchDimensionTermsets,
        filters,
        query,
        sparqlClient,
    });
    sortResults(cubes, order, locale);
    return cubes;
};
export const dataCubeDimensionGeoShapes = async (_, { locale, cubeFilter }, { setup }, info) => {
    const { iri, dimensionId } = cubeFilter;
    const { unversionedComponentIri = dimensionId } = parseComponentId(dimensionId);
    const { loaders, sparqlClient, cache } = await setup(info);
    const dimension = await getResolvedDimension(unversionedComponentIri, {
        cubeIri: iri,
        locale,
        sparqlClient,
        loaders,
        cache,
    });
    const dimensionValuesLoader = getDimensionValuesLoader(sparqlClient, loaders, cache);
    const dimensionValues = await dimensionValuesLoader.load(dimension);
    const geometries = dimensionValues.map((d) => d.geometry).filter(truthy);
    if (geometries.length === 0) {
        throw Error(`No geometries found for dimension ${unversionedComponentIri}!`);
    }
    const dimensionValuesByGeometry = new Map(dimensionValues.map((d) => [d.geometry, d.value]));
    const dimensionValuesByValue = new Map(dimensionValues.map((d) => [d.value, d.label]));
    const shapes = await loaders.geoShapes.loadMany(geometries);
    const geoJSONFeatures = shapes
        .filter((shape) => !(shape instanceof Error) && shape.wktString !== undefined)
        .map((shape) => {
        const value = dimensionValuesByGeometry.get(shape.geometryIri);
        return {
            type: "Feature",
            properties: {
                iri: value,
                label: dimensionValuesByValue.get(value),
            },
            geometry: parseWKT(shape.wktString),
        };
    });
    return {
        topology: topology({
            shapes: {
                type: "FeatureCollection",
                features: geoJSONFeatures,
            },
        }),
    };
};
// TODO: could be refactored to not fetch the whole cube shape.
const getResolvedDimension = async (iri, options) => {
    const { cubeIri, locale, sparqlClient, loaders, cache } = options;
    const cube = await loaders.cube.load(cubeIri);
    if (!cube) {
        throw Error(`Cube ${cubeIri} not found!`);
    }
    const [unversionedCubeIri = cubeIri] = await Promise.all([
        queryCubeUnversionedIri(sparqlClient, cubeIri),
        cube.fetchShape(),
    ]);
    const dimensions = await getCubeDimensions({
        cube,
        locale,
        sparqlClient,
        unversionedCubeIri,
        componentIris: [iri],
        cache,
    });
    const dimension = dimensions.find((d) => iri === d.data.iri);
    if (!dimension) {
        throw Error(`Dimension ${iri} not found!`);
    }
    return dimension;
};
export const possibleFilters = async (_, { cubeFilter }, { setup }, info) => {
    var _a;
    const { iri, filters: _filters } = cubeFilter;
    const { sparqlClient, loaders, cache } = await setup(info);
    const cube = await loaders.cube.load(iri);
    const cubeIri = (_a = cube.term) === null || _a === void 0 ? void 0 : _a.value;
    if (!cubeIri) {
        return [];
    }
    const filters = getFiltersByComponentIris(_filters);
    return await getPossibleFilters(cubeIri, { filters, sparqlClient, cache });
};
export const dataCubeComponents = async (_, { locale, cubeFilter }, { setup }, info) => {
    var _a;
    const { loaders, sparqlClient, sparqlClientStream, cache } = await setup(info);
    const { iri, componentIds, filters: _filters, loadValues } = cubeFilter;
    const cube = await loaders.cube.load(iri);
    if (!cube) {
        throw Error(`Cube ${iri} not found!`);
    }
    await cube.fetchShape();
    const filters = _filters ? getFiltersByComponentIris(_filters) : undefined;
    const componentIris = componentIds === null || componentIds === void 0 ? void 0 : componentIds.map((id) => { var _a; return (_a = parseComponentId(id).unversionedComponentIri) !== null && _a !== void 0 ? _a : id; });
    const unversionedCubeIri = (_a = (await queryCubeUnversionedIri(sparqlClient, iri))) !== null && _a !== void 0 ? _a : iri;
    const rawComponents = await getCubeDimensions({
        cube,
        locale,
        sparqlClient,
        unversionedCubeIri,
        componentIris,
        cache,
    });
    const allRelatedLimitValuesByDimensionId = groupBy(rawComponents.flatMap((rc) => { var _a; return ((_a = rc.data.limits) !== null && _a !== void 0 ? _a : []).flatMap((limit) => limit.related); }), (d) => d.dimensionId);
    const components = await Promise.all(rawComponents.map(async (component) => {
        var _a, _b;
        const { data } = component;
        const id = stringifyComponentId({
            unversionedCubeIri,
            unversionedComponentIri: data.iri,
        });
        const dimensionValuesLoader = getDimensionValuesLoader(sparqlClient, loaders, cache, filters);
        const [rawValues, rawHierarchies] = await Promise.all(loadValues
            ? [
                dimensionValuesLoader.load(component),
                queryHierarchies(component, {
                    locale,
                    sparqlClientStream,
                }),
            ]
            : [[], null]);
        const values = rawValues.sort((a, b) => {
            var _a, _b, _c, _d;
            return ascending((_b = (_a = a.position) !== null && _a !== void 0 ? _a : a.value) !== null && _b !== void 0 ? _b : undefined, (_d = (_c = b.position) !== null && _c !== void 0 ? _c : b.value) !== null && _d !== void 0 ? _d : undefined);
        });
        const relatedLimitValues = ((_a = allRelatedLimitValuesByDimensionId[id]) !== null && _a !== void 0 ? _a : []).map((r) => ({
            value: r.value,
            label: r.label,
            position: r.position,
        }));
        const baseComponent = {
            // We need to use original iri here, as the cube iri might have changed.
            cubeIri: iri,
            id,
            label: data.name,
            description: data.description,
            unit: data.unit,
            scaleType: data.scaleType,
            dataType: data.dataType,
            order: data.order,
            isNumerical: data.isNumerical,
            isKeyDimension: data.isKeyDimension,
            values,
            relatedLimitValues,
            related: data.related.map((r) => ({
                type: r.type,
                id: stringifyComponentId({
                    unversionedCubeIri,
                    unversionedComponentIri: r.iri,
                }),
            })),
        };
        if (data.isMeasureDimension) {
            const measure = {
                __typename: resolveMeasureType(component.data.scaleType),
                isCurrency: data.isCurrency,
                isDecimal: data.isDecimal,
                currencyExponent: data.currencyExponent,
                resolution: data.resolution,
                limits: (_b = data.limits) !== null && _b !== void 0 ? _b : [],
                ...baseComponent,
            };
            return measure;
        }
        else {
            const { dataKind, scaleType, timeUnit, related } = component.data;
            const dimensionType = resolveDimensionType(dataKind, scaleType, timeUnit, related);
            const hierarchy = rawHierarchies
                ? parseHierarchy(rawHierarchies, {
                    dimensionId: data.iri,
                    locale,
                    dimensionValues: values,
                })
                : null;
            const baseDimension = {
                ...baseComponent,
                hierarchy,
            };
            switch (dimensionType) {
                case "TemporalDimension":
                case "TemporalEntityDimension": {
                    if (!data.timeFormat || !data.timeUnit) {
                        throw Error(`${dimensionType} ${data.iri} is missing timeFormat or timeUnit!`);
                    }
                    const dimension = {
                        __typename: dimensionType,
                        timeFormat: data.timeFormat,
                        timeUnit: data.timeUnit,
                        ...baseDimension,
                    };
                    return dimension;
                }
                default: {
                    const dimension = {
                        __typename: dimensionType,
                        ...baseDimension,
                    };
                    return dimension;
                }
            }
        }
    }));
    const dimensions = components.filter((d) => !isMeasure(d));
    const measures = components.filter(isMeasure);
    return {
        dimensions,
        measures,
    };
};
export const dataCubeComponentTermsets = async (_, { locale, cubeFilter }, { setup }, info) => {
    var _a;
    const { sparqlClient } = await setup(info);
    const { iri } = cubeFilter;
    const unversionedIri = (_a = (await queryCubeUnversionedIri(sparqlClient, iri))) !== null && _a !== void 0 ? _a : iri;
    const cube = new LightCube({ iri, unversionedIri, locale, sparqlClient });
    return await cube.fetchComponentTermsets();
};
export const dataCubeMetadata = async (_, { locale, cubeFilter }, { setup }, info) => {
    var _a;
    const { sparqlClient } = await setup(info);
    const { iri } = cubeFilter;
    const unversionedIri = (_a = (await queryCubeUnversionedIri(sparqlClient, iri))) !== null && _a !== void 0 ? _a : iri;
    const cube = new LightCube({ iri, unversionedIri, locale, sparqlClient });
    return await cube.fetchMetadata();
};
export const dataCubeObservations = async (_, { locale, cubeFilter }, { setup }, info) => {
    const { loaders, sparqlClient, cache } = await setup(info);
    const { iri, filters: _filters, componentIds } = cubeFilter;
    const cube = await loaders.cube.load(iri);
    if (!cube) {
        throw Error("Cube not found!");
    }
    await cube.fetchShape();
    const filters = _filters ? getFiltersByComponentIris(_filters) : undefined;
    const componentIris = componentIds === null || componentIds === void 0 ? void 0 : componentIds.map((id) => { var _a; return (_a = parseComponentId(id).unversionedComponentIri) !== null && _a !== void 0 ? _a : id; });
    const { query, observations } = await getCubeObservations({
        cube,
        locale,
        sparqlClient,
        filters,
        componentIris,
        cache,
    });
    return {
        data: observations,
        sparqlEditorUrl: getSparqlEditorUrl({
            query,
            dataSource: {
                type: info.variableValues.sourceType,
                url: info.variableValues.sourceUrl,
            },
        }),
    };
};
export const dataCubePreview = async (_, { locale, cubeFilter }, { setup }, info) => {
    var _a;
    const { sparqlClient } = await setup(info);
    const { iri } = cubeFilter;
    const unversionedIri = (_a = (await queryCubeUnversionedIri(sparqlClient, iri))) !== null && _a !== void 0 ? _a : iri;
    const cube = new LightCube({ iri, unversionedIri, locale, sparqlClient });
    return await cube.fetchPreview();
};
const getDimensionValuesLoader = (sparqlClient, loaders, cache, filters) => {
    let loader;
    if (filters) {
        const filterKey = JSON.stringify(filters);
        const existingLoader = loaders.filteredDimensionValues.get(filterKey);
        if (existingLoader) {
            return existingLoader;
        }
        loader = new DataLoader(createCubeDimensionValuesLoader(sparqlClient, cache, filters));
        loaders.filteredDimensionValues.set(filterKey, loader);
        return loader;
    }
    else {
        return loaders.dimensionValues;
    }
};
