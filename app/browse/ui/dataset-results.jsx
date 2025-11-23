import { Trans } from "@lingui/macro";
import { Typography } from "@mui/material";
import { DatasetResult } from "@/browse/ui/dataset-result";
import { Loading, LoadingDataError } from "@/components/hint";
export const DatasetResults = ({ fetching, error, cubes, datasetResultProps, }) => {
    if (fetching) {
        return <Loading />;
    }
    if (error) {
        return <LoadingDataError message={error.message}/>;
    }
    if (cubes.length === 0) {
        return (<Typography variant="h2" sx={{ mt: 8, color: "grey.600", textAlign: "center" }}>
        <Trans id="No results">No results</Trans>
      </Typography>);
    }
    return (<div>
      {cubes.map(({ cube, highlightedTitle, highlightedDescription }) => (<DatasetResult key={cube.iri} dataCube={cube} highlightedTitle={highlightedTitle} highlightedDescription={highlightedDescription} {...datasetResultProps === null || datasetResultProps === void 0 ? void 0 : datasetResultProps({ cube })}/>))}
    </div>);
};
