import { Trans } from "@lingui/macro";
import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogActions, DialogContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, } from "@mui/material";
import clsx from "clsx";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import { useEffect, useMemo, useState } from "react";
import { FirstTenRowsCaption } from "@/browse/ui/first-ten-rows-caption";
import { Error as ErrorHint, Loading } from "@/components/hint";
import { Tag } from "@/components/tag";
import { useStyles } from "@/configurator/components/add-dataset-drawer/use-styles";
import { isJoinByComponent, isStandardErrorDimension, } from "@/domain/data";
import { useDataCubesMetadataQuery, useDataCubesObservationsQuery, } from "@/graphql/hooks";
import { getCubeFiltersFromVersionedJoinBy, joinDimensions, } from "@/graphql/join";
import { useDataCubeComponentsQuery, } from "@/graphql/query-hooks";
import { useLocale } from "@/locales/use-locale";
const NewAnnotation = (props) => {
    const classes = useStyles();
    return (<Typography className={clsx(classes.newAnnotation, props.className)} lineHeight={1} variant="caption" {...props}>
      <Trans id="dataset.search.preview.new-dimension">New</Trans>
    </Typography>);
};
export const PreviewDataTable = ({ chartConfig, dataSource, existingCubes, currentComponents, inferredJoinBy, otherCube, onClickBack, onConfirm, addingDataset, }) => {
    var _a, _b, _c, _d;
    const locale = useLocale();
    const commonQueryVariables = {
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
        locale,
    };
    const [otherCubeComponentsQuery] = useDataCubeComponentsQuery({
        variables: {
            ...commonQueryVariables,
            cubeFilter: { iri: otherCube.iri },
        },
        pause: !otherCube,
    });
    const otherCubeComponents = (_a = otherCubeComponentsQuery.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponents;
    const isFetchingComponents = otherCubeComponentsQuery.fetching;
    const isQueryPaused = !otherCubeComponents || !currentComponents;
    const cubeFilters = getCubeFiltersFromVersionedJoinBy(inferredJoinBy);
    const [observations] = useDataCubesObservationsQuery({
        chartConfig,
        variables: {
            locale,
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            cubeFilters,
        },
        pause: isQueryPaused,
    });
    const [currentCubes] = useDataCubesMetadataQuery({
        variables: {
            sourceType: dataSource.type,
            sourceUrl: dataSource.url,
            locale: locale,
            cubeFilters: existingCubes.map((cube) => ({ iri: cube.iri })),
        },
    });
    const isFetching = isFetchingComponents || observations.fetching || currentCubes.fetching;
    const allColumns = useMemo(() => {
        var _a, _b, _c, _d;
        const shouldIncludeColumnInPreview = (d) => !isStandardErrorDimension(d);
        const currentDimensions = ((_a = currentComponents === null || currentComponents === void 0 ? void 0 : currentComponents.dimensions) !== null && _a !== void 0 ? _a : []).filter((x) => shouldIncludeColumnInPreview(x));
        const currentMeasures = ((_b = currentComponents === null || currentComponents === void 0 ? void 0 : currentComponents.measures) !== null && _b !== void 0 ? _b : []).filter((x) => shouldIncludeColumnInPreview(x));
        const otherDimensions = ((_c = otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.dimensions) !== null && _c !== void 0 ? _c : []).filter((x) => shouldIncludeColumnInPreview(x));
        const otherMeasures = ((_d = otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.measures) !== null && _d !== void 0 ? _d : []).filter((x) => shouldIncludeColumnInPreview(x));
        const joinedColumns = joinDimensions({
            dimensions: [...currentDimensions, ...otherDimensions],
            joinBy: inferredJoinBy,
        });
        const { join: joinedJoinDimensions = [], other: joinedOtherDimensions = [], current: joinedCurrentDimensions = [], } = groupBy(joinedColumns, (d) => {
            const isJoinBy = isJoinByComponent(d);
            return isJoinBy
                ? "join"
                : d.cubeIri === otherCube.iri
                    ? "other"
                    : "current";
        });
        return [
            ...joinedJoinDimensions,
            ...joinedOtherDimensions,
            ...otherMeasures,
            ...joinedCurrentDimensions,
            ...currentMeasures,
        ];
    }, [
        currentComponents === null || currentComponents === void 0 ? void 0 : currentComponents.dimensions,
        currentComponents === null || currentComponents === void 0 ? void 0 : currentComponents.measures,
        inferredJoinBy,
        otherCube.iri,
        otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.dimensions,
        otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.measures,
    ]);
    const [selectedColumnsRaw, setSelectedColumns] = useState(undefined);
    useEffect(() => {
        if ((otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.dimensions) &&
            otherCubeComponents.measures &&
            selectedColumnsRaw === undefined) {
            setSelectedColumns(allColumns.map((x) => x.id));
        }
    }, [
        allColumns,
        otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.dimensions,
        otherCubeComponents === null || otherCubeComponents === void 0 ? void 0 : otherCubeComponents.measures,
        selectedColumnsRaw,
    ]);
    const selectedColumns = useMemo(() => selectedColumnsRaw !== null && selectedColumnsRaw !== void 0 ? selectedColumnsRaw : [], [selectedColumnsRaw]);
    const selectedColumnsById = useMemo(() => Object.fromEntries(selectedColumns.map((x) => [x, true])), [selectedColumns]);
    const previewObservations = useMemo(() => {
        var _a, _b;
        const data = (_b = (_a = observations.data) === null || _a === void 0 ? void 0 : _a.dataCubesObservations.data) !== null && _b !== void 0 ? _b : [];
        const bestObservation = maxBy(data, (obs) => {
            return allColumns.reduce((acc, dim) => acc + (obs[dim.id] ? 1 : 0), 0);
        });
        const amount = 8;
        const index = bestObservation ? data.indexOf(bestObservation) : 0;
        const clampedIndex = Math.max(0, Math.min(index, data.length - amount));
        return data.slice(clampedIndex, clampedIndex + amount);
    }, [allColumns, (_b = observations.data) === null || _b === void 0 ? void 0 : _b.dataCubesObservations.data]);
    return (<>
      <DialogContent sx={{ overflowX: "hidden" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Typography variant="h2">
            <Trans id="dataset.search.preview.title">
              Review available dimensions
            </Trans>
          </Typography>
          <Typography variant="body1">
            <Trans id="dataset.search.preview.description">
              Review all available dimensions before continuing to edit your
              visualization.
            </Trans>
          </Typography>
          <div>
            <Typography variant="h6" mb={1}>
              <Trans id="dataset.search.preview.datasets">Datasets</Trans>
            </Typography>
            <Stack direction="column" spacing={1}>
              <Typography variant="caption">
                {(_c = currentCubes.data) === null || _c === void 0 ? void 0 : _c.dataCubesMetadata.map((metadata) => metadata.title).join(", ")}
              </Typography>
              <div>
                <NewAnnotation />
                <br />
                <Typography variant="caption" mt={-1} component="div">
                  {otherCube.title}
                </Typography>
              </div>
            </Stack>
          </div>
          {isFetching ? <Loading delayMs={0}/> : null}
          {observations.error ? (<ErrorHint>
              <Box component="details" sx={{ width: "100%", cursor: "pointer" }}>
                <summary>{observations.error.name}</summary>
                {observations.error.message}
              </Box>
            </ErrorHint>) : null}
        </Box>
        {otherCubeComponents ? (<>
            {((_d = observations.data) === null || _d === void 0 ? void 0 : _d.dataCubesObservations) ? (<Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 2,
                }}>
                <Box sx={{
                    overflowX: "scroll",
                    width: "100%",
                    mt: 6,
                    mb: 4,
                    boxShadow: 4,
                }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {allColumns.map((column) => !!selectedColumnsById[column.id] ? (<TableCell key={column.id} sx={{ minWidth: 200, maxWidth: 300 }}>
                              {column.cubeIri === otherCube.iri && (<NewAnnotation />)}
                              {isJoinByComponent(column) ? (<>
                                  <Tooltip arrow title={<>
                                        {column.originalIds
                                .map((o) => o.description)
                                .join(", ")}
                                      </>} placement="right">
                                    <Tag type="dimension">Joined</Tag>
                                  </Tooltip>
                                </>) : null}
                              <br />
                              <Typography variant="h5">
                                {column.label}
                              </Typography>
                            </TableCell>) : null)}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewObservations.map((observation, index) => (<TableRow key={index}>
                          {allColumns.map((column) => !!selectedColumnsById[column.id] ? (<TableCell key={column.id}>
                                {observation[column.id]}
                              </TableCell>) : null)}
                        </TableRow>))}
                    </TableBody>
                  </Table>
                </Box>
                <FirstTenRowsCaption />
              </Box>) : null}
          </>) : null}
      </DialogContent>
      <DialogActions sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
            px: 4,
            pt: "0 !important",
            pb: "2rem !important",
        }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={onClickBack}>
            <Trans id="button.back">Back</Trans>
          </Button>
          <LoadingButton loading={addingDataset} variant="contained" onClick={onConfirm}>
            <Trans id="button.confirm">Confirm</Trans>
          </LoadingButton>
        </Box>
      </DialogActions>
    </>);
};
