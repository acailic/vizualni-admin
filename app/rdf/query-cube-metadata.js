import { SELECT } from "@tpluscode/sparql-builder";
import { DataCubePublicationStatus } from "@/graphql/query-hooks";
import { pragmas } from "@/rdf/create-source";
import * as ns from "@/rdf/namespace";
import { buildLocalizedSubQuery, GROUP_SEPARATOR } from "@/rdf/query-utils";
const parseRawMetadata = (cube) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const themeIris = cube.themeIris.value.split(GROUP_SEPARATOR);
    const themeLabels = cube.themeLabels.value.split(GROUP_SEPARATOR);
    const contactPointEmails = cube.contactPointEmails.value.split(GROUP_SEPARATOR);
    const contactPointNames = cube.contactPointNames.value.split(GROUP_SEPARATOR);
    return {
        iri: cube.iri.value,
        unversionedIri: (_a = cube.unversionedIri) === null || _a === void 0 ? void 0 : _a.value,
        identifier: (_b = cube.identifier) === null || _b === void 0 ? void 0 : _b.value,
        title: cube.title.value,
        description: (_c = cube.description) === null || _c === void 0 ? void 0 : _c.value,
        version: (_d = cube.version) === null || _d === void 0 ? void 0 : _d.value,
        datePublished: (_e = cube.datePublished) === null || _e === void 0 ? void 0 : _e.value,
        dateModified: (_f = cube.dateModified) === null || _f === void 0 ? void 0 : _f.value,
        publicationStatus: cube.status.value ===
            ns.adminVocabulary("CreativeWorkStatus/Published").value
            ? DataCubePublicationStatus.Published
            : DataCubePublicationStatus.Draft,
        themes: themeIris.length === themeLabels.length
            ? themeIris.map((iri, i) => ({
                iri,
                label: themeLabels[i],
            }))
            : [],
        creator: cube.creatorIri && cube.creatorLabel
            ? { iri: cube.creatorIri.value, label: cube.creatorLabel.value }
            : undefined,
        contactPoints: contactPointEmails.length === contactPointNames.length
            ? contactPointEmails.map((email, i) => ({
                email,
                name: contactPointNames[i],
            }))
            : [],
        publisher: (_g = cube.publisher) === null || _g === void 0 ? void 0 : _g.value,
        landingPage: (_h = cube.landingPage) === null || _h === void 0 ? void 0 : _h.value,
        expires: (_j = cube.expires) === null || _j === void 0 ? void 0 : _j.value,
        workExamples: (_k = cube.workExamples) === null || _k === void 0 ? void 0 : _k.value.split(GROUP_SEPARATOR),
    };
};
export const getCubeMetadata = async (iri, { locale, sparqlClient }) => {
    const query = SELECT `
    ?iri ?identifier ?title ?description ?version ?datePublished ?dateModified ?status ?creatorIri ?creatorLabel ?unversionedIri ?publisher ?landingPage ?expires
    (GROUP_CONCAT(DISTINCT ?themeIri; SEPARATOR="${GROUP_SEPARATOR}") AS ?themeIris)
    (GROUP_CONCAT(DISTINCT ?themeLabel; SEPARATOR="${GROUP_SEPARATOR}") AS ?themeLabels)
    (GROUP_CONCAT(DISTINCT ?subthemeIri; SEPARATOR="${GROUP_SEPARATOR}") AS ?subthemeIris)
    (GROUP_CONCAT(DISTINCT ?subthemeLabel; SEPARATOR="${GROUP_SEPARATOR}") AS ?subthemeLabels)
    (GROUP_CONCAT(DISTINCT ?workExample; SEPARATOR="${GROUP_SEPARATOR}") AS ?workExamples)
    (GROUP_CONCAT(DISTINCT ?contactPointName; SEPARATOR="${GROUP_SEPARATOR}") AS ?contactPointNames)
    (GROUP_CONCAT(DISTINCT ?contactPointEmail; SEPARATOR="${GROUP_SEPARATOR}") AS ?contactPointEmails)
    `.WHERE `
    VALUES ?iri { <${iri}> }
    OPTIONAL { ?iri ${ns.dcterms.identifier} ?identifier . }
    ${buildLocalizedSubQuery("iri", "schema:name", "title", {
        locale,
    })}
    ${buildLocalizedSubQuery("iri", "schema:description", "description", {
        locale,
    })}
    OPTIONAL { ?iri ${ns.schema.version} ?version . }
    OPTIONAL { ?iri ${ns.schema.datePublished} ?datePublished . }
    OPTIONAL { ?iri ${ns.schema.dateModified} ?dateModified . }
    ?iri ${ns.schema.creativeWorkStatus} ?status .
    OPTIONAL {
      ?iri ${ns.dcterms.creator} ?creatorIri .
      GRAPH <https://lindas.admin.ch/sfa/opendataswiss> {
        ?creatorIri a ${ns.schema.Organization} ;
          ${ns.schema.inDefinedTermSet} <https://register.ld.admin.ch/opendataswiss/org> .
          ${buildLocalizedSubQuery("creatorIri", "schema:name", "creatorLabel", { locale })}
      }
    }
    OPTIONAL {
      ?iri ${ns.dcat.theme} ?themeIri .
      GRAPH <https://lindas.admin.ch/sfa/opendataswiss> {
        ?themeIri a ${ns.schema.DefinedTerm} ;
        ${ns.schema.inDefinedTermSet} <https://register.ld.admin.ch/opendataswiss/category> .
        ${buildLocalizedSubQuery("themeIri", "schema:name", "themeLabel", {
        locale,
    })}
      }
    }
    OPTIONAL { ?unversionedIri ${ns.schema.hasPart} ?iri . }
    OPTIONAL {
      ?iri ${ns.dcat.contactPoint} ?contactPoint .
      ?contactPoint ${ns.vcard.fn} ?contactPointName .
      ?contactPoint ${ns.vcard.hasEmail} ?contactPointEmail .
    }
    OPTIONAL { ?iri ${ns.dcterms.publisher} ?publisher . }
    ${buildLocalizedSubQuery("iri", "dcat:landingPage", "landingPage", {
        locale,
        fallbackToNonLocalized: true,
    })}
    OPTIONAL { ?iri ${ns.schema.expires} ?expires . }
    OPTIONAL { ?iri ${ns.schema.workExample} ?workExample . }
  `.GROUP().BY `?iri`.THEN.BY `?identifier`.THEN.BY `?title`.THEN.BY `?description`
        .THEN.BY `?version`.THEN.BY `?datePublished`.THEN.BY `?dateModified`.THEN
        .BY `?status`.THEN.BY `?creatorIri`.THEN.BY `?creatorLabel`.THEN
        .BY `?unversionedIri`.THEN.BY `?publisher`.THEN.BY `?landingPage`.THEN
        .BY `?expires`.prologue `${pragmas}`;
    const results = (await query.execute(sparqlClient.query, {
        operation: "postUrlencoded",
    }));
    if (results.length === 0) {
        throw Error(`No cube found for ${iri}!`);
    }
    if (results.length > 1) {
        throw Error(`Multiple cubes found for ${iri}!`);
    }
    const result = results[0];
    return parseRawMetadata(result);
};
