import { t } from "@lingui/macro";
import groupBy from "lodash/groupBy";
import { isJoinByCube } from "@/graphql/join";
export const makeGetFieldOptionGroups = ({ cubesMetadata }) => ({ fieldComponents, getOption, }) => {
    const fieldComponentsByCubeIri = groupBy(fieldComponents, (d) => d.cubeIri);
    return Object.entries(fieldComponentsByCubeIri).map(([cubeIri, dims]) => {
        var _a;
        return [
            {
                label: isJoinByCube(cubeIri)
                    ? t({ id: "dimension.joined" })
                    : (_a = cubesMetadata.find((d) => d.iri === cubeIri)) === null || _a === void 0 ? void 0 : _a.title,
                value: cubeIri,
            },
            dims.map(getOption),
        ];
    });
};
