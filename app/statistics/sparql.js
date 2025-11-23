import ParsingClient from "sparql-http-client/ParsingClient";
import { DEFAULT_DATA_SOURCE } from "@/domain/data-source";
import { buildLocalizedSubQuery, iriToNode } from "@/rdf/query-utils";
const sparqlClient = new ParsingClient({
    endpointUrl: DEFAULT_DATA_SOURCE.url,
});
const getCubeMetadataQuery = ({ cubeIris, locale, }) => {
    return `PREFIX schema: <http://schema.org/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?iri ?unversionedIri ?title ?creator WHERE {
  VALUES ?iri { ${cubeIris.map(iriToNode).join(" ")} }
  OPTIONAL {
    ?maybeUnversionedIri schema:hasPart ?iri .
  }
  BIND(COALESCE(?maybeUnversionedIri, ?iri) AS ?unversionedIri)
  ${buildLocalizedSubQuery("iri", "schema:name", "title", {
        locale,
    })}
  OPTIONAL {
    ?iri dcterms:creator ?creatorIri .
    GRAPH <https://lindas.admin.ch/sfa/opendataswiss> {
      ?creatorIri a schema:Organization ;
        schema:inDefinedTermSet <https://register.ld.admin.ch/opendataswiss/org> .
        ${buildLocalizedSubQuery("creatorIri", "schema:name", "creator", {
        locale,
    })}
    }
  }
}`;
};
export const queryCubesMetadata = async ({ cubeIris, locale, }) => {
    const query = getCubeMetadataQuery({ cubeIris, locale });
    const results = await sparqlClient.query.select(query, {
        operation: "postUrlencoded",
    });
    return results.map((result) => {
        var _a, _b, _c, _d;
        const iri = result.iri.value;
        return {
            iri,
            unversionedIri: (_a = result.unversionedIri.value) !== null && _a !== void 0 ? _a : iri,
            title: (_c = (_b = result.title) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : iri,
            creator: (_d = result.creator) === null || _d === void 0 ? void 0 : _d.value,
        };
    });
};
