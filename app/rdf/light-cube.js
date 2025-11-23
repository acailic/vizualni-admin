import { getCubeMetadata } from "@/rdf/query-cube-metadata";
import { getCubePreview } from "@/rdf/query-cube-preview";
import { getCubeComponentTermsets } from "@/rdf/query-termsets";
/** `LightCube` is a specialized data fetching class containing methods
 * for fetching _just enough_ data related to different aspects of a cube.
 */
export class LightCube {
    constructor(options) {
        const { iri, unversionedIri, locale, sparqlClient } = options;
        this.iri = iri;
        this.unversionedIri = unversionedIri;
        this.locale = locale;
        this.sparqlClient = sparqlClient;
    }
    async fetchMetadata() {
        this.metadata = await getCubeMetadata(this.iri, {
            locale: this.locale,
            sparqlClient: this.sparqlClient,
        });
        return this.metadata;
    }
    async fetchComponentTermsets() {
        return await getCubeComponentTermsets(this.iri, {
            locale: this.locale,
            sparqlClient: this.sparqlClient,
        });
    }
    async fetchPreview() {
        this.preview = await getCubePreview(this.iri, {
            unversionedIri: this.unversionedIri,
            locale: this.locale,
            sparqlClient: this.sparqlClient,
        });
        return this.preview;
    }
}
