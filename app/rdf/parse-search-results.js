import { group } from "d3-array";
import { stringifyComponentId } from "@/graphql/make-component-id";
import { DataCubePublicationStatus } from "@/graphql/resolver-types";
import * as ns from "@/rdf/namespace";
import { GROUP_SEPARATOR } from "@/rdf/query-utils";
const visualizePredicates = {
    hasDimension: ns.visualizeAdmin `hasDimension`.value,
    hasTermset: ns.visualizeAdmin `hasTermset`.value,
    hasTimeUnit: ns.visualizeAdmin `hasTimeUnit`.value,
    hasThemeIris: ns.visualizeAdmin `hasThemeIris`.value,
    hasThemeLabels: ns.visualizeAdmin `hasThemeLabels`.value,
};
function buildSearchCubes(quads) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const byPredicateAndObject = group(quads, (x) => x.predicate.value, (x) => x.object.value);
    const bySubjectAndPredicate = group(quads, (x) => x.subject.value, (x) => x.predicate.value);
    const iriList = (_c = (_b = (_a = byPredicateAndObject
        .get("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")) === null || _a === void 0 ? void 0 : _a.get("https://cube.link/Cube")) === null || _b === void 0 ? void 0 : _b.map((x) => x.subject.value)) !== null && _c !== void 0 ? _c : [];
    const searchCubes = [];
    for (const iri of iriList) {
        const cubeQuads = bySubjectAndPredicate.get(iri);
        if (cubeQuads) {
            const unversionedIri = (_e = (_d = cubeQuads.get(ns.schema.hasPart.value)) === null || _d === void 0 ? void 0 : _d[0].object.value) !== null && _e !== void 0 ? _e : iri;
            const themeQuads = (_f = cubeQuads.get(visualizePredicates.hasThemeIris)) === null || _f === void 0 ? void 0 : _f[0];
            const themeIris = themeQuads === null || themeQuads === void 0 ? void 0 : themeQuads.object.value.split(GROUP_SEPARATOR);
            const themeLabelQuads = (_g = cubeQuads.get(visualizePredicates.hasThemeLabels)) === null || _g === void 0 ? void 0 : _g[0];
            const themeLabels = themeLabelQuads === null || themeLabelQuads === void 0 ? void 0 : themeLabelQuads.object.value.split(GROUP_SEPARATOR);
            const subthemesQuads = cubeQuads.get(ns.schema.about.value);
            const dimensions = cubeQuads.get(visualizePredicates.hasDimension);
            const creatorIri = (_j = (_h = cubeQuads.get(ns.schema.creator.value)) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.object.value;
            const publicationStatus = (_k = cubeQuads.get(ns.schema.creativeWorkStatus.value)) === null || _k === void 0 ? void 0 : _k[0].object.value;
            const termsetQuads = (_l = byPredicateAndObject
                .get("https://cube.link/meta/isUsedIn")) === null || _l === void 0 ? void 0 : _l.get(iri);
            const cubeSearchCube = {
                iri,
                unversionedIri,
                title: (_o = (_m = cubeQuads.get(ns.schema.name.value)) === null || _m === void 0 ? void 0 : _m[0].object.value) !== null && _o !== void 0 ? _o : "",
                description: (_q = (_p = cubeQuads.get(ns.schema.description.value)) === null || _p === void 0 ? void 0 : _p[0].object.value) !== null && _q !== void 0 ? _q : null,
                publicationStatus: publicationStatus ===
                    ns.adminVocabulary("CreativeWorkStatus/Published").value
                    ? DataCubePublicationStatus.Published
                    : DataCubePublicationStatus.Draft,
                datePublished: (_s = (_r = cubeQuads.get(ns.schema.datePublished.value)) === null || _r === void 0 ? void 0 : _r[0].object.value) !== null && _s !== void 0 ? _s : null,
                creator: creatorIri
                    ? {
                        iri: creatorIri,
                        label: (_v = (_u = (_t = bySubjectAndPredicate
                            .get(creatorIri)) === null || _t === void 0 ? void 0 : _t.get(ns.schema.name.value)) === null || _u === void 0 ? void 0 : _u[0].object.value) !== null && _v !== void 0 ? _v : "",
                    }
                    : null,
                themes: (_w = themeIris === null || themeIris === void 0 ? void 0 : themeIris.map((iri, i) => {
                    var _a;
                    return {
                        iri,
                        label: (_a = themeLabels === null || themeLabels === void 0 ? void 0 : themeLabels[i]) !== null && _a !== void 0 ? _a : "",
                    };
                })) !== null && _w !== void 0 ? _w : [],
                subthemes: (_x = subthemesQuads === null || subthemesQuads === void 0 ? void 0 : subthemesQuads.map((x) => {
                    var _a, _b, _c;
                    return {
                        iri: x.object.value,
                        label: (_c = (_b = (_a = bySubjectAndPredicate
                            .get(x.object.value)) === null || _a === void 0 ? void 0 : _a.get(ns.schema.name.value)) === null || _b === void 0 ? void 0 : _b[0].object.value) !== null && _c !== void 0 ? _c : "",
                    };
                })) !== null && _x !== void 0 ? _x : [],
                termsets: (_y = termsetQuads === null || termsetQuads === void 0 ? void 0 : termsetQuads.map((x) => {
                    var _a, _b, _c;
                    return {
                        iri: x.subject.value,
                        label: (_c = (_b = (_a = bySubjectAndPredicate
                            .get(x.subject.value)) === null || _a === void 0 ? void 0 : _a.get(ns.schema.name.value)) === null || _b === void 0 ? void 0 : _b[0].object.value) !== null && _c !== void 0 ? _c : "",
                    };
                })) !== null && _y !== void 0 ? _y : [],
                dimensions: dimensions === null || dimensions === void 0 ? void 0 : dimensions.map((x) => {
                    var _a, _b, _c, _d, _e, _f;
                    const dim = bySubjectAndPredicate.get(x.object.value);
                    return {
                        id: stringifyComponentId({
                            unversionedCubeIri: unversionedIri,
                            unversionedComponentIri: x.object.value,
                        }),
                        label: (_b = (_a = dim === null || dim === void 0 ? void 0 : dim.get(ns.schema.name.value)) === null || _a === void 0 ? void 0 : _a[0].object.value) !== null && _b !== void 0 ? _b : "",
                        timeUnit: (_d = (_c = dim === null || dim === void 0 ? void 0 : dim.get(visualizePredicates.hasTimeUnit)) === null || _c === void 0 ? void 0 : _c[0].object.value) !== null && _d !== void 0 ? _d : "",
                        termsets: (_f = (_e = dim === null || dim === void 0 ? void 0 : dim.get(visualizePredicates.hasTermset)) === null || _e === void 0 ? void 0 : _e.map((x) => {
                            var _a, _b, _c;
                            return {
                                iri: x.object.value,
                                label: (_c = (_b = (_a = bySubjectAndPredicate
                                    .get(x.object.value)) === null || _a === void 0 ? void 0 : _a.get(ns.schema.name.value)) === null || _b === void 0 ? void 0 : _b[0].object.value) !== null && _c !== void 0 ? _c : "",
                            };
                        })) !== null && _f !== void 0 ? _f : [],
                    };
                }),
            };
            searchCubes.push(cubeSearchCube);
        }
    }
    return searchCubes;
}
export { buildSearchCubes };
