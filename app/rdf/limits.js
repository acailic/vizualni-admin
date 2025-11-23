import { truthy } from "@/domain/types";
import { stringifyComponentId } from "@/graphql/make-component-id";
import * as ns from "@/rdf/namespace";
import { buildLocalizedSubQuery } from "@/rdf/query-utils";
export const getDimensionLimits = async (dim, { locale, unversionedCubeIri, sparqlClient, }) => {
    const baseLimits = dim
        .out(ns.cubeMeta.annotation)
        .map((a, index) => {
        var _a;
        const name = (_a = a.out(ns.schema.name, { language: locale }).value) !== null && _a !== void 0 ? _a : "";
        const ctxs = a.out(ns.cubeMeta.annotationContext);
        let isTimeRange = false;
        const related = ctxs
            .map((ctx) => {
            var _a, _b, _c;
            const dimensionIri = ctx.out(ns.sh.path).value;
            if (!dimensionIri) {
                return null;
            }
            const dimensionId = stringifyComponentId({
                unversionedCubeIri,
                unversionedComponentIri: dimensionIri,
            });
            const valuePtr = ctx.out(ns.sh.hasValue);
            const value = valuePtr.value;
            if (!!value) {
                return [
                    {
                        type: "single",
                        dimensionIri,
                        dimensionId,
                        value,
                        isNamedNode: ((_a = valuePtr.term) === null || _a === void 0 ? void 0 : _a.termType) === "NamedNode",
                    },
                ];
            }
            const minInclusivePtr = ctx.out(ns.sh.minInclusive);
            const maxInclusivePtr = ctx.out(ns.sh.maxInclusive);
            const minInclusive = minInclusivePtr.value;
            const maxInclusive = maxInclusivePtr.value;
            isTimeRange = !!minInclusive && !!maxInclusive;
            if (isTimeRange) {
                return [
                    {
                        type: "time-from",
                        dimensionIri,
                        dimensionId,
                        value: minInclusive,
                        isNamedNode: ((_b = minInclusivePtr.term) === null || _b === void 0 ? void 0 : _b.termType) === "NamedNode",
                    },
                    {
                        type: "time-to",
                        dimensionIri,
                        dimensionId,
                        value: maxInclusive,
                        isNamedNode: ((_c = maxInclusivePtr.term) === null || _c === void 0 ? void 0 : _c.termType) === "NamedNode",
                    },
                ];
            }
        })
            .filter(truthy)
            .flat();
        const value = a.out(ns.schema.value).value;
        if (value) {
            const type = isTimeRange
                ? "time-range"
                : "single";
            return {
                index,
                related,
                limit: {
                    type,
                    name,
                    value: +value,
                },
            };
        }
        const minValue = a.out(ns.schema.minValue).value;
        const maxValue = a.out(ns.schema.maxValue).value;
        if (minValue && maxValue) {
            return {
                index,
                related,
                limit: {
                    type: "value-range",
                    name,
                    min: +minValue,
                    max: +maxValue,
                },
            };
        }
    })
        .filter(truthy)
        .sort((a, b) => a.limit.name.localeCompare(b.limit.name));
    const allBaseRelated = baseLimits.flatMap((l) => l.related.map((r) => ({ ...r, index: l.index })));
    const baseRelatedNamedNodes = allBaseRelated.filter((r) => r.isNamedNode);
    const baseRelatedLiterals = allBaseRelated.filter((r) => !r.isNamedNode);
    let allRelated = [];
    if (baseRelatedNamedNodes.length > 0) {
        const allRelatedQuery = `PREFIX schema: <http://schema.org/>

    SELECT ?index ?type ?dimensionIri ?value ?label ?position WHERE {
      VALUES (?index ?type ?dimensionIri ?value) { ${baseLimits
            .flatMap((l) => l.related.map((r) => ({ ...r, index: l.index })))
            .map((r) => `(${r.index} "${r.type}" <${r.dimensionIri}> <${r.value}>)`)
            .join(" ")} }
        ${buildLocalizedSubQuery("value", "schema:name", "label", {
            locale,
        })}
        OPTIONAL { ?value schema:position ?position . }
    }`;
        const relatedNamedNodes = (await sparqlClient.query.select(allRelatedQuery, {
            operation: "postUrlencoded",
        })).map((d) => {
            var _a, _b;
            const index = +d.index.value;
            const type = d.type.value;
            const dimensionIri = d.dimensionIri.value;
            const value = d.value.value;
            const label = (_a = d.label) === null || _a === void 0 ? void 0 : _a.value;
            const position = (_b = d.position) === null || _b === void 0 ? void 0 : _b.value;
            return {
                index,
                type,
                dimensionId: stringifyComponentId({
                    unversionedCubeIri,
                    unversionedComponentIri: dimensionIri,
                }),
                value,
                label,
                position,
            };
        });
        allRelated = allRelated.concat(relatedNamedNodes);
    }
    if (baseRelatedLiterals.length > 0) {
        const relatedLiterals = baseRelatedLiterals.map(({ type, value = "", dimensionIri, isNamedNode, ...rest }) => {
            return {
                ...rest,
                type: type,
                value: value,
                label: value,
            };
        });
        allRelated = allRelated.concat(relatedLiterals);
    }
    return baseLimits.map(({ index, limit }) => {
        return {
            ...limit,
            related: allRelated.filter((r) => r.index === index),
        };
    });
};
