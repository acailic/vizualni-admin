import { getEnabledChartTypes, getInitialConfig } from "@/charts";
import { getPossibleFiltersQueryVariables } from "@/charts/shared/possible-filters";
import { decodeConfiguratorState, } from "@/config-types";
import { SELECTING_DATASET_STATE } from "@/configurator/configurator-state/initial";
import { executeDataCubesComponentsQuery } from "@/graphql/hooks";
import { DataCubePreviewDocument, PossibleFiltersDocument, } from "@/graphql/query-hooks";
import { fetchChartConfig } from "@/utils/chart-config/api";
import { getLatestCubeIri, upgradeConfiguratorState, } from "@/utils/chart-config/upgrade-cube";
import { migrateConfiguratorState } from "@/utils/chart-config/versioning";
import { getLocalStorageKey } from "./local-storage";
import { deriveFiltersFromFields, transitionStepNext } from "./reducer";
import { getFiltersByMappingStatus, getStateWithCurrentDataSource, } from "./index";
export const initChartStateFromCube = async (client, cubeIri, dataSource, locale) => {
    var _a, _b;
    const latestCubeIri = await // Technically we already have most recent iri assured by useRedirectToLatestCube, but
     
    // just to be extra sure, we fetch it again here.
    getLatestCubeIri(cubeIri, {
        client,
        dataSource,
    });
    const { data: dataCubePreview } = await client
        .query(DataCubePreviewDocument, {
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
        locale,
        cubeFilter: { iri: cubeIri },
    })
        .toPromise();
    const previewDimensions = (_a = dataCubePreview === null || dataCubePreview === void 0 ? void 0 : dataCubePreview.dataCubePreview.dimensions) !== null && _a !== void 0 ? _a : [];
    const previewMeasures = (_b = dataCubePreview === null || dataCubePreview === void 0 ? void 0 : dataCubePreview.dataCubePreview.measures) !== null && _b !== void 0 ? _b : [];
    const componentIds = previewDimensions.some((d) => !d.isKeyDimension)
        ? [
            ...previewDimensions.filter((d) => d.isKeyDimension).map((d) => d.id),
            ...previewMeasures.map((d) => d.id),
        ]
        : // As the query with undefined component ids is also used in other parts of the app,
            // we want to benefit from the cache and not refetch the data if we already have it.
            undefined;
    const { data: components } = await executeDataCubesComponentsQuery(client, {
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
        locale,
        cubeFilters: [
            {
                iri: latestCubeIri,
                componentIds,
                loadValues: true,
            },
        ],
    });
    if (!(components === null || components === void 0 ? void 0 : components.dataCubesComponents)) {
        throw Error(`Could not fetch components for ${latestCubeIri}!`);
    }
    const { dimensions, measures } = components.dataCubesComponents;
    const { enabledChartTypes } = getEnabledChartTypes({
        dimensions,
        measures,
        cubeCount: 1,
    });
    const initialChartConfig = getInitialConfig({
        chartType: enabledChartTypes[0],
        iris: [{ iri: latestCubeIri }],
        dimensions,
        measures,
    });
    const temporaryChartConfig = deriveFiltersFromFields(initialChartConfig, {
        dimensions,
    });
    const { unmappedFilters } = getFiltersByMappingStatus(temporaryChartConfig, {
        cubeIri: latestCubeIri,
    });
    const shouldFetchPossibleFilters = Object.keys(unmappedFilters).length > 0;
    const variables = getPossibleFiltersQueryVariables({
        cubeIri: latestCubeIri,
        dataSource,
        unmappedFilters,
    });
    const { data: possibleFilters } = await client
        .query(PossibleFiltersDocument, variables, { pause: !shouldFetchPossibleFilters })
        .toPromise();
    if (!(possibleFilters === null || possibleFilters === void 0 ? void 0 : possibleFilters.possibleFilters) && shouldFetchPossibleFilters) {
        throw Error(`Could not fetch possible filters for ${latestCubeIri}!`);
    }
    const chartConfig = deriveFiltersFromFields(initialChartConfig, {
        dimensions,
        possibleFilters: possibleFilters === null || possibleFilters === void 0 ? void 0 : possibleFilters.possibleFilters,
    });
    return transitionStepNext(getStateWithCurrentDataSource(SELECTING_DATASET_STATE), { chartConfig });
};
/**
 * Tries to parse state from localStorage.
 * If state is invalid, it is removed from localStorage.
 */
export const initChartStateFromLocalStorage = async (client, chartId) => {
    const storedState = window.localStorage.getItem(getLocalStorageKey(chartId));
    if (!storedState) {
        return;
    }
    let state;
    try {
        const rawState = JSON.parse(storedState);
        const migratedState = await migrateConfiguratorState(rawState);
        state = decodeConfiguratorState(migratedState);
    }
    catch (e) {
        console.error("Error while parsing stored state", e);
    }
    if (state) {
        return upgradeConfiguratorState(state, {
            client,
            dataSource: state.dataSource,
        });
    }
    console.warn("Attempted to restore invalid state. Removing from localStorage.", state);
    window.localStorage.removeItem(getLocalStorageKey(chartId));
};
export const initChartStateFromChartCopy = async (client, fromChartId) => {
    const config = await fetchChartConfig(fromChartId);
    if (config === null || config === void 0 ? void 0 : config.data) {
        // Do not keep the previous chart key
        delete config.data.key;
        const state = (await migrateConfiguratorState({
            ...config.data,
            state: "CONFIGURING_CHART",
        }));
        return await upgradeConfiguratorState(state, {
            client,
            dataSource: state.dataSource,
        });
    }
};
export const initChartStateFromChartEdit = async (client, fromChartId, state) => {
    const config = await fetchChartConfig(fromChartId);
    if (config === null || config === void 0 ? void 0 : config.data) {
        const configState = (await migrateConfiguratorState({
            ...config.data,
            state: state !== null && state !== void 0 ? state : "CONFIGURING_CHART",
        }));
        return await upgradeConfiguratorState(configState, {
            client,
            dataSource: configState.dataSource,
        });
    }
};
