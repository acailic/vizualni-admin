import { ascending } from "d3-array";
import groupBy from "lodash/groupBy";
import omit from "lodash/omit";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import { isJoinByComponent, } from "@/domain/data";
import { assert } from "@/utils/assert";
const JOIN_BY_CUBE_IRI = "joinBy";
const keyJoiner = "$/$/$/";
const joinByPrefix = `joinBy__`;
export const mkJoinById = (index) => `${joinByPrefix}${index}`;
export const isJoinById = (id) => id.startsWith(joinByPrefix);
export const isJoinByCube = (cubeIri) => cubeIri === JOIN_BY_CUBE_IRI;
const getJoinByIdIndex = (joinById) => {
    return Number(joinById.slice(joinByPrefix.length));
};
export const getOriginalDimension = (dim, cube) => {
    var _a;
    assert(isJoinByComponent(dim), "Dimension should be a join by at this point");
    const originalId = (_a = dim.originalIds.find((o) => o.cubeIri === cube.iri)) === null || _a === void 0 ? void 0 : _a.dimensionId;
    if (!originalId) {
        console.warn("Could not find original id for joinBy dimension", dim, cube.iri);
    }
    assert(!!originalId, "Original id should have been found");
    return {
        ...dim,
        id: originalId,
    };
};
const dimensionValueSorter = (a, b) => {
    var _a, _b, _c, _d;
    return ascending((_b = (_a = a.position) !== null && _a !== void 0 ? _a : a.value) !== null && _b !== void 0 ? _b : undefined, (_d = (_c = b.position) !== null && _c !== void 0 ? _c : b.value) !== null && _d !== void 0 ? _d : undefined);
};
/** Use to exclude joinBy dimensions when fetching dimensions, and create
 * a new joinBy dimension with values from all joinBy dimensions.
 */
export const joinDimensions = (options) => {
    const joinByDimensions = [];
    const dimensions = [];
    const { dimensions: fetchedDimensions, joinBy } = options;
    const dimensionsWithJoinByIndex = fetchedDimensions.flatMap((d) => {
        // Extracts out the joinBy dimensions from the fetched dimensions
        if (isJoinByComponent(d)) {
            const index = getJoinByIdIndex(d.id);
            const label = d.label.split(", ");
            return d.originalIds.map((originalId, i) => ({
                ...omit(d, ["originalIds"]),
                originalIds: [],
                dimensionId: originalId.dimensionId,
                id: originalId.dimensionId,
                label: label[i],
                cubeIri: originalId.cubeIri,
                joinByIndex: index,
                // Not sure why we have to do a type assertion here :-(
            }));
        }
        else {
            const cubeJoinBy = joinBy[d.cubeIri];
            const joinByIndex = cubeJoinBy === null || cubeJoinBy === void 0 ? void 0 : cubeJoinBy.indexOf(d.id);
            return [
                {
                    ...d,
                    joinByIndex: 
                    // Set it directly to undefined if === -1
                    joinByIndex !== undefined && joinByIndex > -1
                        ? joinByIndex
                        : undefined,
                },
            ];
        }
    });
    const { false: queryNormalDimensions = [], true: queryJoinByDimensions = [], } = groupBy(dimensionsWithJoinByIndex, (d) => d.joinByIndex !== undefined);
    joinByDimensions.push(...queryJoinByDimensions);
    dimensions.push(...queryNormalDimensions.map((x) => omit(x, ["joinByIndex"])));
    if (joinByDimensions.length >= 1) {
        for (const [index, joinedDimensions] of Object.entries(groupBy(joinByDimensions, (d) => d.joinByIndex)).reverse()) {
            const joinByDimension = {
                ...omit(joinedDimensions[0], [
                    "joinByIndex",
                    "dimensionId",
                ]),
                values: uniqBy(joinedDimensions
                    .flatMap((d) => { var _a; return (_a = d.values) !== null && _a !== void 0 ? _a : []; })
                    .sort(dimensionValueSorter), (x) => x.value),
                id: mkJoinById(Number(index)),
                // Non-relevant, as we rely on the originalIris property.
                cubeIri: JOIN_BY_CUBE_IRI,
                // FIXME: adapt to design
                label: uniq(joinedDimensions.map((d) => d.label)).join(", "),
                isJoinByDimension: true,
                originalIds: joinedDimensions.map((d) => {
                    var _a;
                    return ({
                        cubeIri: d.cubeIri,
                        dimensionId: d.id,
                        label: d.label,
                        description: (_a = d.description) !== null && _a !== void 0 ? _a : "",
                    });
                }),
            };
            dimensions.unshift(joinByDimension);
        }
    }
    return dimensions;
};
export const getOriginalIds = (joinById, chartConfig) => {
    const index = getJoinByIdIndex(joinById);
    return chartConfig.cubes.map((cube) => {
        const joinBy = cube.joinBy;
        assert(joinBy !== undefined, "Found joinBy id and cube has no join by");
        return joinBy[index];
    });
};
export const getResolvedJoinById = (cube, joinById) => {
    if (!cube.joinBy) {
        return;
    }
    const index = getJoinByIdIndex(joinById);
    return cube.joinBy[index];
};
/**
 * Use to merge observations coming from several DataCubesObservationQueries.
 *
 * Observations are merged by the value of the `joinBy` property of the cube filter.
 * The function does an outerJoin (returns all observations from all queries),
 * so if there are observations from different cubes with the same joinBy value,
 * they will be merged into one.
 */
export const mergeObservations = (queries) => {
    const merged = queries.reduce((acc, q) => {
        var _a, _b;
        const joinBy = (_a = q.operation.variables) === null || _a === void 0 ? void 0 : _a.cubeFilter.joinBy;
        const obs = (_b = q.data) === null || _b === void 0 ? void 0 : _b.dataCubeObservations.data;
        if (!obs || !joinBy) {
            return acc;
        }
        for (const o of obs) {
            // Remove joinBy dimensions from the observation, to use explicit joinBy as key
            const om = omit(o, joinBy);
            const key = joinBy
                .map((x) => o[x])
                .join(keyJoiner);
            if (!key) {
                continue;
            }
            for (let i = 0; i < joinBy.length; i++) {
                if (o[joinBy[i]] !== undefined) {
                    om[mkJoinById(i)] = o[joinBy[i]];
                }
            }
            const existing = acc[key];
            acc[key] = Object.assign(existing !== null && existing !== void 0 ? existing : {}, om);
        }
        return acc;
    }, {});
    // Extract observations from the merged object indexed by joinBy value
    return Object.values(merged);
};
/** Type only helpers to make handling of joinby typesafe */
export const mkVersionedJoinBy = (joinBy) => joinBy;
export const getCubeFiltersFromVersionedJoinBy = (joinBy) => {
    // We need to do the BaseOf otherwise Object.entries wrongly things
    // branded properties are really there
    return Object.entries(joinBy).map(([cubeIri, joinBy]) => ({
        iri: cubeIri,
        joinBy,
    }));
};
