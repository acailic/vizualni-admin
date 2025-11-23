const LOCALSTORAGE_PREFIX = "vizualize-configurator-state";
export const getLocalStorageKey = (chartId) => `${LOCALSTORAGE_PREFIX}:${chartId}`;
export const saveChartLocally = (chartId, state) => {
    window.localStorage.setItem(getLocalStorageKey(chartId), JSON.stringify(state));
    return;
};
