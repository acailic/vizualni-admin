import { Trans } from "@lingui/macro";
import { Box, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Head from "next/head";
import { useEffect } from "react";
import { DataTablePreview } from "@/browse/ui/data-table-preview";
import { FirstTenRowsCaption } from "@/browse/ui/first-ten-rows-caption";
import { useFootnotesStyles } from "@/components/chart-footnotes";
import { DataDownloadMenu } from "@/components/data-download";
import { Flex } from "@/components/flex";
import { HintError, Loading, LoadingDataError } from "@/components/hint";
import { useDataCubePreviewQuery, } from "@/graphql/query-hooks";
import { DataCubePublicationStatus } from "@/graphql/resolver-types";
import { useLocale } from "@/locales/use-locale";
export const DataSetPreview = ({ dataSetIri, dataSource, dataCubeMetadataQuery, odsIframe, }) => {
    var _a;
    const footnotesClasses = useFootnotesStyles({ useMarginTop: false });
    const locale = useLocale();
    const variables = {
        sourceType: dataSource.type,
        sourceUrl: dataSource.url,
        locale,
        cubeFilter: { iri: dataSetIri },
    };
    const [{ data: metadata, fetching: fetchingMetadata, error: metadataError }] = dataCubeMetadataQuery;
    const [{ data: previewData, fetching: fetchingPreview, error: previewError },] = useDataCubePreviewQuery({ variables });
    const classes = useStyles({
        descriptionPresent: !!(metadata === null || metadata === void 0 ? void 0 : metadata.dataCubeMetadata.description),
        odsIframe,
    });
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);
    if (fetchingMetadata || fetchingPreview) {
        return (<Flex className={classes.loadingWrapper}>
        <Loading />
      </Flex>);
    }
    else if ((metadata === null || metadata === void 0 ? void 0 : metadata.dataCubeMetadata) && (previewData === null || previewData === void 0 ? void 0 : previewData.dataCubePreview)) {
        const { dataCubeMetadata } = metadata;
        const { dataCubePreview } = previewData;
        return (<Flex className={classes.root}>
        {dataCubeMetadata.publicationStatus ===
                DataCubePublicationStatus.Draft && (<Box sx={{ mb: 4 }}>
            <HintError>
              <Trans id="dataset.publicationStatus.draft.warning">
                Careful, this dataset is only a draft.
                <br />
                <strong>Don&apos;t use for reporting!</strong>
              </Trans>
            </HintError>
          </Box>)}
        <Flex className={classes.header} sx={{ justifyContent: odsIframe ? "end" : "space-between" }}>
          <Head>
            <title key="title">
              {dataCubeMetadata.title} - data.gov.rs
            </title>
          </Head>
          {!odsIframe && (<Typography variant="h1" fontWeight={700}>
              {dataCubeMetadata.title}
            </Typography>)}
        </Flex>
        <Paper className={classes.paper}>
          {dataCubeMetadata.description && !odsIframe && (<Typography className={classes.description} variant="body2">
              {dataCubeMetadata.description}
            </Typography>)}
          <div className={classes.tableOuterWrapper}>
            <Flex className={classes.tableInnerWrapper}>
              <DataTablePreview title={dataCubeMetadata.title} dimensions={dataCubePreview.dimensions} measures={dataCubePreview.measures} observations={dataCubePreview.observations} linkToMetadataPanel={false}/>
            </Flex>
          </div>
          <Flex className={classes.footnotesWrapper}>
            <Flex className={footnotesClasses.actions}>
              {odsIframe ? null : (<DataDownloadMenu dataSource={dataSource} title={dataCubeMetadata.title} filters={variables.cubeFilter}/>)}
            </Flex>
            <FirstTenRowsCaption />
          </Flex>
        </Paper>
      </Flex>);
    }
    else {
        return (<Flex className={classes.loadingWrapper}>
        <LoadingDataError message={(_a = metadataError === null || metadataError === void 0 ? void 0 : metadataError.message) !== null && _a !== void 0 ? _a : previewError === null || previewError === void 0 ? void 0 : previewError.message}/>
      </Flex>);
    }
};
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    header: {
        marginBottom: ({ odsIframe }) => (odsIframe ? 0 : theme.spacing(4)),
    },
    paper: {
        borderRadius: theme.spacing(4),
        boxShadow: "none",
    },
    description: {
        marginBottom: theme.spacing(6),
    },
    tableOuterWrapper: {
        width: "100%",
        boxShadow: theme.shadows[4],
    },
    tableInnerWrapper: {
        flexGrow: 1,
        width: "100%",
        position: "relative",
        overflowX: "auto",
        marginTop: ({ descriptionPresent }) => descriptionPresent ? theme.spacing(6) : 0,
    },
    footnotesWrapper: {
        marginTop: theme.spacing(4),
        justifyContent: "space-between",
    },
    loadingWrapper: {
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
        padding: theme.spacing(5),
    },
}));
