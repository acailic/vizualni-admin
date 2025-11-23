import isUndefined from "lodash/isUndefined";
import omit from "lodash/omit";
import omitBy from "lodash/omitBy";
import { apiFetch } from "../api";
import { createId } from "../create-id";
const prepareForServer = (configState) => {
    return omitBy({
        ...configState,
        data: "data" in configState
            ? omit(configState["data"], ["state"])
            : undefined,
    }, isUndefined);
};
export const createConfig = async (options) => {
    return apiFetch("/api/config-create", {
        method: "POST",
        data: prepareForServer({
            data: {
                // Create a new chart ID, as the one in the state could be already
                // used by a chart that has been published.
                key: createId(),
                ...options.data,
            },
            user_id: options.user_id,
            published_state: options.published_state,
        }),
    });
};
export const updateConfig = async (options) => {
    const { key, published_state } = options;
    return apiFetch("/api/config-update", {
        method: "POST",
        data: prepareForServer({
            key,
            data: {
                key,
                ...options.data,
            },
            published_state,
        }),
    });
};
export const removeConfig = async (options) => {
    const { key } = options;
    return apiFetch("/api/config-remove", {
        method: "POST",
        data: {
            key,
        },
    });
};
export const fetchChartConfig = async (id) => {
    return await apiFetch(`/api/config/${id}`);
};
export const fetchChartConfigs = async () => {
    return await apiFetch(`/api/config/list`);
};
export const fetchChartViewCount = async (id) => {
    return await apiFetch(`/api/config/view?id=${id}`);
};
export const createCustomColorPalette = async (options) => {
    return (await apiFetch("/api/user/color-palette", {
        method: "POST",
        data: options,
    }));
};
export const getCustomColorPalettes = async () => {
    return (await apiFetch("/api/user/color-palette", {
        method: "GET",
    }));
};
export const deleteCustomColorPalette = async (options) => {
    await apiFetch("/api/user/color-palette", {
        method: "DELETE",
        data: options,
    });
};
export const updateCustomColorPalette = async (options) => {
    await apiFetch("/api/user/color-palette", {
        method: "PUT",
        data: options,
    });
};
