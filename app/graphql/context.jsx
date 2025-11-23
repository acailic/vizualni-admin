import DataLoader from "dataloader";
import rdf from "rdf-ext";
import StreamClient from "sparql-http-client";
import ParsingClient from "sparql-http-client/ParsingClient";
import { LRUCache } from "typescript-lru-cache";
import { SPARQL_GEO_ENDPOINT } from "@/domain/env";
import { getMaybeCachedSparqlUrl } from "@/graphql/caching-utils";
import { createSource, pragmas } from "@/rdf/create-source";
import { ExtendedCube } from "@/rdf/extended-cube";
import { createCubeDimensionValuesLoader } from "@/rdf/queries";
import { createGeoShapesLoader } from "@/rdf/query-geo-shapes";
import { timed } from "@/utils/timed";
export const MAX_BATCH_SIZE = 500;
const getRawCube = async (sparqlClient, iri) => {
    const source = createSource(sparqlClient, pragmas);
    const cube = new ExtendedCube({
        parent: source,
        term: rdf.namedNode(iri),
        source,
    });
    // Don't fetch shape yet, as we might need to fetch newer cube.
    await cube.fetchCube();
    return cube;
};
const createCubeLoader = (sparqlClient) => {
    return (cubeIris) => {
        return Promise.all(cubeIris.map(async (iri) => {
            return getRawCube(sparqlClient, iri);
        }));
    };
};
const createLoaders = async (sparqlClient, geoSparqlClient, cache) => {
    return {
        cube: new DataLoader(createCubeLoader(sparqlClient)),
        dimensionValues: new DataLoader(createCubeDimensionValuesLoader(sparqlClient, cache), {
            cacheKeyFn: (dim) => { var _a; return (_a = dim.dimension.path) === null || _a === void 0 ? void 0 : _a.value; },
        }),
        filteredDimensionValues: new Map(),
        geoShapes: new DataLoader(createGeoShapesLoader({ geoSparqlClient }), {
            maxBatchSize: MAX_BATCH_SIZE * 0.5,
        }),
    };
};
const setupSparqlClients = (ctx, sourceUrl) => {
    const sparqlClient = new ParsingClient({
        endpointUrl: sourceUrl,
    });
    const sparqlClientStream = new StreamClient({
        endpointUrl: sourceUrl,
    });
    const geoSparqlClient = new ParsingClient({
        // Geo endpoint is not stored separately in chart config, so we can use the
        // SPARQL_GEO_ENDPOINT env variable here.
        endpointUrl: SPARQL_GEO_ENDPOINT,
    });
    const saveTimingToContext = (t, ...args) => {
        ctx.queries.push({
            startTime: t.start,
            endTime: t.end,
            text: args[0],
        });
    };
    sparqlClient.query.select = timed(sparqlClient.query.select, saveTimingToContext);
    sparqlClient.query.construct = timed(sparqlClient.query.construct, saveTimingToContext);
    sparqlClientStream.query.select = timed(sparqlClientStream.query.select, saveTimingToContext);
    sparqlClientStream.query.construct = timed(sparqlClientStream.query.construct, saveTimingToContext);
    geoSparqlClient.query.select = timed(geoSparqlClient.query.select, saveTimingToContext);
    geoSparqlClient.query.construct = timed(geoSparqlClient.query.construct, saveTimingToContext);
    return { sparqlClient, sparqlClientStream, geoSparqlClient };
};
const sparqlCache = new LRUCache({
    entryExpirationTimeInMS: 60 * 10000,
    maxSize: 10000,
});
const shouldUseServerSideCache = (req) => {
    return req.headers["x-visualize-cache-control"] !== "no-cache";
};
const isDebugMode = (req) => {
    return req.headers["x-visualize-debug"] === "true";
};
const createContextContent = async ({ sourceUrl, ctx, req, }) => {
    const { sparqlClient, sparqlClientStream, geoSparqlClient } = setupSparqlClients(ctx, sourceUrl);
    const contextCache = shouldUseServerSideCache(req) ? sparqlCache : undefined;
    const loaders = await createLoaders(sparqlClient, geoSparqlClient, contextCache);
    return new Proxy({ loaders, sparqlClient, sparqlClientStream, cache: contextCache }, {
        get(target, prop, receiver) {
            if (prop === "sparqlClient" || prop === "sparqlClientStream") {
                if (!sourceUrl) {
                    throw Error('To use sparqlClient or sparqlClientStream from the GraphQL context, your query must have a "sourceUrl" variable');
                }
            }
            return Reflect.get(target, prop, receiver);
        },
    });
};
export const createContext = ({ req }) => {
    const debug = isDebugMode(req);
    let settingUp;
    const ctx = {
        debug,
        // Stores meta information on queries that have been made during the request
        queries: [],
        timings: undefined,
        setup: async (props) => {
            const variableValues = props.variableValues;
            const { sourceUrl } = variableValues;
            settingUp =
                settingUp ||
                    createContextContent({
                        sourceUrl: getMaybeCachedSparqlUrl({
                            endpointUrl: sourceUrl,
                            cubeIri: "cubeFilter" in variableValues
                                ? variableValues.cubeFilter.iri
                                : undefined,
                        }),
                        ctx,
                        req,
                    });
            return await settingUp;
        },
    };
    return ctx;
};
