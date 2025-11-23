import { groups } from "d3-array";
import { executeWithCache } from "./query-cache";
const BATCH_SIZE = 500;
export const batchLoad = async ({ ids, sparqlClient, cache, buildQuery, batchSize = BATCH_SIZE, }) => {
    const batched = groups(ids, (_, i) => Math.floor(i / batchSize));
    const results = await Promise.all(batched.map(async ([key, values]) => {
        const query = buildQuery(values, key).build();
        try {
            return (await executeWithCache(sparqlClient, query, () => sparqlClient.query.select(query, { operation: "postUrlencoded" }), (t) => t, cache));
        }
        catch (e) {
            console.log(`Error while querying. First ID of ${ids.length}: <${ids[0].value}>`);
            console.error(e);
            return [];
        }
    }));
    return results.flat();
};
