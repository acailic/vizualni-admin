/** Creates SPARQL query to fetch cube's version history. */
const getCubeUnversionedIriQuery = (cubeIri) => {
    return `PREFIX schema: <http://schema.org/>

SELECT ?unversionedIri WHERE {
  ?unversionedIri schema:hasPart <${cubeIri}> .
}`;
};
export const queryCubeUnversionedIri = async (sparqlClient, iri) => {
    var _a;
    const query = getCubeUnversionedIriQuery(iri);
    const results = await sparqlClient.query.select(query, {
        operation: "postUrlencoded",
    });
    return (_a = results[0]) === null || _a === void 0 ? void 0 : _a.unversionedIri.value;
};
