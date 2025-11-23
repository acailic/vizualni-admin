import { describe, expect, it } from "vitest";
import { findInHierarchy, mapTree, pruneTree, regroupTrees, } from "@/rdf/tree-utils";
import multipleRootHierarchy from "@/test/__fixtures/data/multiple-root-hierarchy.json";
// Country > Canton > Municipality
// Countries have no value
const tree = [
    {
        value: "Switzerland",
        hasValue: false,
        children: [
            {
                value: "Zürich",
                hasValue: true,
                children: [
                    { hasValue: true, value: "Thalwil" },
                    { hasValue: true, value: "Kilchberg" },
                ],
            },
            {
                hasValue: true,
                value: "Bern",
                children: [
                    { hasValue: true, value: "Bern City" },
                    { hasValue: true, value: "Langnau" },
                ],
            },
        ],
    },
    {
        value: "France",
        hasValue: false,
    },
];
describe("mapTree", () => {
    it("should map the function across all nodes of the tree", () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const reverseStr = (s) => s.split("").reverse().join("");
        const mappedTree = mapTree(tree, (x) => ({
            ...x,
            value: reverseStr(x.value),
        }));
        expect(mappedTree[0].value).toBe(reverseStr("Switzerland"));
        expect((_c = (_b = (_a = mappedTree[0]) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value).toBe(reverseStr("Zürich"));
        expect((_g = (_f = (_e = (_d = mappedTree[0]) === null || _d === void 0 ? void 0 : _d.children) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.children) === null || _g === void 0 ? void 0 : _g[0].value).toBe(reverseStr("Thalwil"));
    });
});
describe("filterTree", () => {
    it("should remove any node not containing any of the passed leafs", () => {
        const whitelist = new Set(["Thalwil", "Bern"]);
        const res = pruneTree(tree, (n) => whitelist.has(n.value));
        expect(res).toEqual([
            {
                value: "Switzerland",
                hasValue: false,
                children: [
                    {
                        value: "Zürich",
                        hasValue: true,
                        children: [
                            {
                                value: "Thalwil",
                                hasValue: true,
                            },
                        ],
                    },
                    {
                        value: "Bern",
                        hasValue: true,
                        children: [],
                    },
                ],
            },
        ]);
    });
});
describe("multiple hierarchy handling", () => {
    it("should regroup trees", () => {
        var _a;
        const tree = regroupTrees(multipleRootHierarchy);
        expect((_a = tree[0].children) === null || _a === void 0 ? void 0 : _a.map((x) => x.value)).toEqual([
            "Switzerland - Canton",
            "Switzerland - Protection Region - Economic Region",
            "Switzerland - Production Region - Economic Region",
        ]);
    });
    it("should select values starting from beginning of the tree", () => {
        const expectedValue = {
            depth: 0,
            dimensionId: "A",
            value: "A",
            hasValue: true,
            label: "A",
        };
        const tree = [
            expectedValue,
            {
                depth: 0,
                dimensionId: "B",
                value: "B",
                hasValue: true,
                label: "B",
            },
            {
                depth: 0,
                dimensionId: "C",
                value: "C",
                hasValue: true,
                label: "C",
            },
        ];
        const value = findInHierarchy(tree, (d) => d.hasValue);
        expect(value).toEqual(expectedValue);
    });
});
