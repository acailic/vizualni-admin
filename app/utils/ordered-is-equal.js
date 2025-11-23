import isEqual from "lodash/isEqual";
export const orderedIsEqual = (obj1, obj2) => {
    return isEqual(Object.keys(obj1), Object.keys(obj2)) && isEqual(obj1, obj2);
};
