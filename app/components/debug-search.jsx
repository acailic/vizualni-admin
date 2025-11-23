import { Box, Chip, FormControlLabel, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { SearchCubeFilterType, useSearchCubesQuery, } from "@/graphql/query-hooks";
const territoryTheme = {
    name: "Territory theme",
    type: SearchCubeFilterType.DataCubeTheme,
    value: "https://register.ld.admin.ch/opendataswiss/category/territory",
};
const geographyTheme = {
    name: "Geography theme",
    type: SearchCubeFilterType.DataCubeTheme,
    value: "https://register.ld.admin.ch/opendataswiss/category/geography",
};
// @ts-ignore
const bafuCreator = {
    name: "BAFU creator",
    type: SearchCubeFilterType.DataCubeOrganization,
    value: "https://register.ld.admin.ch/opendataswiss/org/bundesamt-fur-umwelt-bafu",
};
// @ts-ignore
const mobilityTheme = {
    name: "Mobility theme",
    type: "DataCubeTheme",
    value: "https://register.ld.admin.ch/opendataswiss/category/mobility",
};
const Search = ({ query, locale, filters, includeDrafts, sourceUrl, }) => {
    var _a, _b, _c, _d;
    const startTimeRef = useRef(0);
    const [endTime, setEndTime] = useState(0);
    useEffect(() => {
        startTimeRef.current = Date.now();
    }, [query, locale, includeDrafts]);
    const [cubes] = useSearchCubesQuery({
        variables: {
            locale,
            query,
            filters: filters.map(({ type, value }) => ({ type, value })),
            includeDrafts,
            sourceUrl,
            sourceType: "sparql",
        },
    });
    useEffect(() => {
        if (cubes.data) {
            setEndTime(Date.now());
        }
    }, [cubes.data]);
    const responseTime = startTimeRef.current && endTime
        ? endTime - startTimeRef.current
        : undefined;
    const queries = (_a = cubes === null || cubes === void 0 ? void 0 : cubes.extensions) === null || _a === void 0 ? void 0 : _a.queries;
    return (<Box>
      <Typography variant="h5">
        &quot;{query}&quot;&nbsp;
        {filters
            ? filters.map((f) => (<Chip key={f.value} size="small" label={f.name}/>))
            : null}
      </Typography>

      {cubes.fetching ? (<CircularProgress />) : (<div>
          <Typography variant="caption" color={((_b = cubes.data) === null || _b === void 0 ? void 0 : _b.searchCubes.length) === 0 ? "error" : undefined}>
            {(_c = cubes.data) === null || _c === void 0 ? void 0 : _c.searchCubes.length} results |{" "}
          </Typography>
          <Typography variant="caption" color={responseTime && responseTime > 1500 ? "error" : undefined}>
            {responseTime !== undefined ? `${responseTime}ms` : ""}
          </Typography>
        </div>)}
      {cubes.error ? (<Typography color="error">{cubes.error.message}</Typography>) : null}

      <Stack spacing={4}>
        {(_d = cubes.data) === null || _d === void 0 ? void 0 : _d.searchCubes.map(({ cube, highlightedTitle, highlightedDescription }) => {
            var _a;
            return (<div key={cube.iri}>
                <Typography variant="h6" dangerouslySetInnerHTML={{ __html: highlightedTitle }}/>
                <Typography variant="caption" dangerouslySetInnerHTML={{
                    __html: (_a = highlightedDescription === null || highlightedDescription === void 0 ? void 0 : highlightedDescription.slice(0, 100)) !== null && _a !== void 0 ? _a : "" + "...",
                }}/>
                <br />
                <Typography variant="caption">{cube.iri}</Typography>
                <Stack spacing={2} direction="row">
                  {cube.themes.map((t) => (<Chip key={t.iri} size="small" label={t.label}/>))}
                  <Chip size="small" label={cube.publicationStatus}/>
                </Stack>
              </div>);
        })}
      </Stack>
      <Accordion sx={{ mt: 2, borderTop: 0 }}>
        <AccordionSummary sx={{ typography: "h4" }}>queries</AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {queries
            ? queries.map((q, i) => {
                return (<div key={i}>
                      <Typography variant="h5">{q.label}</Typography>
                      <Stack direction="row" spacing={4}>
                        <div>
                          <Typography variant="caption">Duration</Typography>
                          <Typography variant="body2">
                            {q.endTime - q.startTime}ms
                          </Typography>
                        </div>
                      </Stack>
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary sx={{ typography: "caption" }}>
                          Query
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box component="pre" sx={{ fontSize: "small" }}>
                            {q.text}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </div>);
            })
            : null}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>);
};
export const DebugSearch = () => {
    const [includeDrafts, setIncludeDrafts] = useState(false);
    const [sourceUrl, setSourceUrl] = useState("https://int.lindas.admin.ch/query");
    const [customSearch, setCustomSearch] = useState("");
    const handleKeyUp = (ev) => {
        if (ev.key === "Enter") {
            if (!ev.target) {
                return;
            }
            setCustomSearch(ev.target.value);
        }
    };
    return (<Box sx={{
            margin: "1rem",
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(1fr, 300px))",
        }}>
      <FormControlLabel label="Drafts" control={<Switch value={includeDrafts} onChange={(_ev, checked) => setIncludeDrafts(checked)}/>}/>
      <Select onChange={(ev) => setSourceUrl(ev.target.value)} value={sourceUrl}>
        <MenuItem value="https://int.lindas.admin.ch/query">int</MenuItem>
        <MenuItem value="https://lindas.admin.ch/query">prod</MenuItem>
      </Select>
      <TextField defaultValue="" placeholder="Search..." onKeyUp={handleKeyUp}/>
      {customSearch !== "" ? (<Search key={customSearch} sourceUrl={sourceUrl} includeDrafts={includeDrafts} query={customSearch} filters={[]} locale="sr-Latn"/>) : (<>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="bruit" filters={[]} locale="sr-Latn"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="Bathing" filters={[territoryTheme]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="bath" filters={[territoryTheme]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="Ausgaben" filters={[]} locale="sr-Latn"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="" filters={[territoryTheme]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="SFOE" filters={[geographyTheme]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="National economy" filters={[]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="Einmalvergütung" filters={[]} locale="sr-Latn"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="zeitverzögert" filters={[]} locale="sr-Latn"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="öffentlich" filters={[]} locale="sr-Latn"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="WASTA" filters={[]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="tari" filters={[]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="SFA" filters={[]} locale="en"/>
          <Search sourceUrl={sourceUrl} includeDrafts={includeDrafts} query="émissions de gaz à effet de serre" filters={[]} locale="sr-Latn"/>
        </>)}
    </Box>);
};
