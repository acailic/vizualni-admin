var _a;
import { SOURCE_OPTIONS } from "@/domain/data-source/constants";
const allowedSourceLabels = JSON.parse((_a = process.env.WHITELISTED_DATA_SOURCES) !== null && _a !== void 0 ? _a : "[]");
const allowedSources = SOURCE_OPTIONS.filter((o) => allowedSourceLabels.includes(o.label));
const allowedDataSourceUrls = allowedSources.map((o) => o.value.split("+")[1]);
export const isDataSourceUrlAllowed = (url) => {
    return typeof url === "string" && allowedDataSourceUrls.includes(url);
};
