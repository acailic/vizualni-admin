/**
 * We need to access the map from the map controls. Until we have a good solution
 * for sibling components, we use a global non-observable ref.
 */
let map = null;
const getMap = () => {
    return map;
};
const setMap = (d) => {
    map = d;
};
export { getMap, setMap };
