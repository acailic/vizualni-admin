import produce, { current } from "immer";
import get from "lodash/get";
import pickBy from "lodash/pickBy";
import set from "lodash/set";
import { getEnabledChartTypes, getInitialConfig } from "@/charts";
import { getChartSpec } from "@/charts/chart-config-ui-options";
import { enableLayouting, isColorFieldInConfig, } from "@/config-types";
import { extractSingleFilters, getChartConfig, getChartConfigFilters, isSingleFilters, } from "@/config-utils";
import { getInitialConfiguringConfigBasedOnCube } from "@/configurator/configurator-state/initial";
import { deriveFiltersFromFields } from "@/configurator/configurator-state/reducer";
import { DEFAULT_DATA_SOURCE } from "@/domain/data-source";
import { mkJoinById } from "@/graphql/join";
import { getDataSourceFromLocalStorage } from "@/stores/data-source";
import { getCachedComponents } from "@/urql-cache";
export { ConfiguratorStateProvider, useConfiguratorState, useReadOnlyConfiguratorState, } from "./context";
export { initChartStateFromChartEdit, initChartStateFromCube } from "./init";
export { saveChartLocally } from "./local-storage";
export const getStateWithCurrentDataSource = (state) => {
    const dataSource = getDataSourceFromLocalStorage();
    return {
        ...state,
        dataSource: dataSource !== null && dataSource !== void 0 ? dataSource : DEFAULT_DATA_SOURCE,
    };
};
export const getPreviousState = (draft) => {
    switch (draft.state) {
        case "SELECTING_DATASET":
            return draft.state;
        case "CONFIGURING_CHART":
            return "SELECTING_DATASET";
        case "LAYOUTING":
            return "CONFIGURING_CHART";
        case "PUBLISHING":
            if (enableLayouting(draft)) {
                return "LAYOUTING";
            }
            return "CONFIGURING_CHART";
        default:
            return "SELECTING_DATASET";
    }
};
// FIXME: should by handled better, as color is a subfield and not actual field.
// Side effects in ui encodings?
const getNonGenericFieldValues = (chartConfig) => {
    var _a, _b;
    const ids = [];
    if (isColorFieldInConfig(chartConfig)) {
        if (((_a = chartConfig.fields.areaLayer) === null || _a === void 0 ? void 0 : _a.color.type) === "categorical") {
            ids.push(chartConfig.fields.areaLayer.color.componentId);
        }
        if (((_b = chartConfig.fields.symbolLayer) === null || _b === void 0 ? void 0 : _b.color.type) === "categorical") {
            ids.push(chartConfig.fields.symbolLayer.color.componentId);
        }
    }
    return ids;
};
/** Get all filters by mapping status.
 *
 * We need to handle some fields differently due to the way the chart config
 * is structured at the moment (MapColorField) is a subfield of areaLayer and
 * symbolLayer fields.
 */
export const getFiltersByMappingStatus = (chartConfig, options) => {
    const { joinByIds, cubeIri } = options;
    const genericFieldValues = Object.values(
    // @ts-ignore - we are only interested in component ids
    chartConfig.fields).map((d) => d.componentId);
    const nonGenericFieldValues = getNonGenericFieldValues(chartConfig);
    const ids = new Set([
        ...genericFieldValues,
        ...nonGenericFieldValues,
        ...(joinByIds !== null && joinByIds !== void 0 ? joinByIds : []),
    ]);
    const filters = getChartConfigFilters(chartConfig.cubes, { cubeIri });
    const mappedFilters = pickBy(filters, (_, id) => ids.has(id));
    const unmappedFilters = pickBy(filters, (_, id) => !ids.has(id));
    if (!isSingleFilters(unmappedFilters)) {
        console.warn("Unmapped filters must be single filters!");
    }
    return {
        mappedFilters,
        mappedFiltersIds: ids,
        unmappedFilters: extractSingleFilters(unmappedFilters),
    };
};
export const getChartOptionField = (state, field, path, defaultValue = "") => {
    const chartConfig = getChartConfig(state);
    return get(chartConfig, field === null ? path : `fields["${field}"].${path}`, defaultValue);
};
export const getFilterValue = (state, dimension) => {
    if (state.state === "INITIAL" || state.state === "SELECTING_DATASET") {
        return;
    }
    const chartConfig = getChartConfig(state);
    const filters = getChartConfigFilters(chartConfig.cubes, { joined: true });
    return filters[dimension.id];
};
export const moveFilterField = produce((chartConfig, { dimension, delta, possibleValues, }) => {
    const cube = chartConfig.cubes.find((cube) => cube.iri === dimension.cubeIri);
    if (!cube) {
        return;
    }
    // Use getOwnPropertyNames instead of keys since the spec ensures that
    // the order of the keys received is in insertion order
    // https://262.ecma-international.org/6.0/#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys
    const keys = Object.getOwnPropertyNames(cube.filters);
    const fieldIndex = Object.keys(cube.filters).indexOf(dimension.id);
    if (fieldIndex === 0 && delta === -1) {
        return;
    }
    if (fieldIndex === keys.length - 1 && delta === 1) {
        return;
    }
    if (fieldIndex === -1 && delta !== -1) {
        return;
    }
    const replacedIndex = fieldIndex === -1 ? keys.length - 1 : fieldIndex + delta;
    const replaced = keys[replacedIndex];
    keys[replacedIndex] = dimension.id;
    if (fieldIndex === -1) {
        keys.push(replaced);
    }
    else {
        keys[fieldIndex] = replaced;
    }
    cube.filters = Object.fromEntries(keys.map((k) => {
        var _a;
        return [
            k,
            (_a = cube.filters[k]) !== null && _a !== void 0 ? _a : { type: "single", value: possibleValues[0] },
        ];
    }));
});
export const isConfiguring = (s) => {
    return s.state === "CONFIGURING_CHART";
};
export const isLayouting = (s) => {
    return s.state === "LAYOUTING";
};
export const isLayoutingFreeCanvas = (s) => {
    return (!isConfiguring(s) &&
        s.layout.type === "dashboard" &&
        s.layout.layout === "canvas");
};
export const isPublishing = (s) => {
    return s.state === "PUBLISHING";
};
export const isPublished = (s) => {
    return s.state === "PUBLISHED";
};
export const hasChartConfigs = (s) => {
    return "chartConfigs" in s;
};
export const addDatasetInConfig = function (config, options) {
    const chartConfig = getChartConfig(config, config.activeChartKey);
    const { iri, joinBy } = options;
    // Set new join by in existing cubes
    for (let i = 0; i < chartConfig.cubes.length; i++) {
        const cubeJoinBy = joinBy[chartConfig.cubes[i].iri];
        chartConfig.cubes[i].joinBy = cubeJoinBy;
    }
    chartConfig.cubes.push({
        iri,
        joinBy: joinBy[iri],
        filters: {},
    });
    // Need to go over fields, and replace any IRI part of the joinBy by "joinBy__<index>"
    const { encodings } = getChartSpec(chartConfig);
    const encodingAndFields = encodings.map((e) => [
        e,
        chartConfig.fields[e.field],
    ]);
    for (const [encoding, field] of encodingAndFields) {
        if (!field) {
            continue;
        }
        for (const idAttribute of encoding.idAttributes) {
            const value = get(field, idAttribute);
            const joinByIris = Object.keys(joinBy);
            const index = (() => {
                for (const iri of joinByIris) {
                    const index = joinBy[iri].indexOf(value);
                    if (index > -1) {
                        return index;
                    }
                }
                return undefined;
            })();
            if (index !== undefined && index > -1) {
                set(field, idAttribute, mkJoinById(index));
            }
        }
    }
};
export const removeDatasetInConfig = function (draft, options) {
    const { locale, iri: removedCubeIri } = options;
    const chartConfig = getChartConfig(draft);
    const newCubes = chartConfig.cubes.filter((c) => c.iri !== removedCubeIri);
    const dataCubesComponents = getCachedComponents({
        locale,
        dataSource: draft.dataSource,
        cubeFilters: newCubes.map((cube) => ({
            iri: cube.iri,
            joinBy: newCubes.length > 1 ? cube.joinBy : undefined,
        })),
    });
    if (!dataCubesComponents) {
        throw Error("Error while removing dataset: Could not find cached dataCubesComponents");
    }
    const { dimensions, measures } = dataCubesComponents;
    const remainingCubeIris = chartConfig.cubes
        .filter((c) => c.iri !== removedCubeIri)
        .map(({ iri }) => ({ iri }));
    const { enabledChartTypes } = getEnabledChartTypes({
        dimensions,
        measures,
        cubeCount: remainingCubeIris.length,
    });
    const initialConfig = getInitialConfig({
        chartType: enabledChartTypes.includes(chartConfig.chartType)
            ? chartConfig.chartType
            : enabledChartTypes[0],
        iris: remainingCubeIris,
        dimensions,
        measures,
        meta: current(chartConfig.meta),
    });
    const newChartConfig = deriveFiltersFromFields(initialConfig, {
        dimensions,
    });
    const initConfig = getInitialConfiguringConfigBasedOnCube({
        dataSource: draft.dataSource,
        chartConfig: newChartConfig,
    });
    const newConfig = {
        ...initConfig.chartConfigs[0],
        key: chartConfig.key,
    };
    const index = draft.chartConfigs.findIndex((d) => d.key === chartConfig.key);
    const withFilters = deriveFiltersFromFields(newConfig, { dimensions });
    // Re-put the join by inside the cubes
    const joinByByCubes = Object.fromEntries(chartConfig.cubes.map((cube) => [cube.iri, cube.joinBy]));
    for (const cube of withFilters.cubes) {
        const joinBy = joinByByCubes[cube.iri];
        if (joinBy) {
            // TODO Should there be dimensions in the joinBy that should be removed ?
            cube.joinBy = joinBy;
        }
    }
    draft.chartConfigs[index] = withFilters;
    return draft;
};
