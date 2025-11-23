import keyBy from "lodash/keyBy";
import { WHITELISTED_DATA_SOURCES } from "../env";
// Serbian Open Data Portal endpoints
export const PROD_DATA_SOURCE_URL = "https://data.gov.rs/sparql";
export const SOURCE_OPTIONS = [
    {
        value: `sparql+${PROD_DATA_SOURCE_URL}`,
        label: "Prod",
        url: PROD_DATA_SOURCE_URL,
        isTrusted: true,
        supportsCachingPerCubeIri: true,
    },
].filter((d) => WHITELISTED_DATA_SOURCES.includes(d.label));
export const SOURCES_BY_LABEL = keyBy(SOURCE_OPTIONS, (d) => d.label);
export const SOURCES_BY_VALUE = keyBy(SOURCE_OPTIONS, (d) => d.value);
export const SOURCES_BY_URL = keyBy(SOURCE_OPTIONS, (d) => d.url);
