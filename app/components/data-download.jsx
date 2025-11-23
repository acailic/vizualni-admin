import { t, Trans } from "@lingui/macro";
import { Button, CircularProgress, ListSubheader, MenuItem, Typography, useEventCallback, } from "@mui/material";
import { ascending } from "d3-array";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import keyBy from "lodash/keyBy";
import { createContext, memo, useCallback, useContext, useState, } from "react";
import { useClient } from "urql";
import { ArrowMenuBottomTop } from "@/components/arrow-menu";
import { getSortedComponents } from "@/domain/get-sorted-components";
import { dateFormatterFromDimension, formatIdentity, getFormatFullDateAuto, getFormattersForLocale, } from "@/formatters";
import { executeDataCubesComponentsQuery, executeDataCubesObservationsQuery, } from "@/graphql/hooks";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { makeDimensionValueSorters } from "@/utils/sorting-values";
import { useI18n } from "@/utils/use-i18n";
const DataDownloadStateContext = createContext(undefined);
const useDataDownloadState = () => {
    const ctx = useContext(DataDownloadStateContext);
    if (ctx === undefined) {
        throw Error("You need to wrap your component in <DataDownloadStateProvider /> to useDataDownloadState()");
    }
    return ctx;
};
const DataDownloadStateProvider = ({ children }) => {
    const [state, dispatch] = useState({
        isDownloading: false,
    });
    return (<DataDownloadStateContext.Provider value={[state, dispatch]}>
      {children}
    </DataDownloadStateContext.Provider>);
};
const FILE_FORMATS = ["csv", "xlsx"];
const makeColumnLabel = (dim) => {
    return `${dim.label}${dim.unit ? ` (${dim.unit})` : ""}`;
};
const prepareData = ({ components, observations, dimensionParsers, }) => {
    const sortedComponents = getSortedComponents(components);
    const columns = keyBy(sortedComponents, (d) => d.id);
    // Sort the data from left to right, keeping the order of the columns.
    const sorting = {
        sortingType: "byAuto",
        sortingOrder: "asc",
    };
    const sorters = sortedComponents.map((d) => {
        return [d.id, makeDimensionValueSorters(d, { sorting })];
    });
    // We need to sort before parsing, to access raw observation values, where
    // dates are formatted in the format of YYYY-MM-DD, etc.
    const sortedData = [...observations];
    sortedData.sort((a, b) => {
        for (const [iri, dimSorters] of sorters) {
            for (const sorter of dimSorters) {
                const sortResult = ascending(sorter(a[iri]), sorter(b[iri]));
                if (sortResult !== 0) {
                    return sortResult;
                }
            }
        }
        return 0;
    });
    const parsedData = sortedData.map((obs) => {
        const formattedObs = Object.keys(obs).reduce((acc, key) => {
            return {
                ...acc,
                [key]: formatIdentity(obs[key]),
            };
        }, {});
        return Object.keys(formattedObs).reduce((acc, key) => {
            const col = columns[key];
            const parser = dimensionParsers[key];
            if (!col)
                return acc;
            const value = formattedObs[key];
            let parsedValue;
            if ((value === null || value === void 0 ? void 0 : value.toString()) === "–") {
                parsedValue = "-";
            }
            else {
                parsedValue = parser(value);
            }
            return {
                ...acc,
                [makeColumnLabel(col)]: parsedValue,
            };
        }, {});
    });
    const columnKeys = Object.values(columns).map(makeColumnLabel);
    return {
        data: parsedData,
        columnKeys,
    };
};
const RawMenuItem = ({ children }) => {
    return (<MenuItem sx={{
            whiteSpace: "normal",
            "&:hover": {
                backgroundColor: "transparent",
                cursor: "default",
            },
        }}>
      {children}
    </MenuItem>);
};
export const DataDownloadMenu = memo(({ dataSource, filters, title, }) => {
    return (<DataDownloadStateProvider>
        <DataDownloadInnerMenu dataSource={dataSource} fileName={title} filters={filters}/>
      </DataDownloadStateProvider>);
});
const DataDownloadInnerMenu = ({ dataSource, fileName, filters, }) => {
    const [state] = useDataDownloadState();
    const [anchor, setAnchor] = useState(null);
    const handleClose = useEventCallback(() => setAnchor(null));
    return (<>
      <Button variant="text" color="primary" size="sm" startIcon={state.isDownloading ? (<CircularProgress size={20}/>) : (<Icon name="download" size={20}/>)} onClick={(e) => setAnchor(e.currentTarget)} sx={{
            width: "fit-content",
            minHeight: 0,
            p: 0,
            ml: "2.5px",
            fontSize: "inherit",
        }}>
        <Trans id="button.download.data">Download data</Trans>
      </Button>
      <ArrowMenuBottomTop open={!!anchor} anchorEl={anchor} onClose={handleClose} anchorOrigin={{ horizontal: "center", vertical: "top" }} transformOrigin={{ horizontal: "center", vertical: "bottom" }} MenuListProps={{
            sx: {
                width: 200,
            },
        }} sx={{
            transform: "translateY(-12px)",
        }}>
        {filters.filters && (<DataDownloadMenuSection dataSource={dataSource} subheader={<Trans id="button.download.data.visible">Chart dataset</Trans>} fileName={`${fileName}-filtered`} filters={filters}/>)}
        <DataDownloadMenuSection dataSource={dataSource} subheader={<Trans id="button.download.data.all">Full dataset</Trans>} fileName={`${fileName}-full`} filters={getFullDataDownloadFilters(filters)}/>
        {state.error && (<RawMenuItem>
            <Typography variant="caption" color="error.main">
              {state.error}
            </Typography>
          </RawMenuItem>)}
      </ArrowMenuBottomTop>
    </>);
};
/** We need to include every cube column in full dataset download (client's
 * request), so we do not pass any component ids here
 * */
export const getFullDataDownloadFilters = (filters) => {
    return { iri: filters.iri };
};
const DataDownloadMenuSection = ({ dataSource, subheader, fileName, filters, }) => {
    return (<>
      <ListSubheader>{subheader}</ListSubheader>
      {FILE_FORMATS.map((fileFormat) => (<DownloadMenuItem key={fileFormat} dataSource={dataSource} fileName={fileName} fileFormat={fileFormat} filters={filters}/>))}
    </>);
};
const DownloadMenuItem = ({ dataSource, fileName, fileFormat, filters, }) => {
    const locale = useLocale();
    const i18n = useI18n();
    const client = useClient();
    const [state, dispatch] = useDataDownloadState();
    const download = useCallback(async (componentsData, observationsData) => {
        if (!((componentsData === null || componentsData === void 0 ? void 0 : componentsData.dataCubesComponents) &&
            (observationsData === null || observationsData === void 0 ? void 0 : observationsData.dataCubesObservations))) {
            return;
        }
        const { dimensions, measures } = componentsData.dataCubesComponents;
        const components = [...dimensions, ...measures];
        const dimensionParsers = getDimensionParsers(components, { locale });
        const observations = observationsData.dataCubesObservations.data;
        const { columnKeys, data } = prepareData({
            components,
            observations,
            dimensionParsers,
        });
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("data");
        worksheet.columns = columnKeys.map((d) => ({
            header: d,
            key: d,
        }));
        worksheet.addRows(data);
        switch (fileFormat) {
            case "csv":
                const csv = await workbook.csv.writeBuffer();
                saveAs(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }), `${fileName}.csv`);
                break;
            case "xlsx":
                const xlsx = await workbook.xlsx.writeBuffer();
                saveAs(new Blob([xlsx], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
                }), `${fileName}.xlsx`);
                break;
        }
    }, [fileFormat, fileName, locale]);
    return (<MenuItem disabled={state.isDownloading} onClick={async () => {
            if (!filters) {
                return;
            }
            dispatch({ isDownloading: true });
            try {
                const [componentsResult, observationsResult] = await Promise.all([
                    executeDataCubesComponentsQuery(client, {
                        sourceType: dataSource.type,
                        sourceUrl: dataSource.url,
                        locale,
                        cubeFilters: [filters],
                    }),
                    executeDataCubesObservationsQuery(client, {
                        sourceType: dataSource.type,
                        sourceUrl: dataSource.url,
                        locale,
                        cubeFilters: [filters],
                    }),
                ]);
                if (componentsResult.data && observationsResult.data) {
                    await download(componentsResult.data, observationsResult.data);
                }
                else if (componentsResult.error || observationsResult.error) {
                    dispatch({
                        ...state,
                        error: i18n._(t({
                            id: "hint.dataloadingerror.message",
                            message: "The data could not be loaded.",
                        })),
                    });
                }
            }
            catch (e) {
                console.error(i18n._(t({
                    id: "hint.dataloadingerror.message",
                    message: "The data could not be loaded.",
                })), e);
            }
            finally {
                dispatch({ ...state, isDownloading: false });
            }
        }}>
      {fileFormat.toUpperCase()}
    </MenuItem>);
};
const getDimensionParsers = (components, { locale }) => {
    return Object.fromEntries(components.map((d) => {
        switch (d.__typename) {
            case "GeoCoordinatesDimension":
            case "GeoShapesDimension":
            case "NominalDimension":
            case "OrdinalDimension":
            case "TemporalEntityDimension":
            case "TemporalOrdinalDimension":
                return [d.id, (d) => d];
            case "NumericalMeasure":
            case "StandardErrorDimension":
            case "ConfidenceUpperBoundDimension":
            case "ConfidenceLowerBoundDimension":
                return [d.id, (d) => +d];
            case "OrdinalMeasure":
                return d.isNumerical ? [d.id, (d) => +d] : [d.id, (d) => d];
            case "TemporalDimension": {
                if (d.timeUnit === "Year") {
                    return [d.id, (d) => +d];
                }
                // We do not want to parse dates as dates, but strings (for easier
                // handling in Excel).
                const dateFormatters = getFormattersForLocale(locale);
                const formatDateAuto = getFormatFullDateAuto(dateFormatters);
                return [
                    d.id,
                    dateFormatterFromDimension(d, dateFormatters, formatDateAuto),
                ];
            }
            default:
                const _exhaustiveCheck = d;
                return _exhaustiveCheck;
        }
    }));
};
