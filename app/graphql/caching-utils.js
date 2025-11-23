import { SOURCES_BY_URL } from "@/domain/data-source/constants";
/** As Lindas supports caching requests per given id, we can utilize this function
 * to query endpoint that will cache the results per given cube iri.
 *
 * This means that if we query the same endpoint with the same cube iri, we will
 * get the cached results, unless the cache is invalidated.
 *
 * If cubeIri is not provided, we default to a general cached endpoint, which
 * has much higher cache invalidation time (two minutes as of writing this comment).
 */
export const getMaybeCachedSparqlUrl = ({ endpointUrl, cubeIri, }) => {
    var _a;
    if (((_a = SOURCES_BY_URL[endpointUrl]) === null || _a === void 0 ? void 0 : _a.supportsCachingPerCubeIri) && cubeIri) {
        return `${endpointUrl}/${cubeIri}`;
    }
    return endpointUrl;
};
