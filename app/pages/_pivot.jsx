import { Box, Card as MUICard, CircularProgress, FormControlLabel, lighten, Switch, Typography, } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import clsx from "clsx";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import { useEffect, useMemo, useState } from "react";
import { Inspector } from "react-inspector";
import { useExpanded, useSortBy, useTable } from "react-table";
import { Loading } from "@/components/hint";
import { useDataCubesComponentsQuery, useDataCubesObservationsQuery, } from "@/graphql/hooks";
import { visitHierarchy } from "@/rdf/tree-utils";
import { useEvent } from "@/utils/use-event";
const Card = styled(MUICard)({
    border: "1px solid #ccc",
    backgroundColor: "#eee",
    padding: "1rem",
    marginTop: 16,
    marginBottom: 16,
});
const intDatasource = {
    sourceUrl: "https://lindas-cached.int.cluster.ldbar.ch/query",
    sourceType: "sparql",
};
const datasets = mapValues({
    "https://environment.ld.admin.ch/foen/fab_Offentliche_Ausgaben_test3/8": {
        label: "ausgaben",
        datasource: intDatasource,
    },
    "https://environment.ld.admin.ch/foen/ubd000502_sad_01/7": {
        label: "Gas",
        datasource: intDatasource,
    },
}, (v, k) => ({ ...v, iri: k }));
const useStyles = makeStyles((theme) => ({
    pivotTableRoot: {
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gridTemplateAreas: `
"options chart"
    `,
        gridGap: "1rem",
    },
    pivotTableOptions: {
        paddingTop: "1rem",
        gridArea: "options",
    },
    pivotTableChart: {
        gridArea: "chart",
        overflowX: "hidden",
    },
    pivotTableContainer: {
        overflowX: "scroll",
    },
    pivotTableTable: {
        width: "100%",
        fontSize: "12px",
        borderCollapse: "collapse",
        "& td, & th": {
            border: "1px solid #ccc",
            whiteSpace: "nowrap",
            padding: "4px",
        },
    },
    optionGroup: {
        "& + &": {
            marginTop: "0.75rem",
        },
    },
    row: {
        transition: "background-color 0.3s ease",
    },
    expanded: {},
    depth_0: {
        "&$expanded": {
            background: lighten(theme.palette.primary.light, 0.75),
        },
    },
    depth_1: {
        "&$expanded": {
            background: lighten(theme.palette.primary.light, 0.5),
        },
    },
    depth_2: {
        "&$expanded": {
            background: lighten(theme.palette.primary.light, 0.15),
        },
    },
}));
const indexHierarchy = (hierarchy) => {
    const byLabel = new Map();
    const parentsByIri = new Map();
    const childrenByIri = new Map();
    const byIri = new Map();
    visitHierarchy(hierarchy, (x_) => {
        const x = x_;
        byLabel.set(x.label, x);
        byIri.set(x.value, x);
        const children = x.children;
        if (children) {
            childrenByIri.set(x.value, children);
            for (let child of children) {
                parentsByIri.set(child.value, x);
            }
        }
    });
    return { byLabel, parentsByIri, childrenByIri, byIri };
};
const useBarStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
    },
}));
const Bar = ({ percent }) => {
    const classes = useBarStyles();
    return (<div className={classes.root} style={{ height: 4, width: (100 * percent) / 100 }}></div>);
};
const PivotTable = ({ dataset }) => {
    var _a, _b, _c, _d;
    const [activeMeasures, setActiveMeasures] = useState({});
    const [pivotDimension, setPivotDimension] = useState();
    const [hierarchyDimension, setHierarchyDimension] = useState();
    const [ignoredDimensions, setIgnoredDimensions] = useState({});
    const [{ data: componentsData, fetching: fetchingComponents }] = useDataCubesComponentsQuery({
        chartConfig: {
            conversionUnitsByComponentId: {},
        },
        variables: {
            ...intDatasource,
            locale: "en",
            cubeFilters: [{ iri: dataset.iri }],
        },
    });
    const [{ data: observationsData, fetching: fetchingObservations }] = useDataCubesObservationsQuery({
        chartConfig: {
            conversionUnitsByComponentId: {},
        },
        variables: {
            ...intDatasource,
            locale: "en",
            cubeFilters: [{ iri: dataset.iri }],
        },
    });
    const classes = useStyles();
    const allDimensions = (_a = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents) === null || _a === void 0 ? void 0 : _a.dimensions;
    const dimensions = useMemo(() => {
        return allDimensions === null || allDimensions === void 0 ? void 0 : allDimensions.filter((d) => !ignoredDimensions[d.id]);
    }, [allDimensions, ignoredDimensions]);
    const measures = (_b = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents) === null || _b === void 0 ? void 0 : _b.measures;
    const observations = useMemo(() => {
        var _a, _b;
        return (_b = (_a = observationsData === null || observationsData === void 0 ? void 0 : observationsData.dataCubesObservations) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
    }, [(_c = observationsData === null || observationsData === void 0 ? void 0 : observationsData.dataCubesObservations) === null || _c === void 0 ? void 0 : _c.data]);
    const handleChangePivot = (ev) => {
        const name = ev.currentTarget.value;
        setPivotDimension(dimensions === null || dimensions === void 0 ? void 0 : dimensions.find((d) => d.id === name));
    };
    const handleChangeHierarchy = (ev) => {
        const name = ev.currentTarget.value;
        setHierarchyDimension(dimensions === null || dimensions === void 0 ? void 0 : dimensions.find((d) => d.id === name));
    };
    const handleToggleMeasure = useEvent((ev) => {
        const measureId = ev.currentTarget.getAttribute("name");
        if (!measureId) {
            return;
        }
        setActiveMeasures((am) => am ? { ...am, [measureId]: !am[measureId] } : {});
    });
    const handleToggleIgnoredDimension = useEvent((ev) => {
        const dimensionIri = ev.currentTarget.getAttribute("name");
        if (!dimensionIri) {
            return;
        }
        setIgnoredDimensions((ignored) => ignored ? { ...ignored, [dimensionIri]: !ignored[dimensionIri] } : {});
    });
    const hierarchy = (_d = componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents.dimensions.find((d) => d.id === (hierarchyDimension === null || hierarchyDimension === void 0 ? void 0 : hierarchyDimension.id))) === null || _d === void 0 ? void 0 : _d.hierarchy;
    const hierarchyIndexes = useMemo(() => {
        if (hierarchy) {
            return indexHierarchy(hierarchy);
        }
    }, [hierarchy]);
    const { pivotted, pivotUniqueValues, tree } = useMemo(() => {
        if (!pivotDimension || !dimensions || !measures) {
            return {
                pivotted: [],
                pivotUniqueValues: [],
            };
        }
        else {
            const restDimensions = dimensions.filter((f) => f !== pivotDimension) || [];
            const rowKey = (row) => {
                return restDimensions.map((d) => row[d.id]).join("/");
            };
            const pivotGroups = Object.values(groupBy(observations, (x) => restDimensions === null || restDimensions === void 0 ? void 0 : restDimensions.map((d) => x[d.id]).join("/")));
            const pivotUniqueValues = new Set();
            const rowIndex = new Map();
            // Create pivotted rows with pivot dimension values as columns
            const pivotted = [];
            pivotGroups.forEach((g) => {
                // Start from values that are the same within the group
                const row = Object.fromEntries(restDimensions.map((d) => [d.id, g[0][d.id]]));
                // Add pivoted dimensions
                for (let item of g) {
                    const pivotValueAttr = `${pivotDimension.id}/${item[pivotDimension.id]}`;
                    // @ts-ignore
                    row[pivotValueAttr] = Object.fromEntries(measures.map((m) => [m.id, item[m.id]]));
                    pivotUniqueValues.add(item[pivotDimension.id]);
                }
                rowIndex.set(rowKey(row), row);
                pivotted.push(row);
            });
            // Regroup rows with their parent row
            const tree = [];
            pivotted.forEach((row) => {
                if (hierarchyDimension && hierarchyIndexes) {
                    const hierarchyLabel = row[hierarchyDimension.id];
                    const hierarchyNode = hierarchyIndexes.byLabel.get(hierarchyLabel);
                    const parentNode = hierarchyIndexes.parentsByIri.get(hierarchyNode === null || hierarchyNode === void 0 ? void 0 : hierarchyNode.value);
                    const parentKey = rowKey({
                        ...row,
                        [hierarchyDimension.id]: parentNode === null || parentNode === void 0 ? void 0 : parentNode.label,
                    });
                    const parentRow = rowIndex.get(parentKey);
                    if (parentRow) {
                        parentRow.subRows = parentRow.subRows || [];
                        parentRow.subRows.push(row);
                    }
                    else {
                        tree.push(row);
                    }
                    return;
                }
                tree.push(row);
            });
            return {
                pivotted,
                tree,
                pivotUniqueValues: Array.from(pivotUniqueValues).sort(),
            };
        }
    }, [
        pivotDimension,
        dimensions,
        measures,
        observations,
        hierarchyDimension,
        hierarchyIndexes,
    ]);
    const columns = useMemo(() => {
        if (!dimensions || !measures) {
            return [];
        }
        else if (pivotDimension) {
            const dimensionColumns = dimensions
                .filter((d) => d.id !== pivotDimension.id)
                .sort((a) => {
                if (a.id === (hierarchyDimension === null || hierarchyDimension === void 0 ? void 0 : hierarchyDimension.id)) {
                    return 1;
                }
                else {
                    return 0;
                }
            })
                .map((d) => ({
                id: d.id,
                accessor: (x) => x[d.id],
                Header: d.label,
            }));
            const pivotColumns = pivotUniqueValues.map((uv) => ({
                Header: uv,
                columns: measures
                    .filter((m) => (activeMeasures === null || activeMeasures === void 0 ? void 0 : activeMeasures[m.id]) !== false)
                    .map((m) => {
                    const showBars = m.label.includes("%");
                    return {
                        Header: m.label,
                        Cell: ({ cell }) => {
                            return (<>
                      {cell.value}
                      {showBars ? (<Bar percent={parseFloat(cell.value)}/>) : null}
                    </>);
                        },
                        id: `${pivotDimension.id}/${uv}/${m.id}`,
                        accessor: (x) => {
                            var _a;
                            return ((_a = x[`${pivotDimension.id}/${uv}`]) === null || _a === void 0 ? void 0 : _a[m.id]) || "";
                        },
                    };
                }),
            }));
            const dimensionAndHierarchyColumns = dimensionColumns.map((d) => {
                if (d.id === (hierarchyDimension === null || hierarchyDimension === void 0 ? void 0 : hierarchyDimension.id)) {
                    const col = {
                        ...d,
                        Cell: ({ cell, row }) => {
                            const style = {
                                // We can even use the row.depth property
                                // and paddingLeft to indicate the depth
                                // of the row
                                paddingLeft: `${row.depth * 1}rem`,
                            };
                            return (
                            // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                            // to build the toggle for expanding a row
                            <span {...(row.canExpand
                                ? row.getToggleRowExpandedProps({
                                    style,
                                })
                                : {
                                    style,
                                })}>
                  {row.canExpand ? (row.isExpanded ? "▼  " : "▶  ") : null}
                  {cell.value}
                </span>);
                        },
                    };
                    return col;
                }
                else {
                    return d;
                }
            });
            return [...dimensionAndHierarchyColumns, ...pivotColumns];
        }
        else {
            const all = [...dimensions, ...measures];
            return all.map((d) => {
                return {
                    accessor: (x) => x[d.id],
                    Header: d.label,
                };
            });
        }
    }, [
        dimensions,
        measures,
        pivotDimension,
        pivotUniqueValues,
        hierarchyDimension === null || hierarchyDimension === void 0 ? void 0 : hierarchyDimension.id,
        activeMeasures,
    ]);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, expandedDepth, } = useTable({
        columns: columns,
        data: pivotDimension && tree ? tree : observations,
    }, useSortBy, useExpanded);
    useEffect(() => {
        if (!Object.keys(activeMeasures).length && measures) {
            setActiveMeasures(Object.fromEntries(measures.map((m) => [m.id, true])));
        }
    }, [activeMeasures, measures]);
    return (<Box className={classes.pivotTableRoot}>
      <div className={classes.pivotTableOptions}>
        <div className={classes.optionGroup}>
          <Typography variant="h6" gutterBottom display="block">
            Pivot columns
          </Typography>
          <select onChange={handleChangePivot} value={(pivotDimension === null || pivotDimension === void 0 ? void 0 : pivotDimension.id) || "-"}>
            <option value="-">-</option>
            {dimensions === null || dimensions === void 0 ? void 0 : dimensions.map((d) => {
            return (<option key={d.id} value={d.id}>
                  {d.label}
                </option>);
        })}
          </select>
        </div>
        <div className={classes.optionGroup}>
          <Typography variant="h6" gutterBottom display="block">
            Group rows by
          </Typography>
          <select onChange={handleChangeHierarchy} value={(hierarchyDimension === null || hierarchyDimension === void 0 ? void 0 : hierarchyDimension.id) || "-"}>
            <option value="-">-</option>
            {dimensions === null || dimensions === void 0 ? void 0 : dimensions.map((d) => {
            return (<option key={d.id} value={d.id}>
                  {d.label}
                </option>);
        })}
          </select>

          {fetchingComponents ? (<CircularProgress size={12} sx={{ ml: 2 }}/>) : null}
        </div>
        <div className={classes.optionGroup}>
          <Typography variant="h6" gutterBottom display="block">
            Measures
          </Typography>
          {measures === null || measures === void 0 ? void 0 : measures.map((m) => {
            return (<FormControlLabel key={m.id} label={m.label} componentsProps={{ typography: { variant: "caption" } }} control={<Switch size="small" checked={activeMeasures === null || activeMeasures === void 0 ? void 0 : activeMeasures[m.id]} onChange={handleToggleMeasure} name={m.id}/>}/>);
        })}
        </div>
        <div className={classes.optionGroup}>
          <Typography variant="h6" display="block">
            Ignored dimensions
          </Typography>
          <Typography variant="caption" gutterBottom display="block">
            If some dimensions contain duplicate information with another
            dimension, it is necessary to ignore them for the grouping to work.
            <br />
            Ex: the Hierarchy column of the Gas dataset is a duplicate of the
            Source of emission column, it needs to be ignored.
          </Typography>
          {allDimensions === null || allDimensions === void 0 ? void 0 : allDimensions.map((d) => {
            return (<FormControlLabel key={d.id} label={d.label} componentsProps={{ typography: { variant: "caption" } }} control={<Switch size="small" checked={ignoredDimensions === null || ignoredDimensions === void 0 ? void 0 : ignoredDimensions[d.id]} onChange={handleToggleIgnoredDimension} name={d.id}/>}/>);
        })}
        </div>
      </div>
      <div className={classes.pivotTableChart}>
        <Card elevation={0}>
          <details>
            <summary>
              <Typography variant="h6" display="inline">
                Debug
              </Typography>
            </summary>

            <Typography variant="caption" display="block">
              Columns
            </Typography>
            <Inspector data={columns} table={false}/>
            <Typography variant="caption" display="block">
              Pivoted
            </Typography>
            <Inspector data={pivotted} table={false}/>
            <Typography variant="caption" display="block">
              Pivoted tree
            </Typography>
            <Inspector data={tree} table={false}/>
            <Typography variant="caption" display="block">
              Hierarchy
            </Typography>
            <Inspector data={hierarchy} table={false}/>
            <Typography variant="caption" display="block">
              Hierarchy indexes
            </Typography>
            <Inspector data={hierarchyIndexes} table={false}/>
          </details>
        </Card>
        {fetchingComponents || fetchingObservations ? <Loading /> : null}
        <div className={classes.pivotTableContainer}>
          <table {...getTableProps()} className={classes.pivotTableTable}>
            <thead>
              {headerGroups.map((headerGroup) => (
        // eslint-disable-next-line react/jsx-key
        <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
            // eslint-disable-next-line react/jsx-key
            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                    ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                    : ""}
                      </span>
                    </th>))}
                </tr>))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
            prepareRow(row);
            return (
            // eslint-disable-next-line react/jsx-key
            <tr {...row.getRowProps()} className={clsx(classes.row, row.isExpanded ? classes.expanded : null, classes[`depth_${expandedDepth - row.depth}`])}>
                    {row.cells.map((cell) => {
                    return (
                    // eslint-disable-next-line react/jsx-key
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>);
                })}
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>
    </Box>);
};
const Page = () => {
    const [dataset, setDataset] = useState(datasets[Object.keys(datasets)[0]]);
    const handleChangeDataset = (ev) => {
        const name = ev.currentTarget.value;
        if (name in datasets) {
            setDataset(datasets[name]);
        }
    };
    return (<Box m={5}>
      <Typography variant="h2">Pivot table</Typography>
      <Typography variant="caption" display="block">
        Dataset
      </Typography>

      <select onChange={handleChangeDataset} value={dataset.iri}>
        {Object.keys(datasets).map((k) => {
            const dataset = datasets[k];
            return (<option key={dataset.iri} value={dataset.iri}>
              {dataset.label}
            </option>);
        })}
      </select>
      <PivotTable key={dataset.iri} dataset={dataset}/>
    </Box>);
};
export default Page;
