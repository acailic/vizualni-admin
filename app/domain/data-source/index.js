import { useMemo } from "react";
import { SOURCES_BY_LABEL, SOURCES_BY_VALUE, } from "@/domain/data-source/constants";
import { ENDPOINT } from "@/domain/env";
export { isDataSourceUrlAllowed } from "./urls";
export const parseDataSource = (stringifiedSource) => {
    const [type, url] = stringifiedSource.split("+");
    return { type, url };
};
export const DEFAULT_DATA_SOURCE = parseDataSource(ENDPOINT);
export const stringifyDataSource = (source) => {
    const { type, url } = source;
    return `${type}+${url}`;
};
export const useIsTrustedDataSource = (dataSource) => {
    return useMemo(() => {
        var _a;
        const stringifiedDataSource = stringifyDataSource(dataSource);
        return (_a = SOURCES_BY_VALUE[stringifiedDataSource]) === null || _a === void 0 ? void 0 : _a.isTrusted;
    }, [dataSource]);
};
export const parseSourceByLabel = (label) => {
    const newSource = SOURCES_BY_LABEL[label];
    return newSource ? parseDataSource(newSource.value) : undefined;
};
export const sourceToLabel = (source) => {
    var _a;
    return (_a = SOURCES_BY_VALUE[stringifyDataSource(source)]) === null || _a === void 0 ? void 0 : _a.label;
};
export const isDataSourceChangeable = (pathname) => {
    return ["/", "/browse"].includes(pathname);
};
export const dataSourceToSparqlEditorUrl = (dataSource) => {
    switch (dataSource.type) {
        case "sparql":
            const url = new URL(dataSource.url);
            return `${url.origin}/sparql`;
        case "sql":
            throw Error("Not implemented yet.");
    }
};
