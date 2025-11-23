import { getHierarchy, } from "@zazuko/cube-hierarchy-query/index";
import orderBy from "lodash/orderBy";
import uniqBy from "lodash/uniqBy";
import rdf from "rdf-ext";
import { parseTerm } from "@/domain/data";
import { truthy } from "@/domain/types";
import * as ns from "@/rdf/namespace";
import { getOptionsFromTree, mapTree, pruneTree, regroupTrees, sortHierarchy, } from "@/rdf/tree-utils";
const getName = (pointer, language) => {
    var _a, _b;
    const name = (_a = pointer.out(ns.schema.name, { language })) === null || _a === void 0 ? void 0 : _a.value;
    if (name) {
        return name;
    }
    return (_b = pointer.out(ns.schema.name)) === null || _b === void 0 ? void 0 : _b.value;
};
const toTree = (results, dimensionId, locale, hasValue) => {
    const sortChildren = (children) => orderBy(children, ["position", "identifier"]);
    const serializeNode = (node, depth) => {
        var _a, _b, _c;
        const name = getName(node.resource, locale);
        // TODO Find out why some hierarchy nodes have no label. We filter
        // them out at the moment
        // @see https://zulip.zazuko.com/#narrow/stream/40-bafu-ext/topic/labels.20for.20each.20hierarchy.20level/near/312845
        const identifier = parseTerm((_a = node.resource.out(ns.schema.identifier)) === null || _a === void 0 ? void 0 : _a.term);
        const value = node.resource.value;
        const res = name
            ? {
                label: name || "-",
                alternateName: (_b = node.resource.out(ns.schema.alternateName).term) === null || _b === void 0 ? void 0 : _b.value,
                value,
                children: sortChildren(node.nextInHierarchy
                    .map((childNode) => serializeNode(childNode, depth + 1))
                    .filter(truthy)
                    .filter((d) => d.label)),
                position: (_c = parseTerm(node.resource.out(ns.schema.position).term)) !== null && _c !== void 0 ? _c : 0,
                identifier,
                depth,
                dimensionId,
                hasValue: hasValue(value),
            }
            : undefined;
        return res;
    };
    return sortChildren(results.map((r) => serializeNode(r, 0)).filter(truthy));
};
const getDimensionHierarchies = async (cube, dimensionIri, locale) => {
    var _a;
    const cubeIri = (_a = cube.term) === null || _a === void 0 ? void 0 : _a.value;
    if (!cubeIri) {
        throw Error("Cube must have an iri!");
    }
    // Can't rely on the cube here, because sometimes it might contain duplicate
    // hierarchies, due to fetching both cube and shape when cube is initialized.
    // Here we are only interested in shape hierarchies, that's why we don't have
    // to initialize the cube, but rather just fetch its shape.
    const hierarchies = cube.shapePtr
        .any()
        .has(ns.sh.path, rdf.namedNode(dimensionIri))
        .has(ns.cubeMeta.inHierarchy)
        .out(ns.cubeMeta.inHierarchy)
        .toArray();
    return uniqBy(hierarchies, (hierarchy) => getName(hierarchy, locale));
};
export const queryHierarchies = async (resolvedDimension, options) => {
    const { cube, data: { iri }, } = resolvedDimension;
    const { locale, sparqlClientStream } = options;
    const pointers = await getDimensionHierarchies(cube, iri, locale);
    if (pointers.length === 0) {
        return null;
    }
    return await Promise.all(pointers.map(async (ptr) => {
        return {
            nodes: await getHierarchy(ptr, {
                properties: [
                    ns.schema.identifier,
                    ns.schema.name,
                    ns.schema.description,
                    ns.schema.position,
                    ns.schema.alternateName,
                ],
                // @ts-ignore
            }).execute(sparqlClientStream, rdf),
            hierarchyName: getName(ptr, locale),
        };
    }));
};
export const parseHierarchy = (hierarchies, options) => {
    const { dimensionId, locale, dimensionValues } = options;
    const rawValues = new Set(dimensionValues.map((d) => `${d.value}`));
    const trees = hierarchies.map(({ nodes, hierarchyName }) => {
        const tree = toTree(nodes, dimensionId, locale, (d) => rawValues.has(d));
        if (tree.length > 0) {
            // Augment hierarchy value with hierarchyName so that when regrouping
            // below, we can create the fake nodes
            tree[0].hierarchyName = hierarchyName;
        }
        return tree;
    });
    const tree = regroupTrees(trees);
    const treeValues = new Set(getOptionsFromTree(tree).map((d) => d.value));
    const prunedTree = mapTree(pruneTree(tree, (node) => rawValues.has(node.value)), (node) => ({ ...node, hasValue: rawValues.has(node.value) }));
    const additionalTreeValues = dimensionValues
        .filter((d) => !treeValues.has(`${d.value}`))
        .map((d) => ({
        label: d.label || "ADDITIONAL",
        value: `${d.value}`,
        depth: 0,
        dimensionId,
        hasValue: true,
        position: 9999,
        identifier: "",
        children: [],
    }));
    return sortHierarchy([...prunedTree, ...additionalTreeValues]);
};
