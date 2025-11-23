import { t, Trans } from "@lingui/macro";
import { Box, Button, ButtonBase, Checkbox, CircularProgress, Collapse, DialogContent, DialogTitle, Divider, Grow, IconButton, Input, ListItemText, MenuItem, Select, Typography, useEventCallback, } from "@mui/material";
import groupBy from "lodash/groupBy";
import keyBy from "lodash/keyBy";
import uniq from "lodash/uniq";
import { useEffect, useMemo, useRef, useState, } from "react";
import { DatasetResults } from "@/browse/ui/dataset-results";
import { SearchDatasetDraftsControl } from "@/browse/ui/search-dataset-drafts-control";
import { SearchDatasetResultsCount } from "@/browse/ui/search-dataset-results-count";
import { SearchDatasetSortControl } from "@/browse/ui/search-dataset-sort-control";
import { Flex } from "@/components/flex";
import { Tag } from "@/components/tag";
import { VisuallyHidden } from "@/components/visually-hidden";
import { CautionAlert, useCautionAlert, } from "@/configurator/components/add-dataset-drawer/caution-alert";
import { inferJoinBy } from "@/configurator/components/add-dataset-drawer/infer-join-by";
import { PreviewDataTable } from "@/configurator/components/add-dataset-drawer/preview-table";
import { useAddDataset } from "@/configurator/components/add-dataset-drawer/use-add-dataset";
import { useStyles } from "@/configurator/components/add-dataset-drawer/use-styles";
import { RightDrawer } from "@/configurator/components/drawers";
import { isTemporalDimensionWithTimeUnit, } from "@/domain/data";
import { truthy } from "@/domain/types";
import { useDataCubesComponentsQuery, useDataCubesComponentTermsetsQuery, } from "@/graphql/hooks";
import { parseComponentId } from "@/graphql/make-component-id";
import { SearchCubeFilterType, SearchCubeResultOrder, useSearchCubesQuery, } from "@/graphql/query-hooks";
import { Icon } from "@/icons";
import SvgIcClose from "@/icons/components/IcClose";
import SvgIcInfoCircle from "@/icons/components/IcInfoCircle";
import { useLocale } from "@/locales/use-locale";
import { useEventEmitter } from "@/utils/event-emitter";
const DialogCloseButton = (props) => {
    return (<IconButton {...props} sx={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            ...props.sx,
        }}>
      <SvgIcClose width={24} height={24} fontSize={24}/>
    </IconButton>);
};
const extractSearchOptions = (dimensions, termsets) => {
    var _a;
    const temporalDimensions = (_a = dimensions.filter(isTemporalDimensionWithTimeUnit)) !== null && _a !== void 0 ? _a : [];
    const sharedDimensions = termsets !== null && termsets !== void 0 ? termsets : [];
    const sharedDimensionsByFirstTermset = groupBy(sharedDimensions, (x) => x.termsets[0].iri);
    const sharedDimensionIds = sharedDimensions.map((dim) => dim.iri);
    const sharedDimensionHasBeenAdded = new Set();
    return [
        ...temporalDimensions
            // There are cases, e.g. for AMDP cubes, that a temporal dimension contains
            // termsets (TemporalEntityDimension). When this happens, we prefer to show
            // the dimension as a shared dimension.
            .filter((dim) => !sharedDimensionIds.includes(dim.id))
            .map((x) => {
            var _a;
            return {
                type: "temporal",
                id: x.id,
                originalIds: (_a = x.originalIds) !== null && _a !== void 0 ? _a : [
                    {
                        cubeIri: x.cubeIri,
                        dimensionId: x.id,
                    },
                ],
                label: x.label,
                timeUnit: x.timeUnit,
            };
        }),
        ...sharedDimensions
            .map((x) => {
            const parsedIri = parseComponentId(x.iri);
            const firstTermset = x.termsets[0].iri;
            const hasBeenAdded = sharedDimensionHasBeenAdded.has(firstTermset);
            if (!parsedIri || hasBeenAdded) {
                return;
            }
            sharedDimensionHasBeenAdded.add(firstTermset);
            const allDimensions = sharedDimensionsByFirstTermset[firstTermset];
            const label = allDimensions.map((d) => d.label).join(", ");
            const originalIds = allDimensions.map((ct) => {
                return {
                    cubeIri: ct.cubeIri,
                    dimensionId: ct.iri,
                };
            });
            return {
                type: "shared",
                id: x.iri,
                label: label,
                termsets: x.termsets,
                originalIds,
            };
        })
            .filter(truthy),
    ];
};
const useMergeDatasetsData = ({ state, locale, pause, }) => {
    var _a, _b, _c, _d, _e;
    const commonQueryVariables = {
        sourceType: state.dataSource.type,
        sourceUrl: state.dataSource.url,
        locale,
    };
    const activeChartConfig = state.chartConfigs.find((chartConfig) => chartConfig.key === state.activeChartKey);
    if (!activeChartConfig) {
        throw Error("Could not find active chart config");
    }
    const currentCubes = activeChartConfig.cubes;
    // Getting cube dimensions, to find temporal dimensions
    const [cubesComponentQuery] = useDataCubesComponentsQuery({
        chartConfig: activeChartConfig,
        variables: {
            ...commonQueryVariables,
            cubeFilters: currentCubes.map((cube) => ({
                iri: cube.iri,
                joinBy: cube.joinBy,
            })),
        },
        pause,
    });
    // Getting cube termsets, to then search for cubes with at least one matching termset
    const [cubeComponentTermsets] = useDataCubesComponentTermsetsQuery({
        pause,
        variables: {
            locale,
            sourceType: state.dataSource.type,
            sourceUrl: state.dataSource.url,
            cubeFilters: currentCubes.map((cube) => ({ iri: cube.iri })),
        },
    });
    return {
        components: (_a = cubesComponentQuery.data) === null || _a === void 0 ? void 0 : _a.dataCubesComponents,
        dimensions: (_c = (_b = cubesComponentQuery.data) === null || _b === void 0 ? void 0 : _b.dataCubesComponents.dimensions) !== null && _c !== void 0 ? _c : [],
        termsets: (_e = (_d = cubeComponentTermsets.data) === null || _d === void 0 ? void 0 : _d.dataCubeComponentTermsets) !== null && _e !== void 0 ? _e : [],
        fetching: cubesComponentQuery.fetching || cubeComponentTermsets.fetching,
        ready: cubesComponentQuery.data !== undefined &&
            cubeComponentTermsets.data !== undefined,
    };
};
const isTemporalDimension = (x) => x.type === "temporal";
const isSharedDimension = (x) => x.type === "shared";
export const AddDatasetDrawer = ({ state, ...props }) => {
    var _a;
    const locale = useLocale();
    const classes = useStyles();
    const [query, setQuery] = useState("");
    const [order, setOrder] = useState(SearchCubeResultOrder.Score);
    const [includeDrafts, setIncludeDrafts] = useState(false);
    const activeChartConfig = state.chartConfigs.find((chartConfig) => chartConfig.key === state.activeChartKey);
    if (!activeChartConfig) {
        throw Error("Could not find active chart config");
    }
    const currentCubes = activeChartConfig.cubes;
    const { dimensions, termsets, components, ready: isMergeDatasetDataReady, fetching: isMergeDatasetsDataFetching, } = useMergeDatasetsData({
        state,
        locale,
        pause: !props.open,
    });
    const [otherCube, setOtherCube] = useState();
    const [{ fetching: addingDataset }, { addDataset }] = useAddDataset();
    const { searchDimensionOptions, searchDimensionOptionsById } = useMemo(() => {
        const options = extractSearchOptions(dimensions, termsets);
        return {
            searchDimensionOptions: options,
            searchDimensionOptionsById: keyBy(options, (x) => x.id),
        };
    }, [dimensions, termsets]);
    const [selectedSearchDimensions, setSelectedSearchDimensions] = useState(undefined);
    // Initial setting of the selected search dimensions
    useEffect(() => {
        if (selectedSearchDimensions === undefined && termsets && components) {
            setSelectedSearchDimensions(searchDimensionOptions);
        }
    }, [components, searchDimensionOptions, selectedSearchDimensions, termsets]);
    const selectedSharedDimensions = selectedSearchDimensions === null || selectedSearchDimensions === void 0 ? void 0 : selectedSearchDimensions.filter(isSharedDimension);
    const selectedTemporalDimension = (selectedSearchDimensions !== null && selectedSearchDimensions !== void 0 ? selectedSearchDimensions : []).find(isTemporalDimension);
    const isSearchQueryPaused = !isMergeDatasetDataReady || !(selectedSearchDimensions === null || selectedSearchDimensions === void 0 ? void 0 : selectedSearchDimensions.length);
    const [searchQuery] = useSearchCubesQuery({
        variables: {
            sourceType: state.dataSource.type,
            sourceUrl: state.dataSource.url,
            locale,
            query,
            order,
            includeDrafts,
            fetchDimensionTermsets: true,
            filters: [
                selectedTemporalDimension
                    ? {
                        type: SearchCubeFilterType.TemporalDimension,
                        value: selectedTemporalDimension.timeUnit,
                    }
                    : null,
                selectedSharedDimensions && selectedSharedDimensions.length > 0
                    ? {
                        type: SearchCubeFilterType.DataCubeTermset,
                        value: uniq(selectedSharedDimensions.flatMap((x) => x.termsets.map((x) => x.iri))).join(";"),
                    }
                    : null,
            ].filter(truthy),
        },
        pause: isSearchQueryPaused,
    });
    const rawSearchCubes = useMemo(() => {
        var _a, _b;
        const relevantCubeIris = currentCubes.map((d) => d.iri);
        return ((_b = (_a = searchQuery.data) === null || _a === void 0 ? void 0 : _a.searchCubes.filter((d) => !relevantCubeIris.includes(d.cube.iri))) !== null && _b !== void 0 ? _b : []);
    }, [currentCubes, (_a = searchQuery.data) === null || _a === void 0 ? void 0 : _a.searchCubes]);
    const searchCubes = useMemo(() => {
        if (currentCubes.length === 1) {
            return rawSearchCubes;
        }
        else {
            return rawSearchCubes.filter((result) => {
                var _a;
                const inferred = inferJoinBy(selectedSearchDimensions !== null && selectedSearchDimensions !== void 0 ? selectedSearchDimensions : [], result.cube);
                const resultJoinBy = inferred[result.cube.iri];
                // TODO Verify that this is correct
                // The idea is that we want to be sure that the cube has the same join by dimensions
                // as the other cubes
                return ((_a = (resultJoinBy &&
                    resultJoinBy.length === (selectedSearchDimensions === null || selectedSearchDimensions === void 0 ? void 0 : selectedSearchDimensions.length))) !== null && _a !== void 0 ? _a : 0);
            });
        }
    }, [rawSearchCubes, currentCubes, selectedSearchDimensions]);
    const handleChangeSearchDimensions = (ev) => {
        var _a;
        const { target: { value }, } = ev;
        setSelectedSearchDimensions(
        // On autofill we get a stringified value.
        (_a = (typeof value === "string" ? value.split(",") : value)) === null || _a === void 0 ? void 0 : _a.map((x) => {
            return searchDimensionOptionsById[x];
        }).filter(truthy));
    };
    const handleClose = useEventCallback((ev, reason) => {
        var _a;
        (_a = props.onClose) === null || _a === void 0 ? void 0 : _a.call(props, ev, reason);
        setQuery("");
        setSelectedSearchDimensions(undefined);
        setOtherCube(undefined);
    });
    const handleClickOtherCube = (otherCube) => {
        setOtherCube(otherCube);
    };
    const { isOpen, open, close } = useCautionAlert();
    const ee = useEventEmitter();
    const inferredJoinBy = useMemo(() => otherCube
        ? inferJoinBy(selectedSearchDimensions !== null && selectedSearchDimensions !== void 0 ? selectedSearchDimensions : [], otherCube)
        : undefined, [selectedSearchDimensions, otherCube]);
    const handleConfirm = useEventCallback(async () => {
        if (!components || !otherCube || !inferredJoinBy) {
            return null;
        }
        await addDataset({
            joinBy: inferredJoinBy,
            otherCube: otherCube,
        });
        handleClose({}, "escapeKeyDown");
        setTimeout(() => {
            ee.emit("dataset-added", { datasetIri: otherCube.iri });
        }, 100);
    });
    const inputRef = useRef();
    const handleKeyDown = useEventCallback((e) => {
        if (e.key === "Enter") {
            setQuery(e.currentTarget.value);
        }
    });
    const handleReset = useEventCallback(() => {
        setQuery("");
    });
    return (<RightDrawer {...props} onClose={handleClose}>
      <Box className={classes.dialogCloseArea}>
        {otherCube ? null : (<Grow in={!isOpen}>
            <div>
              <IconButton onClick={() => open()}>
                <SvgIcInfoCircle />
              </IconButton>
            </div>
          </Grow>)}
        <DialogCloseButton onClick={(ev) => handleClose(ev, "escapeKeyDown")} sx={{ position: "static" }}/>
      </Box>
      {otherCube ? null : (<>
          <DialogTitle sx={{ typography: "h2" }}>
            {t({
                id: "chart.datasets.add-dataset-dialog.title",
                message: "Select dataset with shared dimensions",
            })}
          </DialogTitle>
          <DialogContent>
            <Collapse in={isOpen}>
              <Box sx={{ mb: 4 }}>
                <CautionAlert onConfirm={close}/>
              </Box>
            </Collapse>
            <Typography variant="body1" mb="2rem">
              <Trans id="chart.datasets.add-dataset-dialog.description">
                You can only combine datasets that share dimensions with the
                same unit and resolution. By default, dimensions matching the
                current chart are selected.
              </Trans>
            </Typography>
            <Box display="flex" alignItems="center" gap="0.5rem" mb="1rem">
              <Input key={query} id="search" inputProps={{ ref: inputRef }} defaultValue={query} placeholder={t({ id: "dataset.search.placeholder" })} autoComplete="off" onKeyDown={handleKeyDown} endAdornment={query !== "" ? (<ButtonBase data-testid="clearSearch" onClick={handleReset}>
                      <VisuallyHidden>
                        <Trans id="controls.search.clear">
                          Clear search field
                        </Trans>
                      </VisuallyHidden>
                      <Icon name="close"/>
                    </ButtonBase>) : (<ButtonBase data-testid="submitSearch" type="submit">
                      <VisuallyHidden>
                        <Trans id="dataset.search.label">Search</Trans>
                      </VisuallyHidden>
                      <Icon name="search"/>
                    </ButtonBase>)} sx={{ width: "50%" }}/>
              <Select multiple value={(selectedSearchDimensions !== null && selectedSearchDimensions !== void 0 ? selectedSearchDimensions : []).map((x) => x.id)} onChange={handleChangeSearchDimensions} renderValue={(selected) => isMergeDatasetsDataFetching ? (<CircularProgress size={12}/>) : selected.length === 0 ? (<Typography variant="body2">
                      {t({
                    id: "dataset.search.search-options.no-options-selected",
                })}
                    </Typography>) : (selected.map((id, i) => {
                const value = searchDimensionOptionsById[id];
                return i < 2 ? (<Tag key={value.id} type="dimension" sx={{ py: 0, mr: 2 }}>
                          {value.label}
                        </Tag>) : i === 2 ? (<Tag key="more" type="dimension" sx={{ py: 0, mr: 2 }}>
                          <Trans id="dataset.search.search-options.more-2-options-selected">
                            {selected.length - 2} more
                          </Trans>
                        </Tag>) : null;
            }))} sx={{ width: "50%" }}>
                {searchDimensionOptions.map((sd) => (<MenuItem key={sd.label} value={sd.id} sx={{
                    gap: 2,
                    backgroundColor: "transparent !important",
                    "&:hover": {
                        backgroundColor: (t) => `${t.palette.cobalt[50]} !important`,
                    },
                }}>
                    <Checkbox checked={selectedSearchDimensions &&
                    !!selectedSearchDimensions.find((x) => x.id === sd.id)}/>
                    <ListItemText primary={<Tag type="dimension">{sd.label}</Tag>}/>
                  </MenuItem>))}
              </Select>
              <Button style={{ minWidth: "fit-content" }} onClick={() => {
                if (inputRef.current) {
                    setQuery(inputRef.current.value);
                }
            }}>
                {t({ id: "dataset.search.label" })}
              </Button>
            </Box>

            <Flex sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
            }}>
              <SearchDatasetResultsCount cubes={searchCubes}/>
              <Flex sx={{ alignItems: "center", gap: 5 }}>
                <SearchDatasetDraftsControl checked={includeDrafts} onChange={setIncludeDrafts}/>
                <Divider flexItem orientation="vertical"/>
                <SearchDatasetSortControl value={order} onChange={setOrder}/>
              </Flex>
            </Flex>

            {(selectedSearchDimensions === null || selectedSearchDimensions === void 0 ? void 0 : selectedSearchDimensions.length) === 0 ? (<Typography variant="body1">
                <Trans id="dataset.search.at-least-one-compatible-dimension-selected">
                  At least one compatible dimension must be selected.
                </Trans>
              </Typography>) : (<DatasetResults cubes={searchCubes} fetching={searchQuery.fetching || isMergeDatasetsDataFetching} error={searchQuery.error} datasetResultProps={({ cube }) => ({
                    disableTitleLink: false,
                    showDimensions: true,
                    showTags: true,
                    onClickTitle: (e) => {
                        e.preventDefault();
                        handleClickOtherCube(cube);
                    },
                })}/>)}
          </DialogContent>
        </>)}
      {otherCube && inferredJoinBy ? (<PreviewDataTable key={otherCube.iri} chartConfig={activeChartConfig} dataSource={state.dataSource} currentComponents={components} existingCubes={currentCubes} otherCube={otherCube} inferredJoinBy={inferredJoinBy} addingDataset={addingDataset} onConfirm={handleConfirm} onClickBack={() => setOtherCube(undefined)} searchDimensionsSelected={selectedSearchDimensions !== null && selectedSearchDimensions !== void 0 ? selectedSearchDimensions : []}/>) : null}
    </RightDrawer>);
};
