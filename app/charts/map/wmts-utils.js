import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { XMLParser } from "fast-xml-parser";
import uniq from "lodash/uniq";
import { isCRSSupported, isRemoteLayerCRSSupported, } from "@/charts/map/wms-wmts-endpoint-utils";
import { maybeArray, parseCrs } from "@/charts/map/wms-wmts-parse-utils";
const parseTileMatrixSets = (_tileMatrixSet) => {
    if (!_tileMatrixSet) {
        return null;
    }
    const tileMatrixSet = Array.isArray(_tileMatrixSet)
        ? _tileMatrixSet
        : [_tileMatrixSet];
    const parsedTileMatrixSet = (item) => {
        var _a;
        const [x, y] = item.TileMatrix[0].TopLeftCorner.split(" ").map(Number);
        const tileMatrixes = Array.isArray(item.TileMatrix)
            ? item.TileMatrix
            : [item.TileMatrix];
        return {
            id: item["ows:Identifier"],
            supportedCRS: ((_a = maybeArray(item["ows:SupportedCRS"])) !== null && _a !== void 0 ? _a : []).map((crs) => parseCrs(crs)),
            tileMatrixes: tileMatrixes.map((tm) => ({
                id: tm["ows:Identifier"],
                scaleDenominator: tm.ScaleDenominator,
                topLeftCorner: [x, y],
                tileWidth: tm.TileWidth,
                tileHeight: tm.TileHeight,
                matrixWidth: tm.MatrixWidth,
                matrixHeight: tm.MatrixHeight,
            })),
        };
    };
    return tileMatrixSet.map(parsedTileMatrixSet);
};
const parseWMTSLayer = (layer, attributes, tileMatrixById = {}, getTileUrl) => {
    var _a, _b, _c, _d;
    const tileMatrixSetLinks = (_a = maybeArray(layer.TileMatrixSetLink)) !== null && _a !== void 0 ? _a : [];
    const tileMatrixSets = tileMatrixSetLinks.map((tl) => tileMatrixById[tl.TileMatrixSet]);
    const res = {
        id: layer["ows:Identifier"],
        path: layer["ows:Identifier"],
        url: layer.ResourceURL.template || getTileUrl || attributes.endpoint,
        title: layer["ows:Title"],
        description: layer["ows:Abstract"],
        legendUrl: (_b = layer.Style.LegendURL) === null || _b === void 0 ? void 0 : _b["xlink:href"],
        /** @patrick: Not sure why but dimension can be missing (see zh.wmts.xml) */
        dimensionIdentifier: (_c = layer.Dimension) === null || _c === void 0 ? void 0 : _c["ows:Identifier"],
        availableDimensionValues: layer.Dimension
            ? Array.isArray(layer.Dimension.Value)
                ? layer.Dimension.Value
                : [layer.Dimension.Value]
            : undefined,
        defaultDimensionValue: (_d = layer.Dimension) === null || _d === void 0 ? void 0 : _d.Default,
        type: "wmts",
        tileMatrixSets: tileMatrixSets,
        crs: uniq(tileMatrixSets
            .map((ts) => { var _a; return ((_a = ts === null || ts === void 0 ? void 0 : ts.supportedCRS) !== null && _a !== void 0 ? _a : []).map((crs) => parseCrs(crs)); })
            .flat()),
        ...attributes,
    };
    // No children at Layer level, if we want to support it, we need to do this
    // via the Themes property
    // @see https://portal.ogc.org/files/?artifact_id=35326
    // Section7.1.1.1.3
    return res;
};
const mapArrayOrUnique = (arr, cb) => {
    if (Array.isArray(arr)) {
        return arr.map(cb);
    }
    return [cb(arr)];
};
const formatGetTileUrl = (url) => {
    /**
     * We use TileMatrixNamespaced here since when replaced in getDataUrl, we need to have the tileMatrix with the
     * namespace.
     * - This is for the getTile case (layer without resourceUrl).
     * - When layer:resourceUrl is used, we do not need the namespace.
     */
    return `${url.endsWith("?") ? url : `${url}?`}Service=WMTS&Request=GetTile&Transparent=true&Version=1.0.0&Format=image/png&tileMatrixSet={TileMatrixSet}&tileMatrix={TileMatrixNamespaced}&tileRow={TileRow}&tileCol={TileCol}&layer={Layer}`;
};
export const parseWMTSContent = (content, endpoint) => {
    var _a, _b, _c, _d, _e, _f;
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: true,
    });
    const parsed = parser.parse(content);
    const attributes = {
        endpoint,
        attribution: (_a = parsed.Capabilities["ows:ServiceProvider"]) === null || _a === void 0 ? void 0 : _a["ows:ProviderName"],
    };
    const getTileOperation = (_c = (_b = parsed.Capabilities["ows:OperationsMetadata"]) === null || _b === void 0 ? void 0 : _b["ows:Operation"]) === null || _c === void 0 ? void 0 : _c.find((operation) => operation["name"] === "GetTile");
    const getTileUrlRaw = (_f = (_e = (_d = getTileOperation === null || getTileOperation === void 0 ? void 0 : getTileOperation["ows:DCP"]) === null || _d === void 0 ? void 0 : _d["ows:HTTP"]) === null || _e === void 0 ? void 0 : _e["ows:Get"]) === null || _f === void 0 ? void 0 : _f["xlink:href"];
    const getTileUrl = getTileUrlRaw
        ? formatGetTileUrl(getTileUrlRaw)
        : undefined;
    const tileMatrixSets = parseTileMatrixSets(parsed.Capabilities.Contents.TileMatrixSet);
    const tileMatrixById = tileMatrixSets
        ? Object.fromEntries(tileMatrixSets.map((tileMatrix) => [tileMatrix.id, tileMatrix]))
        : {};
    const Layer = parsed.Capabilities.Contents.Layer;
    return mapArrayOrUnique(Layer, (l) => parseWMTSLayer(l, attributes, tileMatrixById, getTileUrl));
};
export const DEFAULT_WMTS_URL = "https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml";
export const getWMTSTile = ({ wmtsLayer, customLayer, beforeId, value, }) => {
    var _a, _b, _c;
    const url = (_a = customLayer === null || customLayer === void 0 ? void 0 : customLayer.url) !== null && _a !== void 0 ? _a : customLayer === null || customLayer === void 0 ? void 0 : customLayer.endpoint;
    if (customLayer && customLayer.url === "undefined") {
        console.warn("No url on layer, defaulted to endpoint");
        return;
    }
    if (!customLayer) {
        console.warn("No custom layer found");
        return;
    }
    if (!wmtsLayer) {
        console.warn("No wmts layer");
        return;
    }
    if (!url) {
        console.warn("No url found");
        return;
    }
    if (!isRemoteLayerCRSSupported(wmtsLayer)) {
        console.warn(`The WMTS layer ${wmtsLayer.id} does not have a supported CRS, skipping layer.`);
        return;
    }
    const espg3857TileMatrixSet = (_b = wmtsLayer.tileMatrixSets) === null || _b === void 0 ? void 0 : _b.find((tms) => {
        return tms.supportedCRS.some((crs) => isCRSSupported(crs));
    });
    const tileLayerDataUrl = getWMTSLayerData(url, {
        tileMatrixSetId: espg3857TileMatrixSet === null || espg3857TileMatrixSet === void 0 ? void 0 : espg3857TileMatrixSet.id,
        identifier: wmtsLayer.dimensionIdentifier,
        layerId: wmtsLayer.id,
        value: getWMTSLayerValue({
            availableDimensionValues: (_c = wmtsLayer.availableDimensionValues) !== null && _c !== void 0 ? _c : [],
            defaultDimensionValue: wmtsLayer.defaultDimensionValue,
            customLayer,
            value,
        }),
    });
    return new TileLayer({
        id: `tile-layer-${url}-${wmtsLayer.id}`,
        beforeId,
        data: tileLayerDataUrl,
        tileSize: 256,
        renderSubLayers: (props) => {
            const { boundingBox } = props.tile;
            return new BitmapLayer(props, {
                data: undefined,
                image: props.data,
                bounds: [
                    boundingBox[0][0],
                    boundingBox[0][1],
                    boundingBox[1][0],
                    boundingBox[1][1],
                ],
            });
        },
    });
};
const getWMTSLayerData = (url, { identifier, value, tileMatrixSetId, layerId, }) => {
    const identifierReplaced = identifier
        ? url.replace(`{${identifier}}`, `${value}`)
        : url;
    return identifierReplaced
        .replace(`{TileMatrixSet}`, tileMatrixSetId !== null && tileMatrixSetId !== void 0 ? tileMatrixSetId : "{TileMatrixSet}")
        .replace("{TileMatrixNamespaced}", tileMatrixSetId ? `${tileMatrixSetId}:{z}` : "{z}")
        .replace(`{Layer}`, layerId !== null && layerId !== void 0 ? layerId : "{Layer}")
        .replace("{TileMatrix}", "{z}")
        .replace("{TileCol}", "{x}")
        .replace("{TileRow}", "{y}");
};
export const getWMTSLayerValue = ({ availableDimensionValues, defaultDimensionValue, customLayer, value, }) => {
    if (!customLayer ||
        (customLayer &&
            "syncTemporalFilters" in customLayer &&
            !customLayer.syncTemporalFilters)) {
        return defaultDimensionValue;
    }
    return value && availableDimensionValues.includes(value)
        ? value
        : defaultDimensionValue;
};
