import { DataCubeMetadata } from "@/domain/data";

export const makeOpenDataLink = (lang: string, cube: DataCubeMetadata) => {
  const identifier = cube?.identifier;

  if (!identifier) {
    return;
  }

  // Link to Serbian Open Data Portal
  return `https://data.gov.rs/${lang}/datasets/${encodeURIComponent(identifier)}`;
};
