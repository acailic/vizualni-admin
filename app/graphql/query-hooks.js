import gql from 'graphql-tag';
import * as Urql from 'urql';
export var DataCubePublicationStatus;
(function (DataCubePublicationStatus) {
    DataCubePublicationStatus["Draft"] = "DRAFT";
    DataCubePublicationStatus["Published"] = "PUBLISHED";
})(DataCubePublicationStatus || (DataCubePublicationStatus = {}));
export var RelatedDimensionType;
(function (RelatedDimensionType) {
    RelatedDimensionType["StandardError"] = "StandardError";
    RelatedDimensionType["ConfidenceUpperBound"] = "ConfidenceUpperBound";
    RelatedDimensionType["ConfidenceLowerBound"] = "ConfidenceLowerBound";
})(RelatedDimensionType || (RelatedDimensionType = {}));
export var ScaleType;
(function (ScaleType) {
    ScaleType["Ordinal"] = "Ordinal";
    ScaleType["Nominal"] = "Nominal";
    ScaleType["Interval"] = "Interval";
    ScaleType["Ratio"] = "Ratio";
})(ScaleType || (ScaleType = {}));
export var SearchCubeFilterType;
(function (SearchCubeFilterType) {
    SearchCubeFilterType["TemporalDimension"] = "TemporalDimension";
    SearchCubeFilterType["DataCubeTheme"] = "DataCubeTheme";
    SearchCubeFilterType["DataCubeOrganization"] = "DataCubeOrganization";
    SearchCubeFilterType["DataCubeAbout"] = "DataCubeAbout";
    SearchCubeFilterType["DataCubeTermset"] = "DataCubeTermset";
})(SearchCubeFilterType || (SearchCubeFilterType = {}));
export var SearchCubeResultOrder;
(function (SearchCubeResultOrder) {
    SearchCubeResultOrder["Score"] = "SCORE";
    SearchCubeResultOrder["TitleAsc"] = "TITLE_ASC";
    SearchCubeResultOrder["CreatedDesc"] = "CREATED_DESC";
})(SearchCubeResultOrder || (SearchCubeResultOrder = {}));
export var TimeUnit;
(function (TimeUnit) {
    TimeUnit["Year"] = "Year";
    TimeUnit["Month"] = "Month";
    TimeUnit["Week"] = "Week";
    TimeUnit["Day"] = "Day";
    TimeUnit["Hour"] = "Hour";
    TimeUnit["Minute"] = "Minute";
    TimeUnit["Second"] = "Second";
})(TimeUnit || (TimeUnit = {}));
export const SearchCubesDocument = gql `
    query SearchCubes($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $query: String, $order: SearchCubeResultOrder, $includeDrafts: Boolean, $fetchDimensionTermsets: Boolean, $filters: [SearchCubeFilter!]) {
  searchCubes(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    query: $query
    order: $order
    includeDrafts: $includeDrafts
    fetchDimensionTermsets: $fetchDimensionTermsets
    filters: $filters
  ) {
    highlightedTitle
    highlightedDescription
    cube
  }
}
    `;
export function useSearchCubesQuery(options = {}) {
    return Urql.useQuery({ query: SearchCubesDocument, ...options });
}
;
export const DataCubeLatestIriDocument = gql `
    query DataCubeLatestIri($sourceType: String!, $sourceUrl: DataSourceUrl!, $cubeFilter: DataCubeLatestIriFilter!) {
  dataCubeLatestIri(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeLatestIriQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeLatestIriDocument, ...options });
}
;
export const DataCubeUnversionedIriDocument = gql `
    query DataCubeUnversionedIri($sourceType: String!, $sourceUrl: DataSourceUrl!, $cubeFilter: DataCubeUnversionedIriFilter!) {
  dataCubeUnversionedIri(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeUnversionedIriQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeUnversionedIriDocument, ...options });
}
;
export const DataCubeComponentsDocument = gql `
    query DataCubeComponents($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeComponentFilter!) {
  dataCubeComponents(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeComponentsQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeComponentsDocument, ...options });
}
;
export const DataCubeDimensionGeoShapesDocument = gql `
    query DataCubeDimensionGeoShapes($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeDimensionGeoShapesCubeFilter!) {
  dataCubeDimensionGeoShapes(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeDimensionGeoShapesQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeDimensionGeoShapesDocument, ...options });
}
;
export const DataCubeMetadataDocument = gql `
    query DataCubeMetadata($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeMetadataFilter!) {
  dataCubeMetadata(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeMetadataQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeMetadataDocument, ...options });
}
;
export const DataCubeComponentTermsetsDocument = gql `
    query DataCubeComponentTermsets($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeTermsetFilter!) {
  dataCubeComponentTermsets(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeComponentTermsetsQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeComponentTermsetsDocument, ...options });
}
;
export const DataCubeObservationsDocument = gql `
    query DataCubeObservations($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubeObservationFilter!) {
  dataCubeObservations(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubeObservationsQuery(options = {}) {
    return Urql.useQuery({ query: DataCubeObservationsDocument, ...options });
}
;
export const DataCubePreviewDocument = gql `
    query DataCubePreview($sourceType: String!, $sourceUrl: DataSourceUrl!, $locale: String!, $cubeFilter: DataCubePreviewFilter!) {
  dataCubePreview(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    locale: $locale
    cubeFilter: $cubeFilter
  )
}
    `;
export function useDataCubePreviewQuery(options = {}) {
    return Urql.useQuery({ query: DataCubePreviewDocument, ...options });
}
;
export const PossibleFiltersDocument = gql `
    query PossibleFilters($sourceType: String!, $sourceUrl: DataSourceUrl!, $cubeFilter: DataCubePossibleFiltersCubeFilter!) {
  possibleFilters(
    sourceType: $sourceType
    sourceUrl: $sourceUrl
    cubeFilter: $cubeFilter
  ) {
    type
    id
    value
  }
}
    `;
export function usePossibleFiltersQuery(options = {}) {
    return Urql.useQuery({ query: PossibleFiltersDocument, ...options });
}
;
