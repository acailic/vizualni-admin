import { isMostRecentValue } from "@/domain/most-recent-value";
import { stringifyComponentId } from "@/graphql/make-component-id";
import * as ns from "@/rdf/namespace";
import { queryCubeUnversionedIri } from "@/rdf/query-cube-unversioned-iri";
import { loadMaxDimensionValue } from "@/rdf/query-dimension-values";
import { iriToNode } from "@/rdf/query-utils";
export const getPossibleFilters = async (cubeIri, options) => {
    const { filters, sparqlClient, cache } = options;
    const dimensionIris = Object.keys(filters);
    if (dimensionIris.length === 0) {
        console.warn("No filters provided, returning empty possible filters.");
        return [];
    }
    const [unversionedCubeIri = cubeIri, dimensionsMetadata] = await Promise.all([
        queryCubeUnversionedIri(sparqlClient, cubeIri),
        getDimensionsMetadata(cubeIri, dimensionIris, sparqlClient),
    ]);
    const queryFilters = await getQueryFilters(filters, {
        cubeIri,
        dimensionsMetadata,
        sparqlClient,
        cache,
    });
    const query = getQuery(cubeIri, queryFilters);
    const [observation] = await sparqlClient.query.select(query, {
        operation: "postUrlencoded",
    });
    return parsePossibleFilters(observation, {
        unversionedCubeIri,
        queryFilters,
    });
};
const getDimensionsMetadata = async (cubeIri, dimensionIris, sparqlClient) => {
    const DIMENSION_IRI = "dimensionIri";
    const VERSION = "version";
    const NODE_KIND = "nodeKind";
    const query = `PREFIX cube: <https://cube.link/>
PREFIX schema: <http://schema.org/>
PREFIX sh: <http://www.w3.org/ns/shacl#>

SELECT ?${DIMENSION_IRI} ?${VERSION} ?${NODE_KIND} WHERE {
  <${cubeIri}> cube:observationConstraint/sh:property ?dimension .
  ?dimension sh:path ?${DIMENSION_IRI} .
  OPTIONAL { ?dimension schema:version ?${VERSION} . }
  OPTIONAL { ?dimension sh:nodeKind ?${NODE_KIND} . }
  ${dimensionIris.length > 0 ? `FILTER(?${DIMENSION_IRI} IN (${dimensionIris.map(iriToNode).join(", ")}))` : ""}
}`;
    const results = await sparqlClient.query.select(query, {
        operation: "postUrlencoded",
    });
    return results.map((result) => {
        var _a;
        return ({
            iri: result[DIMENSION_IRI].value,
            isVersioned: Boolean(result[VERSION]),
            isLiteral: ((_a = result[NODE_KIND]) === null || _a === void 0 ? void 0 : _a.value) === ns.sh.Literal.value,
        });
    });
};
export const getQuery = (cubeIri, queryFilters) => {
    return `PREFIX cube: <https://cube.link/>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n
SELECT ${queryFilters.map(({ i, isVersioned }) => `?${getQueryDimension(i, isVersioned)}`).join(" ")} WHERE {
  <${cubeIri}> cube:observationSet/cube:observation ?observation .
${queryFilters
        .map(({ i, iri, isVersioned, isLiteral }) => `  ?observation <${iri}> ?${getQueryDimension(i)} .${isVersioned ? `\n  ${unversionDimension(i)} .` : ""}${isLiteral ? `\n  ${stringifyDimension(i, isVersioned)}` : ""}`)
        .join("\n")}
${queryFilters
        .map(({ i, value, isVersioned, isLiteral }) => {
        const queryDimension = getQueryDimension(i, isVersioned, isLiteral);
        return i === 0
            ? // A value for the first dimension must always be found, as it's a root
                // filter.
                `  VALUES ?${queryDimension} { ${getQueryValue(value, isLiteral)} }`
            : // For other dimensions, we try to find their values, but fall back in
                // case there is none.
                `  BIND(?${queryDimension} = ${getQueryValue(value, isLiteral)} AS ?d${i})`;
    })
        .join("\n")}
}
${
    // Ordering by the dimensions is only necessary if there at least one `d` variable.
    queryFilters.length > 1
        ? `ORDER BY ${
        // Order by the boolean `d` variables, so that the first result is the one
        // with the most matching dimensions, keeping the order of the dimensions
        // in mind, to mirror the cascading behavior of the filters.
        queryFilters
            .slice(1)
            .map(({ i }) => `DESC(?d${i})`)
            .join(" ")}`
        : ""}
LIMIT 1`;
};
const getQueryDimension = (i, versioned, literal) => {
    return `dimension${i}${versioned ? "_v" : ""}${literal ? "_str" : ""}`;
};
const unversionDimension = (i) => {
    return `?${getQueryDimension(i)} schema:sameAs ?${getQueryDimension(i, true)}`;
};
const stringifyDimension = (i, isVersioned) => {
    return `BIND(STR(?${getQueryDimension(i, isVersioned)}) AS ?${getQueryDimension(i, isVersioned, true)})`;
};
const getQueryValue = (value, isLiteral) => {
    return isLiteral ? `"${value}"` : iriToNode(value);
};
export const getQueryFilters = async (filters, options) => {
    const { cubeIri, dimensionsMetadata, sparqlClient, cache } = options;
    return Promise.all(Object.entries(filters).map(async ([iri, { value }], i) => {
        var _a, _b;
        const metadata = dimensionsMetadata.find((d) => d.iri === iri);
        const isVersioned = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.isVersioned) !== null && _a !== void 0 ? _a : false;
        const isLiteral = (_b = metadata === null || metadata === void 0 ? void 0 : metadata.isLiteral) !== null && _b !== void 0 ? _b : false;
        return {
            i,
            iri,
            value: isMostRecentValue(value)
                ? await loadMaxDimensionValue(cubeIri, {
                    dimensionIri: iri,
                    // TODO: refactor dimension parsing to avoid "mocking" the cubeDimensions
                    cubeDimensions: Object.keys(filters).map((iri) => ({
                        path: { value: iri },
                        datatype: isLiteral ? { value: ns.xsd.string } : null,
                        out: (p) => {
                            switch (p.value) {
                                case ns.sh.nodeKind.value: {
                                    return isLiteral
                                        ? { value: ns.sh.Literal }
                                        : { value: ns.sh.IRI };
                                }
                                case ns.sh.or.value: {
                                    return {
                                        terms: [],
                                        list() {
                                            return [];
                                        },
                                        toArray() {
                                            return [];
                                        },
                                    };
                                }
                                case ns.sh.datatype.value: {
                                    return {
                                        terms: [],
                                    };
                                }
                                case ns.schema.version.value: {
                                    return isVersioned ? { value: true } : { value: false };
                                }
                            }
                        },
                    })),
                    filters,
                    sparqlClient,
                    cache,
                })
                : `${value}`,
            isVersioned,
            isLiteral,
        };
    }));
};
const parsePossibleFilters = (observation, { unversionedCubeIri, queryFilters, }) => {
    return queryFilters.map(({ i, iri, isVersioned }) => ({
        __typename: "PossibleFilterValue",
        type: "single",
        id: stringifyComponentId({
            unversionedCubeIri,
            unversionedComponentIri: iri,
        }),
        value: observation[getQueryDimension(i, isVersioned)].value,
    }));
};
