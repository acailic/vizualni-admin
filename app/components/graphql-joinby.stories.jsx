import { alpha, CircularProgress, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";
import keyBy from "lodash/keyBy";
import { useMemo, useState } from "react";
import { ObjectInspector } from "react-inspector";
import { truthy } from "@/domain/types";
import { useDataCubesComponentsQuery, useDataCubesObservationsQuery, } from "@/graphql/hooks";
const combinations = [
    {
        id: 1,
        name: "Photovoltaik + Hydropowerplants",
        sourceUrl: "https://int.lindas.admin.ch/query",
        cubes: [
            {
                iri: "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/14",
                filters: {
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Kanton": { type: "single", value: "https://ld.admin.ch/canton/1" },
                },
                joinBy: [
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Jahr",
                ],
            },
            {
                iri: "https://energy.ld.admin.ch/sfoe/bfe_ogd40_wasta/7",
                joinBy: [
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd40_wasta/YearOfStatistic",
                ],
                filters: {
                    "http://purl.org/dc/terms/identifier": {
                        type: "single",
                        value: "https://ld.admin.ch/dimension/bgdi/energy/hydropowerplants/023625",
                    },
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd40_wasta/OperationalStatus": {
                        type: "single",
                        value: "https://energy.ld.admin.ch/sfoe/bfe_ogd40_wasta/ogd40_catalog/os1",
                    },
                },
            },
        ],
    },
    {
        id: 2,
        name: "Photovoltaik + Photovoltaik GEB",
        sourceUrl: "https://int.lindas.admin.ch/query",
        cubes: [
            {
                iri: "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/14",
                filters: {
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Jahr": {
                        type: "single",
                        value: "2020",
                    },
                },
                joinBy: [
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Kanton",
                ],
            },
            {
                iri: "https://energy.ld.admin.ch/sfoe/OGD84GebTest/1",
                joinBy: ["https://energy.ld.admin.ch/sfoe/OGD84GebTest/Kanton"],
                filters: {
                    "https://energy.ld.admin.ch/sfoe/OGD84GebTest/Jahr": {
                        type: "single",
                        value: "2020",
                    },
                },
            },
        ],
    },
    {
        id: 3,
        name: "NFI Cube + Electrical consumption",
        sourceUrl: "https://int.lindas.admin.ch/query",
        cubes: [
            {
                iri: "https://environment.ld.admin.ch/foen/nfi/nfi_T-changes/cube/2024-1",
                filters: {
                    "https://environment.ld.admin.ch/foen/nfi/classificationUnit": {
                        type: "single",
                        value: "https://environment.ld.admin.ch/foen/nfi/ClassificationUnit/Total",
                    },
                    "https://environment.ld.admin.ch/foen/nfi/unitOfEvaluation": {
                        type: "single",
                        value: "https://environment.ld.admin.ch/foen/nfi/UnitOfEvaluation/2382",
                    },
                    "https://environment.ld.admin.ch/foen/nfi/grid": {
                        type: "single",
                        value: "https://environment.ld.admin.ch/foen/nfi/Grid/410",
                    },
                    "https://environment.ld.admin.ch/foen/nfi/evaluationType": {
                        type: "single",
                        value: "https://environment.ld.admin.ch/foen/nfi/EvaluationType/3",
                    },
                },
                joinBy: ["https://environment.ld.admin.ch/foen/nfi/unitOfReference"],
            },
            {
                iri: "https://energy.ld.admin.ch/elcom/electricityprice-canton",
                joinBy: [
                    "https://energy.ld.admin.ch/elcom/electricityprice/dimension/canton",
                ],
                filters: {
                    "https://energy.ld.admin.ch/elcom/electricityprice/dimension/category": {
                        type: "single",
                        value: "https://energy.ld.admin.ch/elcom/electricityprice/category/C1",
                    },
                    "https://energy.ld.admin.ch/elcom/electricityprice/dimension/period": { type: "single", value: "2011" },
                    "https://energy.ld.admin.ch/elcom/electricityprice/dimension/product": {
                        type: "single",
                        value: "https://energy.ld.admin.ch/elcom/electricityprice/product/standard",
                    },
                },
            },
        ],
    },
    {
        id: 4,
        name: "NFI Change + Photovoltaik",
        sourceUrl: "https://lindas.admin.ch/query",
        cubes: [
            {
                iri: "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/9",
                joinBy: [
                    "https://energy.ld.admin.ch/sfoe/bfe_ogd84_einmalverguetung_fuer_photovoltaikanlagen/Kanton",
                ],
                filters: {},
            },
            {
                iri: "https://environment.ld.admin.ch/foen/nfi/nfi_T-changes/cube/2024-1",
                joinBy: ["https://environment.ld.admin.ch/foen/nfi/unitOfReference"],
                filters: {},
            },
        ],
    },
];
const useStyles = makeStyles((theme) => ({
    row: {
        borderBottom: "1px solid",
        borderBottomColor: theme.palette.divider,
    },
}));
export const JoinBy = () => {
    const [combination, setCombination] = useState(() => combinations[1]);
    const commonQueryVariables = {
        locale: "en",
        sourceType: "sparql",
        sourceUrl: combination.sourceUrl,
    };
    const [{ data: componentsData, fetching: fetchingComponents }] = useDataCubesComponentsQuery({
        chartConfig: {
            conversionUnitsByComponentId: {},
        },
        variables: {
            ...commonQueryVariables,
            cubeFilters: combination.cubes.map((cube) => ({
                iri: cube.iri,
                joinBy: cube.joinBy,
                filters: cube.filters,
            })),
        },
    });
    const componentsByIri = useMemo(() => {
        var _a, _b;
        return keyBy([
            ...((_a = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents.dimensions) !== null && _a !== void 0 ? _a : []),
            ...((_b = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents.measures) !== null && _b !== void 0 ? _b : []),
        ].filter(truthy), (x) => x.id);
    }, [componentsData]);
    const [{ data: observationsData, fetching: fetchingObservations }] = useDataCubesObservationsQuery({
        chartConfig: {
            conversionUnitsByComponentId: {},
        },
        variables: {
            ...commonQueryVariables,
            cubeFilters: combination.cubes.map((cube) => ({
                iri: cube.iri,
                joinBy: cube.joinBy,
                filters: cube.filters,
            })),
        },
    });
    const colorScale = useMemo(() => scaleOrdinal(schemeTableau10), []);
    const classes = useStyles();
    if (fetchingObservations || fetchingComponents) {
        return <CircularProgress />;
    }
    if (!componentsData || !observationsData) {
        return <div>Could not fetch data</div>;
    }
    const observations = observationsData.dataCubesObservations.data;
    const tableHead = Object.keys(observations[0]);
    return (<div>
      <Stack gap={2}>
        <Select value={combination.id} onChange={(ev) => {
            const found = combinations.find((x) => x.id === ev.target.value);
            return setCombination(found !== null && found !== void 0 ? found : combinations[0]);
        }}>
          {combinations.map((combination) => (<MenuItem key={combination.id} value={combination.id}>
              {combination.name} <small>({combination.sourceUrl})</small>
            </MenuItem>))}
        </Select>
        <ObjectInspector data={combination}/>
        <Table size="small">
          <TableHead>
            <TableRow>
              {tableHead.map((key) => {
            var _a, _b, _c, _d;
            return (<TableCell component="th" style={{
                    backgroundColor: alpha(colorScale((_a = componentsByIri[key]) === null || _a === void 0 ? void 0 : _a.cubeIri), 0.25),
                }} key={key}>
                  {(_c = (_b = componentsByIri[key]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : (_d = componentsByIri[key]) === null || _d === void 0 ? void 0 : _d.description}
                </TableCell>);
        })}
            </TableRow>
          </TableHead>
          <TableBody>
            {observations.map((row, index) => (<TableRow key={index} className={classes.row}>
                {tableHead.map((key) => (<td key={key}>{row[key]}</td>))}
              </TableRow>))}
          </TableBody>
        </Table>
      </Stack>
    </div>);
};
const meta = {
    title: "Data / Join By",
};
export default meta;
