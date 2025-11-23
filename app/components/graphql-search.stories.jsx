import { Box, Checkbox, CircularProgress, FormControlLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack, TextField, Typography, } from "@mui/material";
import keyBy from "lodash/keyBy";
import { useEffect, useState } from "react";
import { ObjectInspector } from "react-inspector";
import { DatasetResult } from "@/browse/ui/dataset-result";
import { Error } from "@/components/hint";
import { Tag } from "@/components/tag";
import { truthy } from "@/domain/types";
import { SearchCubeFilterType, useDataCubeComponentTermsetsQuery, useSearchCubesQuery, } from "@/graphql/query-hooks";
const options = [
    {
        id: "0",
        cubeIri: "https://environment.ld.admin.ch/foen/nfi/nfi_C-1029/cube/2023-1",
        sourceType: "sparql",
        sourceUrl: "https://lindas.admin.ch/query",
        label: "NFI Topics by stage of stand development",
    },
    {
        id: "1",
        cubeIri: "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/9",
        sourceType: "sparql",
        sourceUrl: "https://lindas.admin.ch/query",
        label: "Einmalvergütung für Photovoltaikanlagen",
    },
    {
        id: "2",
        cubeIri: '"https://energy.ld.admin.ch/sfoe/bfe_ogd18_gebaeudeprogramm_auszahlungen/8',
        sourceType: "sparql",
        sourceUrl: "https://lindas.admin.ch/query",
        label: "Gebäudeprogramm - Auszahlungen nach Massnahmenbereich und Berichtsjahr",
    },
];
export const Search = () => {
    var _a, _b, _c, _d, _e, _f;
    const [inputValue, setInputValue] = useState("");
    const [query, setQuery] = useState("");
    const [optionId, setOptionId] = useState("0");
    const [temporalDimension, setTemporalDimension] = useState("-");
    const [sharedComponents, setSharedComponents] = useState(undefined);
    const chosenOption = options.find((x) => x.id === optionId);
    const [cubeTermsetsResults] = useDataCubeComponentTermsetsQuery({
        variables: {
            locale: "en",
            sourceType: chosenOption.sourceType,
            sourceUrl: chosenOption.sourceUrl,
            cubeFilter: {
                iri: chosenOption.cubeIri,
            },
        },
    });
    const cubeSharedDimensionsByIri = keyBy((_b = (_a = cubeTermsetsResults.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponentTermsets) !== null && _b !== void 0 ? _b : [], (x) => x.iri);
    const [searchCubesResult] = useSearchCubesQuery({
        pause: !sharedComponents || sharedComponents.length === 0,
        variables: {
            locale: "en",
            sourceType: "sparql",
            sourceUrl: "https://int.lindas.admin.ch/query",
            filters: [
                sharedComponents
                    ? {
                        type: SearchCubeFilterType.DataCubeTermset,
                        value: (_c = sharedComponents
                            .map((x) => cubeSharedDimensionsByIri[x])
                            .filter(truthy)
                            .flatMap((x) => x.termsets.map((x) => x.iri))) === null || _c === void 0 ? void 0 : _c.join(";"),
                    }
                    : null,
                temporalDimension !== "-"
                    ? {
                        type: SearchCubeFilterType.TemporalDimension,
                        value: temporalDimension,
                    }
                    : null,
            ].filter(truthy),
            includeDrafts: false,
            fetchDimensionTermsets: true,
            query,
        },
    });
    const handleChangeSharedDimensions = (ev) => {
        const { target: { value }, } = ev;
        setSharedComponents(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value);
    };
    const handleChangeCube = (ev) => {
        setOptionId(ev.target.value);
        setSharedComponents(undefined);
    };
    useEffect(() => {
        var _a, _b, _c, _d;
        if (sharedComponents === undefined &&
            ((_a = cubeTermsetsResults === null || cubeTermsetsResults === void 0 ? void 0 : cubeTermsetsResults.data) === null || _a === void 0 ? void 0 : _a.dataCubeComponentTermsets) &&
            chosenOption.cubeIri ===
                ((_c = ((_b = cubeTermsetsResults.operation) === null || _b === void 0 ? void 0 : _b.variables).cubeFilter) === null || _c === void 0 ? void 0 : _c.iri)) {
            setSharedComponents((_d = cubeTermsetsResults === null || cubeTermsetsResults === void 0 ? void 0 : cubeTermsetsResults.data) === null || _d === void 0 ? void 0 : _d.dataCubeComponentTermsets.map((x) => x.iri));
        }
    }, [cubeTermsetsResults, sharedComponents, chosenOption.cubeIri]);
    return (<div>
      <h2>Search results</h2>
      {chosenOption.cubeIri}
      <Stack gap={1} direction="column" alignItems="start">
        <FormControlLabel label="Query" labelPlacement="start" control={<TextField label="Search" size="small" placeholder="Search" value={inputValue} onChange={(ev) => {
                const value = ev.target.value;
                setInputValue(value);
            }} onKeyUp={(ev) => {
                if (ev.key === "Enter") {
                    setQuery(inputValue);
                }
            }}/>}/>

        <FormControlLabel label="Compatible cube" labelPlacement="start" control={<Select size="sm" native onChange={handleChangeCube} value={optionId !== null && optionId !== void 0 ? optionId : "0"}>
              {options.map((option) => (<option key={option.id} value={option.id}>
                  {option.label}
                </option>))}
            </Select>}/>

        <FormControlLabel label="Join by" labelPlacement="start" control={<Stack gap={1} alignItems="center" direction="row">
              <Select labelId="demo-multiple-chip-label" id="demo-multiple-chip" multiple value={sharedComponents !== null && sharedComponents !== void 0 ? sharedComponents : []} onChange={handleChangeSharedDimensions} input={<OutlinedInput notched={false} id="select-multiple-chip" label="Chip"/>} renderValue={(selected) => selected && selected.length
                ? selected.map((value) => {
                    var _a;
                    return (<Tag key={value} type="termset" sx={{ mr: 1 }}>
                          {(_a = cubeSharedDimensionsByIri === null || cubeSharedDimensionsByIri === void 0 ? void 0 : cubeSharedDimensionsByIri[value]) === null || _a === void 0 ? void 0 : _a.label}
                        </Tag>);
                })
                : "-"}>
                {(_e = (_d = cubeTermsetsResults === null || cubeTermsetsResults === void 0 ? void 0 : cubeTermsetsResults.data) === null || _d === void 0 ? void 0 : _d.dataCubeComponentTermsets) === null || _e === void 0 ? void 0 : _e.map((sd) => (<MenuItem key={sd.label} value={sd.iri} sx={{ gap: 2, alignItems: "start" }}>
                      <Checkbox checked={sharedComponents && sharedComponents.includes(sd.iri)}/>
                      <ListItemText primary={sd.label} secondary={<>
                            <Stack gap={1} width={400} flexDirection="row" flexWrap="wrap" alignItems="center">
                              <Typography variant="caption" component="div" mb={1}>
                                Joined by{" "}
                              </Typography>
                              {sd.termsets.map((t) => (<Tag key={t.iri} type="termset" typography="caption" sx={{ "&&": { fontSize: 10 } }}>
                                  {t.label}
                                </Tag>))}
                            </Stack>
                          </>}/>
                    </MenuItem>))}
              </Select>
              {cubeTermsetsResults.fetching ? (<CircularProgress size={12}/>) : null}
            </Stack>}/>

        <FormControlLabel label={"Temporal dimension"} labelPlacement="start" control={<Select value={temporalDimension} onChange={(ev) => setTemporalDimension(ev.target.value)}>
              <MenuItem value="-">-</MenuItem>
              <MenuItem value="Year">Year</MenuItem>
              <MenuItem value="Month">Month</MenuItem>
            </Select>}/>
      </Stack>

      <Box my={2}>
        <ObjectInspector data={searchCubesResult.data}/>
      </Box>
      {searchCubesResult.fetching ? <CircularProgress size={12}/> : null}
      {searchCubesResult.error ? (<Error>{searchCubesResult.error.message}</Error>) : null}

      {(_f = searchCubesResult === null || searchCubesResult === void 0 ? void 0 : searchCubesResult.data) === null || _f === void 0 ? void 0 : _f.searchCubes.map((item) => (<DatasetResult key={item.cube.iri} dataCube={item.cube} showDimensions/>))}
    </div>);
};
export default {
    title: "Data / Search",
};
