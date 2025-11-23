import { rollup } from "d3-array";
import { MAX_BATCH_SIZE } from "@/graphql/context";
import { iriToNode } from "@/rdf/query-utils";
/**
 * Creates a GeoShapes loader.
 *
 * @param dimensionIris IRIs of a GeoShape dimension's values
 */
export const createGeoShapesLoader = (props) => {
    const { geoSparqlClient } = props;
    return async (geometryIris) => {
        const geometryIriQueryNodes = geometryIris.map(iriToNode);
        const wktStringsByGeometry = await getWktStringsByGeometry({
            geometryIriQueryNodes,
            geoSparqlClient,
        });
        return geometryIris.map((geometryIri) => {
            return {
                geometryIri,
                wktString: wktStringsByGeometry.get(geometryIri),
            };
        });
    };
};
const getWktStringsByGeometry = async (props) => {
    const { geometryIriQueryNodes, geoSparqlClient } = props;
    const geometryIriChunks = [];
    for (let i = 0; i < geometryIriQueryNodes.length; i += MAX_BATCH_SIZE * 0.5) {
        geometryIriChunks.push(geometryIriQueryNodes.slice(i, i + MAX_BATCH_SIZE * 0.5));
    }
    const rawWktStrings = (await Promise.all(geometryIriChunks.map(async (geometryIris) => {
        return await getChunkWktStrings({ geometryIris, geoSparqlClient });
    }))).flat();
    return rollup(rawWktStrings.map(parseWktString), (v) => v[0].wktString, (d) => d.geometry);
};
const getChunkWktStrings = async (props) => {
    const { geometryIris, geoSparqlClient } = props;
    const query = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
SELECT ?geometry ?wktString WHERE {
  VALUES ?geometry { ${geometryIris.join("\n")} }
  ?geometry geo:asWKT ?wktString
}`;
    return (await geoSparqlClient.query
        .select(query, { operation: "postUrlencoded" })
        .catch((e) => {
        console.error(e);
        return [];
    }));
};
const parseWktString = (rawWktString) => {
    return {
        geometry: rawWktString.geometry.value,
        wktString: rawWktString.wktString.value,
    };
};
