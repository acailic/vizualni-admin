import { Source } from "rdf-cube-view-query";
import rdf from "rdf-ext";
export const pragmas = `#pragma describe.strategy cbd
#pragma join.hash off
`;
export const createSource = (sparqlClient, queryPrefix) => {
    return new Source({
        client: sparqlClient,
        queryOperation: "postUrlencoded",
        queryPrefix,
        sourceGraph: rdf.defaultGraph(),
    });
};
