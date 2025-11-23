import { ascending } from "d3-array";
export const sortComboData = (data, { getX }) => {
    return [...data].sort((a, b) => {
        return ascending(getX(a), getX(b));
    });
};
