import { groups } from "d3-array";
import { bfs } from "@/utils/bfs";
export const groupByParents = (hierarchy) => {
    const allHierarchyValues = bfs(hierarchy, (node, { depth, parents }) => ({
        node,
        parents,
        depth,
    }));
    return groups(allHierarchyValues, (v) => v.parents);
};
/**
 * Can be used for debugging, pass a hierarchy, and copy the output
 * to graphviz.
 *
 * @see https://dreampuf.github.io/GraphvizOnline/
 * @internal
 */
export const hierarchyToGraphviz = (hierarchy) => {
    const lines = [];
    bfs(hierarchy, (node, { parents }) => {
        lines.push(`"${node.value}"[label="${node.label.replace(/"/g, "")}"]`);
        if (parents.length > 0) {
            const parent = parents[parents.length - 1];
            lines.push(`"${parent.value}" -> "${node.value}"`);
        }
    });
    return `
    digraph G {
      rankdir=LR

      ${lines.join("\n")}
    }
  `;
};
