import { maybeWindow } from "@/utils/maybe-window";
export const getURLParam = (param) => {
    const window = maybeWindow();
    const url = window ? new URL(window.location.href) : null;
    if (!url) {
        return undefined;
    }
    return url.searchParams.get(param);
};
export const updateRouterQuery = ({ pathname, replace, query }, values) => {
    replace({ pathname, query: { ...query, ...values } }, undefined, {
        shallow: true,
    });
};
export const setURLParam = (param, value) => {
    const { protocol, host, pathname, href } = window.location;
    const qs = new URL(href).searchParams;
    qs.delete(param);
    qs.append(param, value);
    const newUrl = `${protocol}//${host}${pathname}?${qs}`;
    window.history.replaceState({ ...window.history.state, path: newUrl }, "", newUrl);
};
export const getRouterChartId = (asPath) => {
    return asPath.split("?")[0].split("/").pop();
};
