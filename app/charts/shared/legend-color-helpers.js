import { ascending } from "d3-array";
export const getLegendGroups = ({ title, values, sort, }) => {
    const groupsMap = new Map();
    groupsMap.set(title ? [{ label: title }] : [], values);
    const groups = Array.from(groupsMap.entries());
    if (sort) {
        // Re-sort hierarchy groups against the label order that we have received
        const valueOrder = Object.fromEntries(values.map((x, i) => [x, i]));
        groups.forEach(([_, entries]) => {
            entries.sort((a, b) => ascending(valueOrder[a], valueOrder[b]));
        });
    }
    return groups;
};
