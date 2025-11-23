import { Trans } from "@lingui/macro";
import { Box, Link, Link as MUILink, Stack, Typography, } from "@mui/material";
import sortBy from "lodash/sortBy";
import NextLink from "next/link";
import { DataDownloadMenu } from "@/components/data-download";
import { Tag } from "@/components/tag";
import { useFormatDate } from "@/formatters";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { makeOpenDataLink } from "@/utils/opendata";
export const DatasetMetadata = ({ cube, showTitle, sparqlEditorUrl, dataSource, queryFilters, }) => {
    var _a, _b, _c;
    const locale = useLocale();
    const formatDate = useFormatDate();
    const openDataLink = cube ? makeOpenDataLink(locale, cube) : null;
    return (<div>
      {showTitle ? (<Typography variant="h5" fontWeight={700} sx={{ mb: 4 }}>
          {cube.title}
        </Typography>) : null}
      <Stack spacing={6}>
        {cube.publisher && (<div>
            <DatasetMetadataTitle>
              <Trans id="dataset.metadata.source">Source</Trans>
            </DatasetMetadataTitle>
            <DatasetMetadataBody>
              <Box component="span" sx={{ "> a": { color: "grey.900" } }} dangerouslySetInnerHTML={{
                __html: cube.publisher,
            }}/>
            </DatasetMetadataBody>
          </div>)}
        <div>
          <DatasetMetadataTitle>
            <Trans id="dataset.metadata.date.created">Date Created</Trans>
          </DatasetMetadataTitle>
          <DatasetMetadataBody>
            {cube.datePublished ? ((_a = formatDate(cube.datePublished)) !== null && _a !== void 0 ? _a : "–") : "–"}
          </DatasetMetadataBody>
        </div>
        <div>
          <DatasetMetadataTitle>
            <Trans id="dataset.metadata.version">Version</Trans>
          </DatasetMetadataTitle>
          <DatasetMetadataBody>{(_b = cube.version) !== null && _b !== void 0 ? _b : "–"}</DatasetMetadataBody>
        </div>
        <div>
          <DatasetMetadataTitle>
            <Trans id="dataset.metadata.email">Contact points</Trans>
          </DatasetMetadataTitle>
          <DatasetMetadataBody>
            {(_c = cube.contactPoints) === null || _c === void 0 ? void 0 : _c.map((contactPoint) => {
            var _a;
            return contactPoint.email && contactPoint.name ? (<DatasetMetadataLink key={contactPoint.email} href={`mailto:${contactPoint.email}`} label={(_a = contactPoint.name) !== null && _a !== void 0 ? _a : contactPoint.email}/>) : ("–");
        })}
          </DatasetMetadataBody>
        </div>
        <div>
          <DatasetMetadataTitle>
            <Trans id="dataset.metadata.furtherinformation">
              Further information
            </Trans>
          </DatasetMetadataTitle>
          <DatasetMetadataBody sx={{ mt: "1px" }}>
            {cube.landingPage ? (<DatasetMetadataLink href={cube.landingPage} external label={<Trans id="dataset.metadata.learnmore">
                    More about the dataset
                  </Trans>}/>) : ("–")}
            {sparqlEditorUrl ? (<DatasetSparqlQuery url={sparqlEditorUrl}/>) : null}
            {queryFilters ? (<DataDownloadMenu dataSource={dataSource} title={cube.title} filters={queryFilters}/>) : null}
            {openDataLink ? (<DatasetMetadataLink external label="OpenData.swiss" href={openDataLink}/>) : null}
          </DatasetMetadataBody>
        </div>
        <Stack spacing={2.5}>
          <DatasetMetadataTitle>
            <Trans id="dataset-preview.keywords">Keywords</Trans>
          </DatasetMetadataTitle>
          <DatasetTags cube={cube}/>
        </Stack>
      </Stack>
    </div>);
};
const DatasetMetadataTitle = ({ children }) => (<Typography variant="h6" component="p" fontWeight={700}>
    {children}
  </Typography>);
const DatasetMetadataBody = ({ children, sx, }) => (<Typography variant="body2" sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        mt: "1px",
        ...sx,
    }}>
    {children}
  </Typography>);
const DatasetMetadataLink = ({ href, label, external, ...props }) => (<Link underline="hover" href={href} target="_blank" rel="noopener noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }} {...props}>
    {external ? <Icon name="link" size={20}/> : null}
    {label}
  </Link>);
const DatasetSparqlQuery = ({ url }) => {
    return (<Link underline="hover" href={url} target="_blank" rel="noopener noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Icon name="legacyLinkExternal" size={16}/>
      <Trans id="chart-controls.sparql-query">SPARQL query</Trans>
    </Link>);
};
const DatasetTags = ({ cube }) => {
    var _a;
    return (<Stack spacing={1} direction="column">
      {((_a = cube.creator) === null || _a === void 0 ? void 0 : _a.iri) && (<DatasetMetadataTag type="organization" iri={cube.creator.iri} label={cube.creator.label}/>)}
      {cube.themes &&
            sortBy(cube.themes, (d) => d.label).map((t) => t.iri &&
                t.label && (<DatasetMetadataTag key={t.iri} type="theme" iri={t.iri} label={t.label}/>))}
    </Stack>);
};
const DatasetMetadataTag = ({ type, iri, label, }) => {
    return (<NextLink key={iri} href={`/browse/${type}/${encodeURIComponent(iri)}`} passHref legacyBehavior>
      <Tag component={MUILink} 
    // @ts-ignore
    underline="none" title={label !== null && label !== void 0 ? label : undefined} sx={{
            display: "inline-block",
            maxWidth: "100%",
            borderRadius: "16px",
            color: "text.primary",
        }}>
        {label}
      </Tag>
    </NextLink>);
};
