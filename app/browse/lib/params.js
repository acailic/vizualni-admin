import mapValues from "lodash/mapValues";
import pick from "lodash/pick";
import pickBy from "lodash/pickBy";
import { truthy } from "@/domain/types";
const params = [
    "type",
    "iri",
    "subtype",
    "subiri",
    "subsubtype",
    "subsubiri",
    "topic",
    "includeDrafts",
    "order",
    "search",
    "dataset",
    "previous",
];
export const getBrowseParamsFromQuery = (query) => {
    const { type, iri, subtype, subiri, subsubtype, subsubiri, topic, includeDrafts, ...values } = mapValues(pick(query, params), (v) => (Array.isArray(v) ? v[0] : v));
    const previous = values.previous
        ? JSON.parse(values.previous)
        : undefined;
    return pickBy({
        ...values,
        type: type !== null && type !== void 0 ? type : previous === null || previous === void 0 ? void 0 : previous.type,
        iri: iri !== null && iri !== void 0 ? iri : previous === null || previous === void 0 ? void 0 : previous.iri,
        subtype: subtype !== null && subtype !== void 0 ? subtype : previous === null || previous === void 0 ? void 0 : previous.subtype,
        subiri: subiri !== null && subiri !== void 0 ? subiri : previous === null || previous === void 0 ? void 0 : previous.subiri,
        subsubtype: subsubtype !== null && subsubtype !== void 0 ? subsubtype : previous === null || previous === void 0 ? void 0 : previous.subsubtype,
        subsubiri: subsubiri !== null && subsubiri !== void 0 ? subsubiri : previous === null || previous === void 0 ? void 0 : previous.subsubiri,
        topic: topic !== null && topic !== void 0 ? topic : previous === null || previous === void 0 ? void 0 : previous.topic,
        includeDrafts: includeDrafts !== null && includeDrafts !== void 0 ? includeDrafts : previous === null || previous === void 0 ? void 0 : previous.includeDrafts,
    }, (d) => d !== undefined);
};
export const buildURLFromBrowseParams = ({ type, iri, subtype, subiri, subsubtype, subsubiri, ...query }) => {
    const typePart = buildQueryPart(type, iri);
    const subtypePart = buildQueryPart(subtype, subiri);
    const subsubtypePart = buildQueryPart(subsubtype, subsubiri);
    const pathname = ["/browse", typePart, subtypePart, subsubtypePart]
        .filter(truthy)
        .join("/");
    return { pathname, query };
};
const buildQueryPart = (type, iri) => {
    if (!type || !iri) {
        return undefined;
    }
    return `${encodeURIComponent(type)}/${encodeURIComponent(iri)}`;
};
export const extractParamFromPath = (path, param) => {
    return path.match(new RegExp(`[&?]${param}=(.*?)(&|$)`));
};
export const isOdsIframe = (query) => {
    return query["odsiframe"] === "true";
};
