export const sortByIndex = ({ data, order, getCategory, sortingOrder, }) => {
    data.sort((a, b) => {
        const A = getCategory(a);
        const B = getCategory(b);
        if (order.indexOf(A) > order.indexOf(B)) {
            return sortingOrder === "asc" ? 1 : -1;
        }
        else {
            return sortingOrder === "asc" ? -1 : 1;
        }
    });
    return data;
};
