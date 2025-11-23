import { isJoinById } from "@/graphql/join";
export const groupPreparedFiltersByDimension = (preparedFilters, componentIds) => {
    var _a, _b;
    const groups = {};
    for (const preparedFilter of preparedFilters) {
        for (const id of componentIds) {
            const resolved = preparedFilter.componentIdResolution[id];
            if (isJoinById(id)) {
                if (!resolved) {
                    continue;
                }
                groups[id] = (_a = groups[id]) !== null && _a !== void 0 ? _a : [];
                groups[id].push({
                    cubeIri: preparedFilter.cubeIri,
                    resolvedDimensionId: resolved,
                    interactiveFilters: preparedFilter.interactiveFilters,
                    componentIdResolution: preparedFilter.componentIdResolution,
                });
            }
            else {
                if (resolved === id) {
                    groups[id] = (_b = groups[id]) !== null && _b !== void 0 ? _b : [];
                    groups[id].push({
                        cubeIri: preparedFilter.cubeIri,
                        resolvedDimensionId: id,
                        interactiveFilters: preparedFilter.interactiveFilters,
                        componentIdResolution: preparedFilter.componentIdResolution,
                    });
                }
            }
        }
    }
    return Object.entries(groups).map(([dimensionId, entries]) => ({
        dimensionId,
        entries,
    }));
};
