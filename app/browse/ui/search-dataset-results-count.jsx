import { Plural } from "@lingui/macro";
import { Typography } from "@mui/material";
export const SearchDatasetResultsCount = ({ cubes, }) => {
    return (<Typography variant="h5" component="p" aria-live="polite" data-testid="search-results-count">
      {cubes.length > 0 && (<Plural id="dataset.results" value={cubes.length} zero="No datasets" one="# dataset" other="# datasets"/>)}
    </Typography>);
};
