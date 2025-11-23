// @ts-ignore
import { build, completionHandler } from "@cozy/cli-tree";
import { config } from "dotenv";
import fetch from "node-fetch";
import { Client } from "urql";
import { GRAPHQL_ENDPOINT } from "../domain/env";
import { DataCubeComponentsDocument, DataCubeMetadataDocument, DataCubePreviewDocument, } from "../graphql/query-hooks";
config();
// @ts-ignore
global.fetch = fetch;
const showCubeInfo = async ({ client, iri, sourceType, sourceUrl, locale, report, }) => {
    var _a;
    const res = await client
        .query(DataCubeMetadataDocument, {
        sourceType,
        sourceUrl,
        locale,
        cubeFilter: { iri },
    })
        .toPromise();
    if (res.error) {
        throw Error(res.error.message);
    }
    const cube = (_a = res.data) === null || _a === void 0 ? void 0 : _a.dataCubeMetadata;
    report(cube);
};
const showCubeComponents = async ({ client, iri, sourceType, sourceUrl, locale, report, }) => {
    var _a;
    const res = await client
        .query(DataCubeComponentsDocument, {
        sourceType,
        sourceUrl,
        locale,
        cubeFilter: { iri },
    })
        .toPromise();
    if (res.error) {
        throw Error(res.error.message);
    }
    report((_a = res.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponents);
};
const previewCube = async ({ client, iri, sourceType, sourceUrl, locale, report, }) => {
    var _a, _b;
    const { data: info, error } = await client
        .query(DataCubeMetadataDocument, {
        sourceType,
        sourceUrl,
        locale,
        cubeFilter: { iri },
    })
        .toPromise();
    if (error) {
        throw Error(error.message);
    }
    if (!info || !info.dataCubeMetadata) {
        throw Error(`Could not find cube with iri of ${iri}`);
    }
    const res = await client
        .query(DataCubePreviewDocument, {
        sourceType,
        sourceUrl,
        locale,
        cubeFilter: { iri },
    })
        .toPromise();
    if (res.error) {
        throw Error(res.error.message);
    }
    report((_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.dataCubePreview) === null || _b === void 0 ? void 0 : _b.observations);
};
const main = async () => {
    const iriArg = {
        argument: ["-i", "--iri"],
        help: "Datacube iri",
        required: true,
    };
    const sourceTypeArg = {
        argument: ["-l", "--sourceType"],
        defaultValue: "sparql",
        help: "DataSourceType",
    };
    const sourceUrlArg = {
        argument: ["-l", "--sourceUrl"],
        defaultValue: "https://lindas.admin.ch/query",
        help: "DataUrlType",
    };
    const localeArg = {
        argument: ["-l", "--locale"],
        defaultValue: "en",
        help: "Locale",
    };
    const jsonArg = {
        help: "Output result in JSON",
        argument: ["-j", "--json"],
        action: "storeTrue",
        defaultValue: false,
    };
    const commands = {
        info: {
            description: "Get info on the datacube",
            arguments: [iriArg, sourceTypeArg, sourceUrlArg, localeArg, jsonArg],
            handler: showCubeInfo,
        },
        preview: {
            description: "Preview observations on the datacube",
            arguments: [iriArg, sourceTypeArg, sourceUrlArg, localeArg, jsonArg],
            handler: previewCube,
        },
        components: {
            description: "Show cube components",
            arguments: [iriArg, sourceTypeArg, sourceUrlArg, localeArg, jsonArg],
            handler: showCubeComponents,
        },
    };
    await completionHandler(commands);
    const [parser] = build(commands);
    const args = parser.parseArgs();
    args.report = args.json
        ? (x) => console.log(JSON.stringify(x, null, 2))
        : console.log;
    args.client = new Client({
        url: `http://localhost:3000${GRAPHQL_ENDPOINT}`,
        // @ts-ignore
        fetch: fetch,
    });
    args.handler(args);
};
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
