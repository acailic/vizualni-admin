var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
import { maybeWindow } from "@/utils/maybe-window";
/**
 * Client and server-side **RUNTIME** variables
 *
 * These values are exposed in pages/_document.tsx to the browser or read from process.env on the server-side.
 * Note: we can't destructure process.env because it's mangled in the Next.js runtime
 */
const clientEnv = (_a = maybeWindow()) === null || _a === void 0 ? void 0 : _a.__clientEnv__;
export const PUBLIC_URL = ((_c = (_b = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.PUBLIC_URL) !== null && _b !== void 0 ? _b : process.env.PUBLIC_URL) !== null && _c !== void 0 ? _c : "").replace(/\/$/, "");
export const ENDPOINT = (_e = (_d = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.ENDPOINT) !== null && _d !== void 0 ? _d : process.env.ENDPOINT) !== null && _e !== void 0 ? _e : "sparql+https://data.gov.rs/sparql";
export const WHITELISTED_DATA_SOURCES = (_g = (_f = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.WHITELISTED_DATA_SOURCES) !== null && _f !== void 0 ? _f : (process.env.WHITELISTED_DATA_SOURCES !== undefined
    ? JSON.parse(process.env.WHITELISTED_DATA_SOURCES)
    : undefined)) !== null && _g !== void 0 ? _g : ["Prod"];
export const SPARQL_GEO_ENDPOINT = (_j = (_h = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.SPARQL_GEO_ENDPOINT) !== null && _h !== void 0 ? _h : process.env.SPARQL_GEO_ENDPOINT) !== null && _j !== void 0 ? _j : "https://data.gov.rs/sparql";
export const SQL_ENDPOINT = (_l = (_k = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.SQL_ENDPOINT) !== null && _k !== void 0 ? _k : process.env.SQL_ENDPOINT) !== null && _l !== void 0 ? _l : "";
export const GRAPHQL_ENDPOINT = (_o = (_m = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.GRAPHQL_ENDPOINT) !== null && _m !== void 0 ? _m : process.env.GRAPHQL_ENDPOINT) !== null && _o !== void 0 ? _o : "/api/graphql";
export const GA_TRACKING_ID = (_p = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.GA_TRACKING_ID) !== null && _p !== void 0 ? _p : process.env.GA_TRACKING_ID;
export const ADFS_PROFILE_URL = (_q = clientEnv === null || clientEnv === void 0 ? void 0 : clientEnv.ADFS_PROFILE_URL) !== null && _q !== void 0 ? _q : process.env.ADFS_PROFILE_URL;
/**
 * Server-side-only **RUNTIME** variables (not exposed through window)
 */
export const ADFS_ID = process.env.ADFS_ID;
export const ADFS_ISSUER = process.env.ADFS_ISSUER;
/**
 * Variables set at **BUILD TIME** through `NEXT_PUBLIC_*` variables. Available on the client and server.
 */
export const BUILD_VERSION = process.env.NEXT_PUBLIC_VERSION;
export const BUILD_COMMIT = process.env.NEXT_PUBLIC_COMMIT;
export const BUILD_GITHUB_REPO = (process.env.NEXT_PUBLIC_GITHUB_REPO || "").replace(/^git\+https/, "https"); // Don't use git+https for the link, need to check with Abraxas
export const BASE_VECTOR_TILE_URL = (_r = process.env.NEXT_PUBLIC_BASE_VECTOR_TILE_URL) !== null && _r !== void 0 ? _r : "";
export const MAPTILER_STYLE_KEY = (_s = process.env.NEXT_PUBLIC_MAPTILER_STYLE_KEY) !== null && _s !== void 0 ? _s : "";
export const SENTRY_DSN = (_t = process.env.NEXT_PUBLIC_SENTRY_DSN) !== null && _t !== void 0 ? _t : "https://1783a12ef4c64b678167ea8761265825@o65222.ingest.sentry.io/4504922724040704";
export const SENTRY_ENV = process.env.NEXT_PUBLIC_SENTRY_ENV;
