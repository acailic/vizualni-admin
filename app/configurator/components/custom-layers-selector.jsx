import { DragDropContext, Draggable, Droppable, } from "@hello-pangea/dnd";
import { t, Trans } from "@lingui/macro";
import { Box, Button, IconButton, Typography, useEventCallback, } from "@mui/material";
import uniq from "lodash/uniq";
import { useCallback, useMemo, useState } from "react";
import { getLayerKey, makeKey, useWMTSorWMSLayers, } from "@/charts/map/wms-wmts-endpoint-utils";
import { WMTSSelector } from "@/charts/map/wms-wmts-selector";
import { Switch } from "@/components/form";
import { MoveDragButton } from "@/components/move-drag-button";
import { getChartConfig } from "@/config-utils";
import { ControlSection, ControlSectionContent, ControlSectionSkeleton, SectionTitle, useSectionTitleStyles, } from "@/configurator/components/chart-controls/section";
import { ConfiguratorDrawer } from "@/configurator/components/drawers";
import { isConfiguring, useConfiguratorState, } from "@/configurator/configurator-state";
import { truthy } from "@/domain/types";
import { Icon } from "@/icons";
const LeftDrawer = ({ children, open, onClose, onExited, }) => {
    return (<ConfiguratorDrawer anchor="left" open={open} variant="temporary" onClose={onClose} SlideProps={{
            onExited: onExited,
        }} hideBackdrop>
      {children}
    </ConfiguratorDrawer>);
};
export const CustomLayersSelector = () => {
    const [state, dispatch] = useConfiguratorState(isConfiguring);
    const chartConfig = getChartConfig(state);
    const configLayers = chartConfig.baseLayer.customLayers;
    const endpoints = useMemo(() => {
        return uniq(configLayers.map((layer) => layer.endpoint)).filter(truthy);
    }, [configLayers]);
    const { data: groupedLayers, error, status: layersStatus, } = useWMTSorWMSLayers(endpoints);
    const { wms: wmsLayers, wmts: wmtsLayers, byKey: layersByKey, } = groupedLayers;
    const handleDragEnd = useEventCallback((e) => {
        var _a;
        const oldIndex = e.source.index;
        const newIndex = (_a = e.destination) === null || _a === void 0 ? void 0 : _a.index;
        if (typeof newIndex !== "number" || e.source === e.destination) {
            return;
        }
        dispatch({
            type: "CUSTOM_LAYER_SWAP",
            value: {
                oldIndex: configLayers.length - 1 - oldIndex,
                newIndex: configLayers.length - 1 - newIndex,
            },
        });
    });
    const handleCheckLayer = useCallback((layer, checked) => {
        const valueType = layer === null || layer === void 0 ? void 0 : layer.type;
        if (!valueType) {
            return;
        }
        if (!checked) {
            dispatch({
                type: "CUSTOM_LAYER_REMOVE",
                value: {
                    type: valueType,
                    id: layer.id,
                },
            });
            return;
        }
        else {
            switch (valueType) {
                case "wms":
                    dispatch({
                        type: "CUSTOM_LAYER_ADD",
                        value: {
                            layer: {
                                type: "wms",
                                id: layer.id,
                                isBehindAreaLayer: false,
                                syncTemporalFilters: false,
                                endpoint: layer.endpoint,
                            },
                        },
                    });
                    break;
                case "wmts":
                    dispatch({
                        type: "CUSTOM_LAYER_ADD",
                        value: {
                            layer: {
                                type: "wmts",
                                id: layer.id,
                                url: layer.url,
                                isBehindAreaLayer: false,
                                syncTemporalFilters: false,
                                endpoint: layer.endpoint,
                            },
                        },
                    });
                    break;
                default:
                    const _exhaustiveCheck = valueType;
                    return _exhaustiveCheck;
            }
        }
    }, [dispatch]);
    const [addingLayer, setAddingLayer] = useState(false);
    const getParsedLayer = useMemo(() => {
        return (configLayer) => {
            const key = getLayerKey(configLayer);
            return layersByKey[key];
        };
    }, [layersByKey]);
    const sectionTitleClasses = useSectionTitleStyles({
        sectionOpen: true,
        interactive: true,
    });
    const selectedLayers = useMemo(() => {
        return configLayers.map((layer) => {
            return makeKey(layer);
        });
    }, [configLayers]);
    const handleLayerCheck = useCallback((layer, checked) => {
        return handleCheckLayer(layer, checked);
    }, [handleCheckLayer]);
    return error ? (<Typography mx={2} color="error">
      {error.message}
    </Typography>) : !wmsLayers || !wmtsLayers ? (<ControlSectionSkeleton />) : (<ControlSection hideTopBorder>
      <SectionTitle closable>
        <Trans id="chart.map.layers.custom-layers">Import map</Trans>
      </SectionTitle>
      <LeftDrawer open={addingLayer} onClose={() => setAddingLayer(false)}>
        <div>
          <div className={sectionTitleClasses.root} onClick={() => setAddingLayer(false)}>
            <Typography variant="h6" className={sectionTitleClasses.text}>
              <Icon name="chevronLeft"/>
              <Trans id="wmts.custom-layer.section-title">
                Add custom layer
              </Trans>
            </Typography>
          </div>
        </div>
        <Box px={4}>
          {addingLayer ? (<WMTSSelector onLayerCheck={handleLayerCheck} selected={selectedLayers}/>) : null}
        </Box>
      </LeftDrawer>
      <ControlSectionContent gap="lg">
        {configLayers.length === 0 && (<Typography variant="body2" color="text.secondary">
            <Trans id="chart.map.layers.no-layers">No imported maps</Trans>
          </Typography>)}

        {layersStatus === "success" ? (<DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="layers">
              {(provided) => (<div {...provided.droppableProps} ref={provided.innerRef}>
                  {[...configLayers].reverse().map((configLayer, i) => {
                    return (<DraggableLayer key={`${configLayer.type}-${configLayer.id}`} configLayer={configLayer} parsedLayer={getParsedLayer(configLayer)} index={i}/>);
                })}
                  {provided.placeholder}
                </div>)}
            </Droppable>
          </DragDropContext>) : null}

        {layersStatus === "fetching" ? (<div style={{ width: "100%" }}>
            <ControlSectionSkeleton />
          </div>) : null}

        <div>
          <Button variant="contained" onClick={() => setAddingLayer(true)}>
            <Trans id="chart.map.layers.add-layer">Add map</Trans>
          </Button>
        </div>
      </ControlSectionContent>
    </ControlSection>);
};
const DraggableLayer = ({ configLayer, index, parsedLayer, }) => {
    const [_, dispatch] = useConfiguratorState(isConfiguring);
    const value = configLayer.id;
    const enableTemporalFiltering = useMemo(() => {
        switch (configLayer.type) {
            case "wms":
                return false;
            case "wmts":
                return ((parsedLayer === null || parsedLayer === void 0 ? void 0 : parsedLayer.availableDimensionValues) &&
                    parsedLayer.availableDimensionValues.length > 1);
            default:
                const _exhaustiveCheck = configLayer;
                return _exhaustiveCheck;
        }
    }, [configLayer, parsedLayer === null || parsedLayer === void 0 ? void 0 : parsedLayer.availableDimensionValues]);
    const handleRemoveClick = () => {
        dispatch({
            type: "CUSTOM_LAYER_REMOVE",
            value: {
                type: configLayer.type,
                id: configLayer.id,
            },
        });
    };
    return (<Draggable key={value} draggableId={value} index={index}>
      {(provided) => {
            var _a;
            return (<Box ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} sx={{ mb: 3 }}>
          <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {(_a = parsedLayer === null || parsedLayer === void 0 ? void 0 : parsedLayer.title) !== null && _a !== void 0 ? _a : "Unknown layer"}
            </Typography>
            <IconButton onClick={handleRemoveClick}>
              <Icon name="trash"/>
            </IconButton>
            <MoveDragButton />
          </Box>
          <Box display="flex" flexDirection="column" width="100%" gap={1}>
            <Switch label={t({
                    id: "chart.map.layers.base.behind-area-layer",
                    message: "Behind area layer",
                })} checked={configLayer.isBehindAreaLayer} onChange={(e) => {
                    dispatch({
                        type: "CUSTOM_LAYER_UPDATE",
                        value: {
                            layer: {
                                ...configLayer,
                                isBehindAreaLayer: e.target.checked,
                            },
                        },
                    });
                }}/>
            {configLayer.type === "wmts" ? (<Switch label={t({
                        id: "chart.map.layers.base.enable-temporal-filtering",
                        message: "Sync with temporal filters",
                    })} checked={configLayer.syncTemporalFilters} disabled={!enableTemporalFiltering} onChange={(e) => {
                        dispatch({
                            type: "CUSTOM_LAYER_UPDATE",
                            value: {
                                layer: {
                                    ...configLayer,
                                    syncTemporalFilters: e.target.checked,
                                },
                            },
                        });
                    }}/>) : null}
          </Box>
        </Box>);
        }}
    </Draggable>);
};
