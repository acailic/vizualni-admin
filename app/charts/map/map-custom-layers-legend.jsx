import { Box, Typography, useTheme } from "@mui/material";
import uniq from "lodash/uniq";
import NextImage from "next/image";
import { DEFAULT_WMS_URL } from "@/charts/map/wms-utils";
import { getLayerKey, useWMTSorWMSLayers, } from "@/charts/map/wms-wmts-endpoint-utils";
import { DEFAULT_WMTS_URL, getWMTSLayerValue, } from "@/charts/map/wmts-utils";
import { Error, InlineLoading } from "@/components/hint";
import { InfoIconTooltip } from "@/components/info-icon-tooltip";
import { truthy } from "@/domain/types";
import { useLocale } from "@/locales/use-locale";
import { useFetchData } from "@/utils/use-fetch-data";
/** Constrain size, keeping aspect ratio */
const constrainSize = ({ width, height, maxWidth, maxHeight, }) => {
    const aspectRatio = width / height;
    if (width > maxWidth) {
        width = maxWidth;
        height = Math.round(maxWidth / aspectRatio);
    }
    if (height > maxHeight) {
        height = maxHeight;
        width = Math.round(maxHeight * aspectRatio);
    }
    return { width, height };
};
export const MapCustomLayersLegend = ({ chartConfig, value, }) => {
    const customLayers = chartConfig.baseLayer.customLayers;
    const { data: legendsData, error } = useLegendsData({ customLayers });
    const theme = useTheme();
    return error ? (<Error>{error.message}</Error>) : !legendsData ? (<InlineLoading />) : (<>
      {legendsData.map(({ remoteLayer: layer, configLayer, dataUrl, width, height }) => {
            var _a, _b;
            if (!configLayer) {
                return null;
            }
            const layerValue = configLayer.type === "wmts" && layer
                ? getWMTSLayerValue({
                    availableDimensionValues: (_a = layer.availableDimensionValues) !== null && _a !== void 0 ? _a : [],
                    defaultDimensionValue: (_b = layer.defaultDimensionValue) !== null && _b !== void 0 ? _b : "",
                    customLayer: configLayer,
                    value,
                })
                : undefined;
            const { width: swidth, height: sheight } = constrainSize({
                width,
                height,
                maxWidth: 400,
                maxHeight: 400,
            });
            return (<Box key={dataUrl} sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography component="p" variant="caption">
                  {layer.title} {layerValue ? `(${layerValue})` : ""}
                </Typography>
                {layer.description ? (<InfoIconTooltip title={<Box sx={{
                            "& > *": {
                                // We do not let the tooltip HTML override the font size
                                fontSize: `${theme.typography.caption.fontSize} !important`,
                            },
                        }} dangerouslySetInnerHTML={{ __html: layer.description }}/>} sx={{ width: "fit-content" }}/>) : null}
              </Box>
              <NextImage src={dataUrl} alt={layer.title} width={swidth} height={sheight}/>
            </Box>);
        })}
    </>);
};
const cachedLegendImages = {};
const fetchLegendImage = async (remoteLayer) => {
    if (!(remoteLayer === null || remoteLayer === void 0 ? void 0 : remoteLayer.legendUrl)) {
        return undefined;
    }
    const blob = await fetch(remoteLayer.legendUrl).then((res) => res.blob());
    const bmp = await createImageBitmap(blob);
    const { width, height } = bmp;
    bmp.close();
    return {
        dataUrl: URL.createObjectURL(blob),
        width,
        height,
    };
};
const fetchLegendImageFromCache = async (remoteLayer) => {
    if (!(remoteLayer === null || remoteLayer === void 0 ? void 0 : remoteLayer.legendUrl)) {
        return undefined;
    }
    const cached = cachedLegendImages[remoteLayer.legendUrl];
    if (cached) {
        return cached;
    }
    const legendImage = fetchLegendImage(remoteLayer);
    cachedLegendImages[remoteLayer.legendUrl] = legendImage;
    return legendImage;
};
const useLegendsData = ({ customLayers: configLayers, }) => {
    const locale = useLocale();
    const wmsLayerConfigs = configLayers.filter((layer) => layer.type === "wms");
    const wmtsLayerConfigs = configLayers.filter((layer) => layer.type === "wmts");
    const wmtsEndpoints = uniq(wmtsLayerConfigs.map((x) => { var _a; return (_a = x.endpoint) !== null && _a !== void 0 ? _a : DEFAULT_WMTS_URL; }));
    const wmsEndpoints = uniq(wmsLayerConfigs.map((x) => { var _a; return (_a = x.endpoint) !== null && _a !== void 0 ? _a : DEFAULT_WMS_URL; }));
    const { data: groupedLayers, error: customLayersError } = useWMTSorWMSLayers([
        ...wmtsEndpoints,
        ...wmsEndpoints,
    ]);
    const { wms: wmsLayers, wmts: wmtsLayers, byKey: layersByKey, } = groupedLayers !== null && groupedLayers !== void 0 ? groupedLayers : {
        wms: [],
        wmts: [],
        byKey: {},
    };
    const { data: legendsData, error: legendsError } = useFetchData({
        queryKey: [
            "custom-layers-legends",
            configLayers.map((d) => d.id),
            wmsLayers === null || wmsLayers === void 0 ? void 0 : wmsLayers.map((d) => d.id),
            wmtsLayers === null || wmtsLayers === void 0 ? void 0 : wmtsLayers.map((d) => d.id),
            locale,
            1,
        ],
        queryFn: async () => {
            return (await Promise.all(configLayers.map(async (configLayer) => {
                let remoteLayer = layersByKey[getLayerKey(configLayer)];
                const legendImage = await fetchLegendImageFromCache(remoteLayer);
                if (!legendImage) {
                    return undefined;
                }
                const { width, height, dataUrl } = legendImage;
                return {
                    remoteLayer,
                    configLayer,
                    dataUrl,
                    width,
                    height,
                };
            }))).filter(truthy);
        },
        options: {
            pause: !wmsLayers || !wmtsLayers,
        },
    });
    return {
        data: legendsData,
        error: customLayersError !== null && customLayersError !== void 0 ? customLayersError : legendsError,
    };
};
