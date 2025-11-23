import { Box } from "@mui/material";
import { memo, useCallback, useMemo } from "react";
import { ChartDataWrapper } from "@/charts/chart-data-wrapper";
import { shouldRenderMap } from "@/charts/map/helpers";
import { MapComponent } from "@/charts/map/map";
import { MapCustomLayersLegend } from "@/charts/map/map-custom-layers-legend";
import { MapLegend } from "@/charts/map/map-legend";
import { MapChart } from "@/charts/map/map-state";
import { MapTooltip } from "@/charts/map/map-tooltip";
import { ChartContainer, ChartControlsContainer, } from "@/charts/shared/containers";
import { NoGeometriesHint } from "@/components/hint";
import { useChartConfigFilters, useDefinitiveTemporalFilterValue, useLimits, } from "@/config-utils";
import { TimeSlider } from "@/configurator/interactive-filters/time-slider";
import { dimensionValuesToGeoCoordinates, } from "@/domain/data";
import { useDataCubesComponentsQuery } from "@/graphql/hooks";
import { getResolvedJoinById, isJoinById } from "@/graphql/join";
import { useDataCubeDimensionGeoShapesQuery } from "@/graphql/query-hooks";
import { useLocale } from "@/locales/use-locale";
export const ChartMapVisualization = (props) => {
    var _a, _b, _c;
    const { dataSource, chartConfig, componentIds } = props;
    const { fields } = chartConfig;
    const locale = useLocale();
    const [componentsQuery] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilters: chartConfig.cubes.map((cube) => ({
                iri: cube.iri,
                componentIds,
                joinBy: cube.joinBy,
                loadValues: true,
            })),
        },
        keepPreviousData: true,
    });
    const getLayerIds = useCallback((layer) => {
        var _a, _b, _c;
        const layerComponent = fields[layer];
        if (layerComponent) {
            const cubeIri = (_b = (_a = componentsQuery.data) === null || _a === void 0 ? void 0 : _a.dataCubesComponents.dimensions.find((d) => d.id === layerComponent.componentId)) === null || _b === void 0 ? void 0 : _b.cubeIri;
            const cube = chartConfig.cubes.find((c) => c.iri === cubeIri);
            if (isJoinById(layerComponent.componentId)) {
                return {
                    dimensionId: (_c = getResolvedJoinById(cube, layerComponent.componentId)) !== null && _c !== void 0 ? _c : layerComponent.componentId,
                    cubeIri: cube.iri,
                };
            }
            else {
                return {
                    dimensionId: layerComponent.componentId,
                    cubeIri,
                };
            }
        }
        return {
            dimensionId: "",
            cubeIri: chartConfig.cubes[0].iri,
        };
    }, [chartConfig.cubes, componentsQuery.data, fields]);
    const { dimensionId: areaDimensionId, cubeIri: areaCubeIri } = useMemo(() => getLayerIds("areaLayer"), [getLayerIds]);
    const { dimensionId: symbolDimensionId, cubeIri: symbolCubeIri } = useMemo(() => getLayerIds("symbolLayer"), [getLayerIds]);
    const [{ data: geoCoordinatesDimension, error: geoCoordinatesDimensionError, fetching: fetchingGeoCoordinatesDimension, },] = useDataCubesComponentsQuery({
        chartConfig,
        variables: {
            cubeFilters: [
                {
                    iri: symbolCubeIri,
                    componentIds: [symbolDimensionId],
                    loadValues: true,
                },
            ],
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
        },
        pause: !symbolDimensionId || !symbolCubeIri,
    });
    const geoCoordinatesDimensionValues = geoCoordinatesDimension === null || geoCoordinatesDimension === void 0 ? void 0 : geoCoordinatesDimension.dataCubesComponents.dimensions[0].values;
    const coordinates = useMemo(() => {
        return geoCoordinatesDimensionValues
            ? dimensionValuesToGeoCoordinates(geoCoordinatesDimensionValues)
            : undefined;
    }, [geoCoordinatesDimensionValues]);
    const geoShapesId = areaDimensionId || symbolDimensionId;
    const [{ data: fetchedGeoShapes, error: geoShapesError, fetching: fetchingGeoShapes, },] = useDataCubeDimensionGeoShapesQuery({
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale,
            cubeFilter: {
                iri: areaCubeIri,
                dimensionId: geoShapesId,
            },
        },
        pause: !geoShapesId || !areaCubeIri,
    });
    const shapes = fetchedGeoShapes === null || fetchedGeoShapes === void 0 ? void 0 : fetchedGeoShapes.dataCubeDimensionGeoShapes;
    const geometries = (_c = (_b = (_a = shapes === null || shapes === void 0 ? void 0 : shapes.topology) === null || _a === void 0 ? void 0 : _a.objects) === null || _b === void 0 ? void 0 : _b.shapes) === null || _c === void 0 ? void 0 : _c.geometries;
    const ready = shouldRenderMap({
        areaDimensionId,
        symbolDimensionId,
        geometries,
        coordinates,
    });
    const error = geoCoordinatesDimensionError || geoShapesError;
    const fetching = fetchingGeoCoordinatesDimension || fetchingGeoShapes;
    const displayNoDataError = ready &&
        (areaDimensionId === "" ||
            (areaDimensionId !== "" && (geometries === null || geometries === void 0 ? void 0 : geometries.length) === 0)) &&
        (symbolDimensionId === "" ||
            (symbolDimensionId !== "" &&
                (geometries === null || geometries === void 0 ? void 0 : geometries.length) === 0 &&
                (coordinates === null || coordinates === void 0 ? void 0 : coordinates.length) === 0)) &&
        areaDimensionId !== symbolDimensionId;
    return displayNoDataError ? (<NoGeometriesHint />) : (<ChartDataWrapper {...props} error={error} fetching={fetching} Component={ChartMap} ComponentProps={{ shapes, coordinates }}/>);
};
const ChartMap = memo((props) => {
    const { chartConfig, dimensions, measures, observations } = props;
    const { fields } = chartConfig;
    const filters = useChartConfigFilters(chartConfig);
    const temporalFilterValue = useDefinitiveTemporalFilterValue({ dimensions });
    const limits = useLimits({
        chartConfig,
        dimensions,
        measures,
    });
    return (<MapChart {...props}>
      <ChartContainer>
        <MapComponent limits={limits} customLayers={chartConfig.baseLayer.customLayers} value={temporalFilterValue ? +temporalFilterValue : undefined}/>
        <MapTooltip />
      </ChartContainer>
      <ChartControlsContainer sx={{ mt: 6 }}>
        {fields.animation && (<TimeSlider filters={filters} dimensions={dimensions} {...fields.animation}/>)}
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            gap: 4,
            flexWrap: "wrap",
        }}>
          <MapLegend chartConfig={chartConfig} observations={observations} limits={limits.limits}/>
          <MapCustomLayersLegend chartConfig={chartConfig} value={temporalFilterValue ? +temporalFilterValue : undefined}/>
        </Box>
      </ChartControlsContainer>
    </MapChart>);
});
