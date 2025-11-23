import ParsingClient from "sparql-http-client/ParsingClient";
import { hasChartConfigs } from "@/configurator";
import { getMaybeCachedSparqlUrl } from "@/graphql/caching-utils";
import { DataCubeLatestIriDocument, DataCubeUnversionedIriDocument, } from "@/graphql/query-hooks";
import { queryCubeUnversionedIri } from "@/rdf/query-cube-unversioned-iri";
import { queryLatestCubeIri } from "@/rdf/query-latest-cube-iri";
const makeUpgradeConfiguratorState = ({ cubeIriUpdateFn, }) => async (state, options) => {
    if (!hasChartConfigs(state)) {
        return state;
    }
    return {
        ...state,
        chartConfigs: await Promise.all(state.chartConfigs.map(async (chartConfig) => ({
            ...chartConfig,
            cubes: await Promise.all(chartConfig.cubes.map(async (cube) => ({
                ...cube,
                iri: await cubeIriUpdateFn(cube.iri, options),
            }))),
        }))),
    };
};
export const getLatestCubeIri = async (iri, options) => {
    var _a;
    const { client, dataSource } = options;
    const { data } = await client
        .query(DataCubeLatestIriDocument, {
        sourceUrl: dataSource.url,
        sourceType: dataSource.type,
        cubeFilter: { iri },
    })
        .toPromise();
    return (_a = data === null || data === void 0 ? void 0 : data.dataCubeLatestIri) !== null && _a !== void 0 ? _a : iri;
};
export const getUnversionedCubeIri = async (iri, options) => {
    var _a;
    const { client, dataSource } = options;
    const { data } = await client
        .query(DataCubeUnversionedIriDocument, {
        sourceUrl: dataSource.url,
        sourceType: dataSource.type,
        cubeFilter: { iri },
    })
        .toPromise();
    return (_a = data === null || data === void 0 ? void 0 : data.dataCubeUnversionedIri) !== null && _a !== void 0 ? _a : iri;
};
export const upgradeConfiguratorState = makeUpgradeConfiguratorState({
    cubeIriUpdateFn: getLatestCubeIri,
});
const getLatestCubeIriServerSide = async (iri, options) => {
    var _a;
    const { dataSource } = options;
    const client = new ParsingClient({
        endpointUrl: getMaybeCachedSparqlUrl({
            endpointUrl: dataSource.url,
            cubeIri: iri,
        }),
    });
    return (_a = (await queryLatestCubeIri(client, iri))) !== null && _a !== void 0 ? _a : iri;
};
export const getUnversionedCubeIriServerSide = async (cubeIri, options) => {
    const { dataSource } = options;
    const client = new ParsingClient({
        endpointUrl: getMaybeCachedSparqlUrl({
            endpointUrl: dataSource.url,
            cubeIri,
        }),
    });
    const iri = await queryCubeUnversionedIri(client, cubeIri);
    return iri !== null && iri !== void 0 ? iri : cubeIri;
};
export const upgradeConfiguratorStateServerSide = makeUpgradeConfiguratorState({
    cubeIriUpdateFn: getLatestCubeIriServerSide,
});
