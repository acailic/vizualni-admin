import { _WMSLayer as DeckGLWMSLayer } from "@deck.gl/geo-layers";
import { XMLParser } from "fast-xml-parser";
import uniq from "lodash/uniq";
import { isRemoteLayerCRSSupported } from "@/charts/map/wms-wmts-endpoint-utils";
import { maybeArray, parseCrs } from "@/charts/map/wms-wmts-parse-utils";
const parseWMSLayer = (layer, parentAttributes, parentPath = "") => {
    var _a, _b, _c, _d, _e, _f;
    const currentPath = `${parentPath !== null && parentPath !== void 0 ? parentPath : parentAttributes.endpoint}/${(_a = layer.Name) !== null && _a !== void 0 ? _a : layer.Title}`;
    const layerCrs = ((_b = maybeArray(layer.CRS)) !== null && _b !== void 0 ? _b : []).map((c) => parseCrs(c));
    /**
     *  CRS is inherited with behavior "add", see Table 7 — Inheritance of Layer properties from the spec
     * @see https://www.ogc.org/standards/wms/ "OpenGIS Web Map Service (WMS) Implementation Specification"
     */
    const crs = uniq([...parentAttributes.crs, ...layerCrs]);
    const res = {
        // Non unique across layers
        id: layer.Name,
        // Unique across layers
        path: `${currentPath}`,
        title: layer.Title,
        description: (_c = layer.Abstract) !== null && _c !== void 0 ? _c : "",
        legendUrl: (_d = layer.Style) === null || _d === void 0 ? void 0 : _d.LegendURL.OnlineResource["xlink:href"],
        type: "wms",
        ...parentAttributes,
        crs,
    };
    if (layer.Layer) {
        const children = (_e = maybeArray(layer.Layer)) === null || _e === void 0 ? void 0 : _e.map((l) => parseWMSLayer(l, parentAttributes, currentPath));
        res.children = children;
    }
    // Hoist single children with same id as parent, this is for UI purposes
    if (((_f = res.children) === null || _f === void 0 ? void 0 : _f.length) === 1 && res.children[0].id === res.id) {
        return res.children[0];
    }
    return res;
};
export const DEFAULT_WMS_URL = "https://wms.geo.admin.ch/?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0";
export const parseWMSContent = (content, endpoint) => {
    var _a, _b;
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: true,
    });
    const wmsData = parser.parse(content);
    const dataUrl = wmsData.WMS_Capabilities.Capability.Request.GetMap.DCPType.HTTP.Get
        .OnlineResource["xlink:href"];
    const attribution = (_b = (_a = wmsData.WMS_Capabilities.Capability.Layer.Attribution) === null || _a === void 0 ? void 0 : _a.Title) !== null && _b !== void 0 ? _b : wmsData.WMS_Capabilities.Service.Title;
    const layers = Array.isArray(wmsData.WMS_Capabilities.Capability.Layer.Layer)
        ? wmsData.WMS_Capabilities.Capability.Layer.Layer
        : [wmsData.WMS_Capabilities.Capability.Layer.Layer];
    return layers.map((l) => parseWMSLayer(l, {
        endpoint,
        dataUrl,
        attribution,
        crs: [],
    }));
};
export const getWMSTile = ({ wmsLayer, customLayer, beforeId, }) => {
    if (!customLayer) {
        return;
    }
    if (!wmsLayer) {
        return;
    }
    if (!isRemoteLayerCRSSupported(wmsLayer)) {
        console.warn(`WMS layer ${wmsLayer.id} is not supported in this map projection`);
        return;
    }
    return new DeckGLWMSLayer({
        id: `wms-layer-${customLayer.id}`,
        beforeId,
        data: `${wmsLayer.dataUrl.replace(/\?$/, "")}`,
        loadOptions: {
            fetch: (url) => {
                const parsedUrl = new URL(url);
                parsedUrl.searchParams.set("TRANSPARENT", "TRUE");
                return fetch(parsedUrl.toString());
            },
        },
        serviceType: "wms",
        layers: [wmsLayer.id],
    });
};
