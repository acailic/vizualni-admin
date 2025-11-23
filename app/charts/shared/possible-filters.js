import isEmpty from "lodash/isEmpty";
import { orderedIsEqual } from "@/utils/ordered-is-equal";
/** Used to make urql re-query when order of filters changes. */
const getPossibleFiltersQueryKey = (unmappedFilters) => {
    return Object.keys(unmappedFilters).join(", ");
};
export const getPossibleFiltersQueryVariables = (props) => {
    const { cubeIri, dataSource, unmappedFilters } = props;
    const filterKey = getPossibleFiltersQueryKey(unmappedFilters);
    return {
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
        cubeFilter: {
            iri: cubeIri,
            filters: unmappedFilters,
        },
        // @ts-ignore
        filterKey,
    };
};
export const skipPossibleFiltersQuery = (oldFilters, newFilters) => {
    return ((oldFilters && orderedIsEqual(oldFilters, newFilters)) ||
        isEmpty(newFilters));
};
