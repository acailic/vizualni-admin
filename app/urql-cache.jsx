import { truthy } from "@/domain/types";
import { client } from "@/graphql/client";
import { joinDimensions } from "@/graphql/join";
import { DataCubeComponentsDocument, } from "@/graphql/query-hooks";
/**
 * Reads components from client cache, reading cube by cube.
 * Components are not joined in cache, but transformed here.
 */
export const getCachedComponents = ({ locale, dataSource, cubeFilters, }) => {
    const queries = cubeFilters
        .map((cubeFilter) => {
        return client.readQuery(DataCubeComponentsDocument, {
            locale,
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            cubeFilter: {
                iri: cubeFilter.iri,
                componentIds: undefined,
                joinBy: cubeFilter.joinBy,
                loadValues: true,
            },
        });
    })
        .filter(truthy);
    const joinBy = Object.fromEntries(cubeFilters
        .map((cubeFilter) => {
        return [cubeFilter.iri, cubeFilter.joinBy];
    })
        .filter(truthy));
    return {
        dimensions: joinDimensions({
            dimensions: queries
                .filter((x) => x.data)
                .map((x) => { var _a, _b; return (_b = (_a = x.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponents) === null || _b === void 0 ? void 0 : _b.dimensions; })
                .flat(),
            joinBy: joinBy,
        }),
        measures: queries.flatMap((q) => { var _a; return (_a = q.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponents.measures; }),
    };
};
