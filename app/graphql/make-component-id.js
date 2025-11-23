import mapKeys from "lodash/mapKeys";
const ID_SEPARATOR = "(VISUALIZE.ADMIN_COMPONENT_ID_SEPARATOR)";
export const isComponentId = (string) => {
    return string.includes(ID_SEPARATOR);
};
export const stringifyComponentId = ({ unversionedCubeIri, unversionedComponentIri, }) => `${unversionedCubeIri}${ID_SEPARATOR}${unversionedComponentIri}`;
export const parseComponentId = (id) => {
    const [unversionedCubeIri, unversionedComponentIri] = id.split(ID_SEPARATOR);
    return {
        unversionedCubeIri,
        unversionedComponentIri: unversionedComponentIri || undefined,
    };
};
export const getFiltersByComponentIris = (filters) => {
    return mapKeys(filters, (_, k) => { var _a; return (_a = parseComponentId(k).unversionedComponentIri) !== null && _a !== void 0 ? _a : k; });
};
