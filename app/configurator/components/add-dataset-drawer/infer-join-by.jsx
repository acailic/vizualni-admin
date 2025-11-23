import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import { isDimensionOfTimeUnit } from "@/domain/data";
import { truthy } from "@/domain/types";
import { mkVersionedJoinBy } from "@/graphql/join";
export const findDimensionForOption = (option, dimensions) => {
    const type = option.type;
    switch (type) {
        case "temporal":
            return dimensions === null || dimensions === void 0 ? void 0 : dimensions.find((d) => isDimensionOfTimeUnit(d, option.timeUnit));
        case "shared":
            return dimensions === null || dimensions === void 0 ? void 0 : dimensions.find((d) => d.termsets.some((t) => option.termsets.map((t) => t.iri).includes(t.iri)));
        default:
            const exhaustiveCheck = type;
            return exhaustiveCheck;
    }
};
export const inferJoinBy = (options, newCube) => {
    const tmp = options.map((option) => {
        const rightDimension = findDimensionForOption(option, newCube === null || newCube === void 0 ? void 0 : newCube.dimensions);
        if (!rightDimension) {
            return {};
        }
        const originalIdsByCube = groupBy(option.originalIds, (x) => {
            return x.cubeIri;
        });
        return {
            ...mapValues(originalIdsByCube, (x) => x.map((x) => x.dimensionId)),
            [newCube.iri]: [rightDimension === null || rightDimension === void 0 ? void 0 : rightDimension.id].filter(truthy),
        };
    });
    const result = tmp.reduce((acc, curr) => {
        Object.entries(curr).forEach(([key, value]) => {
            if (!acc[key]) {
                acc[key] = [];
            }
            if (value) {
                acc[key].push(...value);
            }
        });
        return acc;
    }, {});
    return mkVersionedJoinBy(result);
};
