import { locales } from "@/locales/locales";
export const GROUP_SEPARATOR = "|||";
export const iriToNode = (iri) => {
    return `<${iri}>`;
};
export const buildLocalizedSubQuery = (s, p, o, { locale, fallbackToNonLocalized, additionalFallbacks, }) => {
    const locales = getQueryLocales(locale);
    return `${locales
        .map((locale) => `OPTIONAL { ?${s} ${p} ?${o}_${locale} . FILTER(LANG(?${o}_${locale}) = "${locale}") }`)
        .join("\n")}${fallbackToNonLocalized
        ? `\nOPTIONAL {
  ?${s} ${p} ?${o}_raw .
}`
        : ""}
BIND(COALESCE(${locales.map((locale) => `?${o}_${locale}`).join(", ")}${fallbackToNonLocalized ? `, ?${o}_raw` : ``}${additionalFallbacks
        ? ", " + additionalFallbacks.map((d) => `?${d}`).join(", ")
        : ""}) AS ?${o})`;
};
export const getQueryLocales = (locale) => {
    return [locale, ...locales.filter((l) => l !== locale), ""];
};
export const makeVisualizeDatasetFilter = (options) => {
    var _a, _b;
    const cubeIriVar = (_a = options === null || options === void 0 ? void 0 : options.cubeIriVar) !== null && _a !== void 0 ? _a : "?iri";
    const includeDrafts = (_b = options === null || options === void 0 ? void 0 : options.includeDrafts) !== null && _b !== void 0 ? _b : false;
    return `
    ${cubeIriVar} schema:workExample <https://ld.admin.ch/application/visualize> .
    ${includeDrafts
        ? ""
        : `${cubeIriVar} schema:creativeWorkStatus <https://ld.admin.ch/vocabulary/CreativeWorkStatus/Published> .`}
    ${cubeIriVar} cube:observationConstraint ?shape .
    FILTER NOT EXISTS { ${cubeIriVar} schema:expires ?expiryDate }`;
};
