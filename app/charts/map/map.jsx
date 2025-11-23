import { GeoJsonLayer, ScatterplotLayer, } from "@deck.gl/layers";
import { supported } from "@mapbox/mapbox-gl-supported";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { hexToRgba } from "@uiw/react-color";
import { geoArea } from "d3-geo";
import debounce from "lodash/debounce";
import orderBy from "lodash/orderBy";
import uniq from "lodash/uniq";
import maplibreglRaw from "maplibre-gl";
import { useEffect, useMemo, useRef, useState } from "react";
import Map from "react-map-gl";
import { DEFAULT_COLOR, FLY_TO_DURATION, RESET_DURATION, } from "@/charts/map/constants";
import { CustomAttribution } from "@/charts/map/custom-attribution";
import { DashedScatterplotLayer } from "@/charts/map/dashed-scatterplot-layer";
import { useMapStyle } from "@/charts/map/get-base-layer-style";
import { BASE_VIEW_STATE, DeckGLOverlay, useViewState, } from "@/charts/map/helpers";
import { useMapTooltip } from "@/charts/map/map-tooltip";
import { getMap, setMap } from "@/charts/map/ref";
import { DEFAULT_WMS_URL, getWMSTile, } from "@/charts/map/wms-utils";
import { getLayerKey, useWMTSorWMSLayers, } from "@/charts/map/wms-wmts-endpoint-utils";
import { DEFAULT_WMTS_URL, getWMTSTile, } from "@/charts/map/wmts-utils";
import { useChartState } from "@/charts/shared/chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";
import { getWMSCustomLayers, getWMTSCustomLayers, } from "@/configurator";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { useEvent } from "@/utils/use-event";
import { DISABLE_SCREENSHOT_ATTR } from "@/utils/use-screenshot";
import "maplibre-gl/dist/maplibre-gl.css";
// supported was removed as of maplibre-gl v3.0.0, so we need to add it back
const maplibregl = { ...maplibreglRaw, supported };
const useStyles = makeStyles((theme) => ({
    controlButtons: {
        zIndex: 13,
        position: "absolute",
        bottom: 32,
        right: 16,
        display: "flex",
        flexDirection: "column",
    },
    controlButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 0,
        minHeight: 0,
        width: 32,
        height: 32,
        border: "1px solid",
        borderColor: theme.palette.divider,
        borderBottom: 0,
        borderRadius: 0,
        color: theme.palette.grey[700],
        backgroundColor: theme.palette.grey[100],
        padding: 0,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
        "&:first-of-type": {
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
        },
        "&:last-of-type": {
            borderBottom: "1px solid",
            borderBottomColor: theme.palette.divider,
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 3,
        },
    },
}));
// Debounced function fixes the problem of maximizing window or opening a console,
// when map was not resized initially.
const resizeAndFit = debounce((map, bbox) => {
    map.resize();
    map.fitBounds(bbox, { duration: 0 });
}, 0);
export const MapComponent = ({ limits, customLayers, value, }) => {
    var _a, _b, _c;
    const classes = useStyles();
    const locale = useLocale();
    const { wmsEndpoints, wmtsEndpoints } = useMemo(() => {
        const wmsCustomLayers = getWMSCustomLayers(customLayers);
        const wmtsCustomLayers = getWMTSCustomLayers(customLayers);
        return {
            wmsEndpoints: uniq(wmsCustomLayers.map((x) => { var _a; return (_a = x.endpoint) !== null && _a !== void 0 ? _a : DEFAULT_WMS_URL; })),
            wmtsEndpoints: uniq(wmtsCustomLayers.map((x) => { var _a; return (_a = x.endpoint) !== null && _a !== void 0 ? _a : DEFAULT_WMTS_URL; })),
        };
    }, [customLayers]);
    const { data: groupedLayers } = useWMTSorWMSLayers([
        ...wmsEndpoints,
        ...wmtsEndpoints,
    ]);
    const { byKey: layersByKey } = groupedLayers !== null && groupedLayers !== void 0 ? groupedLayers : {
        wms: [],
        wmts: [],
    };
    const attribution = useMemo(() => {
        const attributions = customLayers.map((layer) => { var _a; return (_a = layersByKey === null || layersByKey === void 0 ? void 0 : layersByKey[getLayerKey(layer)]) === null || _a === void 0 ? void 0 : _a.attribution; });
        return Array.from(new Set(attributions)).join(", ");
    }, [customLayers, layersByKey]);
    const { behindAreaCustomLayers, afterAreaCustomLayers } = useMemo(() => {
        const getDeckGLLayerBefore = (customLayer, beforeId) => {
            const layer = layersByKey === null || layersByKey === void 0 ? void 0 : layersByKey[getLayerKey(customLayer)];
            switch (customLayer.type) {
                case "wms":
                    return getWMSTile({
                        wmsLayer: layer,
                        customLayer,
                        beforeId,
                    });
                case "wmts":
                    return getWMTSTile({
                        wmtsLayer: layer,
                        customLayer,
                        beforeId,
                        value,
                    });
                default:
                    const _exhaustiveCheck = customLayer;
                    return _exhaustiveCheck;
            }
        };
        return {
            behindAreaCustomLayers: customLayers
                .filter((customLayer) => customLayer.isBehindAreaLayer)
                .map((l) => getDeckGLLayerBefore(l, "areaLayer")),
            afterAreaCustomLayers: customLayers
                .filter((customLayer) => !customLayer.isBehindAreaLayer)
                .map((l) => getDeckGLLayerBefore(l)),
        };
    }, [customLayers, layersByKey, value]);
    const [interaction, dispatchInteraction] = useInteraction();
    const [, setMapTooltipType] = useMapTooltip();
    const { showBaseLayer, locked, features, identicalLayerComponentIds, areaLayer, symbolLayer, bounds: { width, height }, lockedBBox, featuresBBox, } = useChartState();
    const { defaultViewState, viewState, onViewStateChange } = useViewState({
        width,
        height,
        lockedBBox,
        featuresBBox,
    });
    const lockedRef = useRef(locked);
    useEffect(() => {
        lockedRef.current = locked;
    }, [locked]);
    // Resets the map to its default state (showing all visible features).
    const reset = useEvent(() => {
        var _a;
        // Reset the map only when it's in an unlocked mode.
        if (!lockedRef.current) {
            const { longitude, latitude, zoom } = defaultViewState;
            const newViewState = {
                center: [longitude, latitude],
                zoom,
                duration: RESET_DURATION,
                essential: true,
            };
            (_a = getMap()) === null || _a === void 0 ? void 0 : _a.flyTo(newViewState);
        }
    });
    // Reset the view when default view changes (new features appeared on the map).
    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultViewState]);
    const zoomIn = useEvent(() => {
        var _a;
        const newViewState = {
            center: [viewState.longitude, viewState.latitude],
            zoom: Math.min(viewState.zoom + 1, BASE_VIEW_STATE.maxZoom),
            duration: FLY_TO_DURATION,
            essential: true,
        };
        (_a = getMap()) === null || _a === void 0 ? void 0 : _a.flyTo(newViewState);
    });
    const zoomOut = useEvent(() => {
        var _a;
        const newViewState = {
            center: [viewState.longitude, viewState.latitude],
            zoom: Math.max(viewState.zoom - 1, BASE_VIEW_STATE.minZoom),
            duration: FLY_TO_DURATION,
            essential: true,
        };
        (_a = getMap()) === null || _a === void 0 ? void 0 : _a.flyTo(newViewState);
    });
    const mapStyle = useMapStyle({
        locale,
        showBaseLayer,
        showLabels: !areaLayer,
    });
    const onHover = useEvent(({ type, x, y, object, }) => {
        if (object) {
            const { observation } = object.properties;
            setMapTooltipType(type);
            dispatchInteraction({
                type: "INTERACTION_UPDATE",
                value: {
                    type: "tooltip",
                    visible: true,
                    observation,
                    mouse: { x, y },
                },
            });
        }
        else {
            dispatchInteraction({
                type: "INTERACTION_HIDE",
            });
        }
    });
    const sortedShapes = useMemo(() => {
        var _a, _b, _c;
        // Sort for smaller shapes to be over larger ones, to be able to use tooltip
        const sortedFeatures = orderBy((_b = (_a = features.areaLayer) === null || _a === void 0 ? void 0 : _a.shapes) === null || _b === void 0 ? void 0 : _b.features, geoArea, "desc");
        return {
            ...(_c = features.areaLayer) === null || _c === void 0 ? void 0 : _c.shapes,
            features: sortedFeatures,
        };
    }, [(_a = features.areaLayer) === null || _a === void 0 ? void 0 : _a.shapes]);
    const geoJsonLayer = useMemo(() => {
        if (!(areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.colors)) {
            return;
        }
        const getFillColor = (d) => {
            const { observation } = d.properties;
            if (observation) {
                const value = areaLayer.colors.getValue(observation);
                if (value !== null) {
                    return areaLayer.colors.getColor(observation);
                }
            }
            return DEFAULT_COLOR;
        };
        return new GeoJsonLayer({
            id: "areaLayer",
            beforeId: showBaseLayer ? "water_polygon" : undefined,
            // @ts-ignore this is correct
            data: sortedShapes,
            pickable: true,
            parameters: {
                /**
                 * Fixes hover on overlapping layers
                 * @see https://deck.gl/docs/developer-guide/tips-and-tricks#z-fighting-and-depth-testing
                 */
                depthTest: false,
            },
            extruded: false,
            filled: true,
            stroked: true,
            lineWidthMinPixels: 0.8,
            getLineColor: [255, 255, 255],
            // @ts-ignore
            getFillColor,
            onHover: ({ x, y, object, }) => onHover({ type: "area", x, y, object }),
            updateTriggers: {
                getFillColor,
            },
        });
    }, [areaLayer === null || areaLayer === void 0 ? void 0 : areaLayer.colors, sortedShapes, onHover, showBaseLayer]);
    const hoverLayer = useMemo(() => {
        var _a;
        if (!interaction.visible || !sortedShapes || !areaLayer) {
            return;
        }
        const shape = sortedShapes.features.find((d) => d.properties.observation === interaction.observation);
        if (shape) {
            const getFillColor = (d) => {
                const { observation } = d.properties;
                if (observation) {
                    const value = areaLayer.colors.getValue(observation);
                    if (value !== null) {
                        return areaLayer.colors.getColor(observation);
                    }
                }
                return DEFAULT_COLOR;
            };
            return new GeoJsonLayer({
                id: "hoverLayer",
                beforeId: afterAreaCustomLayers.length
                    ? (_a = afterAreaCustomLayers[0]) === null || _a === void 0 ? void 0 : _a.props.id
                    : undefined,
                // @ts-ignore
                data: shape,
                filled: true,
                stroked: true,
                lineWidthMinPixels: 2,
                // @ts-ignore
                getFillColor,
            });
        }
    }, [
        afterAreaCustomLayers,
        areaLayer,
        interaction.observation,
        interaction.visible,
        sortedShapes,
    ]);
    const scatterplotLayers = useMemo(() => {
        var _a;
        if (!symbolLayer) {
            return [];
        }
        const getFillColor = ({ properties: { observation } }) => {
            if (observation) {
                return symbolLayer.colors.getColor(observation);
            }
            return DEFAULT_COLOR;
        };
        const getPosition = ({ coordinates }) => {
            return coordinates;
        };
        const getRadius = ({ properties: { observation } }) => {
            var _a;
            const value = observation ? symbolLayer.getValue(observation) : null;
            // @ts-ignore - value can be undefined, D3 types are wrong here
            const radius = (_a = symbolLayer.radiusScale(value)) !== null && _a !== void 0 ? _a : 0;
            return radius;
        };
        const [radiusMinPixels, radiusMaxPixels] = symbolLayer.radiusScale.range();
        const data = (_a = features.symbolLayer) === null || _a === void 0 ? void 0 : _a.points;
        const sortedData = data ? orderBy(data, getRadius, "desc") : [];
        return [
            new ScatterplotLayer({
                id: "symbolLayer",
                pickable: identicalLayerComponentIds ? !areaLayer : true,
                autoHighlight: true,
                filled: true,
                stroked: true,
                lineWidthMinPixels: 0.8,
                data: sortedData,
                getPosition,
                getRadius,
                radiusUnits: "pixels",
                radiusMinPixels,
                radiusMaxPixels,
                // @ts-ignore
                getFillColor,
                onHover: ({ x, y, object, }) => onHover({ type: "symbol", x, y, object }),
                updateTriggers: {
                    getFillColor,
                    getPosition,
                    getRadius,
                    onHover,
                },
            }),
            ...limits.limits.map((limit, i) => {
                const { configLimit, measureLimit } = limit;
                const rgba = hexToRgba(configLimit.color);
                const baseLayerProps = {
                    filled: false,
                    stroked: true,
                    getLineColor: [rgba.r, rgba.g, rgba.b, 255],
                    lineWidthMinPixels: 0.8,
                    data: sortedData,
                    getPosition,
                    radiusUnits: "pixels",
                };
                const mkGetLimitRadius = (value) => ({ properties: { observation } }) => {
                    return observation ? symbolLayer.radiusScale(value) : 0;
                };
                switch (measureLimit.type) {
                    case "single":
                        return [
                            new DashedScatterplotLayer({
                                id: `symbolLayerLimit-${i}`,
                                getRadius: mkGetLimitRadius(measureLimit.value),
                                ...baseLayerProps,
                            }),
                        ];
                    case "value-range":
                        return [
                            new DashedScatterplotLayer({
                                id: `symbolLayerLimit-${i}-from`,
                                getRadius: mkGetLimitRadius(measureLimit.min),
                                ...baseLayerProps,
                            }),
                            new DashedScatterplotLayer({
                                id: `symbolLayerLimit-${i}-to`,
                                getRadius: mkGetLimitRadius(measureLimit.max),
                                ...baseLayerProps,
                            }),
                        ];
                    case "time-range":
                        return [
                            new DashedScatterplotLayer({
                                id: `symbolLayerLimit-${i}`,
                                getRadius: mkGetLimitRadius(measureLimit.value),
                                ...baseLayerProps,
                            }),
                        ];
                    default:
                        const _exhaustiveCheck = measureLimit;
                        return _exhaustiveCheck;
                }
            }),
        ];
    }, [
        limits,
        areaLayer,
        features.symbolLayer,
        identicalLayerComponentIds,
        onHover,
        symbolLayer,
    ]);
    const dataLoaded = (_c = (_b = features.areaLayer) !== null && _b !== void 0 ? _b : features.symbolLayer) !== null && _c !== void 0 ? _c : 
    // Raw map without data layers.
    (areaLayer === undefined && symbolLayer === undefined);
    const redrawMap = useEvent(() => {
        const map = getMap();
        if (!map) {
            return;
        }
        const bbox = lockedBBox !== null && lockedBBox !== void 0 ? lockedBBox : map.getBounds().toArray();
        resizeAndFit(map, bbox);
    });
    const handleResize = useEvent((e) => {
        if (e.originalEvent) {
            redrawMap();
        }
    });
    const [loaded, setLoaded] = useState(false);
    return (<>
      {locked ? null : (<div className={classes.controlButtons} {...DISABLE_SCREENSHOT_ATTR}>
          <ControlButton iconName="refresh" onClick={reset}/>
          <ControlButton iconName="plus" onClick={zoomIn}/>
          <ControlButton iconName="minus" onClick={zoomOut}/>
        </div>)}

      {dataLoaded && width > 1 && height > 1 ? (<Map initialViewState={defaultViewState} mapLib={maplibregl} mapStyle={mapStyle} 
        // Important so we can take a screenshot of the map
        preserveDrawingBuffer style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
            }} dragPan={!locked} scrollZoom={!locked} doubleClickZoom={!locked} dragRotate={false} touchZoomRotate={!locked} onData={(e) => {
                if (e.dataType === "source" && !e.isSourceLoaded) {
                    setLoaded(false);
                }
            }} onIdle={() => {
                setLoaded(true);
            }} onRemove={() => {
                setLoaded(false);
                setMap(null);
            }} onLoad={(e) => {
                setMap(e.target);
                /**
                 * Redraw the map on load, when style data has been downloaded
                 * to solve an offset problem between the viz layer and the base layer
                 * happening in Edge under precise conditions (Windows 10, Edge 105,
                 * resolution 1440x900).
                 */
                redrawMap();
            }} onMove={onViewStateChange} onResize={handleResize} attributionControl={false} {...viewState}>
          <div data-map-loaded={loaded}/>
          <DeckGLOverlay interleaved layers={[
                ...behindAreaCustomLayers,
                geoJsonLayer,
                hoverLayer,
                ...afterAreaCustomLayers,
                ...scatterplotLayers,
            ]}/>
          <CustomAttribution attribution={attribution}/>
        </Map>) : null}
    </>);
};
const ControlButton = ({ iconName, onClick, }) => {
    const classes = useStyles();
    return (<Button className={classes.controlButton} variant="contained" onClick={onClick}>
      <Icon name={iconName} size={24}/>
    </Button>);
};
