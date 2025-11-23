import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Drawer, Grow, IconButton, Link, Tab, Typography, } from "@mui/material";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { scaleLinear } from "d3-scale";
import { print } from "graphql";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import mitt from "mitt";
import { Fragment, useEffect, useMemo, useRef, useState, } from "react";
import { pipe, tap } from "wonka";
import { Switch } from "@/components/form";
import { MaybeTooltip } from "@/components/maybe-tooltip";
import { useDisclosure } from "@/components/use-disclosure";
import { flag, useFlag, useFlags } from "@/flags";
import { FLAGS } from "@/flags/types";
import { Icon } from "@/icons";
import { maybeWindow } from "@/utils/maybe-window";
import { useEvent } from "@/utils/use-event";
const visit = (t, visit) => {
    const q = [[t, []]];
    while (q.length) {
        const [item, parents] = q.shift();
        visit(item, parents);
        for (let [k, c] of Object.entries(item.children || {})) {
            const next = [c, [...parents, k]];
            q.push(next);
        }
    }
};
/**
 * Flatten the tree in a list, adding the path to every item
 */
const flatten = (timings) => {
    const all = [];
    visit(timings, (c, parents) => {
        if (c.start && c.end) {
            all.push({
                ...c,
                path: parents,
            });
        }
    });
    return all;
};
const byStart = (a, b) => (a.start < b.start ? -1 : 1);
const BAR_HEIGHT = 15;
/**
 * Shows a SVG flamegraph for resolver field timings recorded on the
 * server
 */
const Flamegraph = ({ timings, }) => {
    const rects = useMemo(() => {
        const sorted = timings.sort(byStart);
        const begin = sorted[0].start;
        // normalize so that there is the same amount of seconds per pixels
        // across timelines
        const MAX_REQUEST_TIME = 10 * 1000;
        const pixelScale = scaleLinear([begin, begin + MAX_REQUEST_TIME], [0, 500]);
        return sorted.map((x) => ({
            ...x,
            x0: pixelScale(x.start),
            x1: pixelScale(x.end),
            duration: Math.round(x.end - x.start),
        }));
    }, [timings]);
    return (<Box sx={{
            position: "relative",
            "& svg text": { fontSize: "10px" },
        }}>
      <svg width={900} height={50 + rects.length * BAR_HEIGHT}>
        <g>
          {rects.map((r, i) => (<Group left={r.x0} top={i * BAR_HEIGHT} key={i}>
              <rect x={0} y={0} height={BAR_HEIGHT} width={r.x1 - r.x0} fill="#ccc"/>
              <Text verticalAnchor="start" y={2}>
                {`${r.duration}ms - ${r.path.join(">")}
          `}
              </Text>
            </Group>))}
        </g>{" "}
      </svg>
    </Box>);
};
const CopyLink = ({ toCopy, ...props }) => {
    const { children, onClick, sx } = props;
    const [hasCopied, setHasCopied] = useState(false);
    const enhancedOnClick = useEvent((e) => {
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
        navigator.clipboard.writeText(toCopy);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 1000);
    });
    return (<Link {...props} onClick={enhancedOnClick} sx={{ cursor: "pointer", ...sx }}>
      {children} {hasCopied ? "✓" : null}
    </Link>);
};
const getOperationQueryName = (operation) => {
    var _a, _b;
    return (_b = (_a = operation.query.definitions.find((d) => d.kind === "OperationDefinition")) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.value;
};
/**
 * Collapsible according showing for each request that has been made
 * a accordion with name
 */
const AccordionOperation = ({ result, operation, start, end, maxTime, ...accordionProps }) => {
    var _a, _b, _c, _d;
    const duration = useMemo(() => {
        var _a, _b, _c, _d;
        const all = ((_a = result === null || result === void 0 ? void 0 : result.extensions) === null || _a === void 0 ? void 0 : _a.timings)
            ? flatten((_b = result === null || result === void 0 ? void 0 : result.extensions) === null || _b === void 0 ? void 0 : _b.timings).sort(byStart)
            : [];
        if (all.length === 0) {
            return 0;
        }
        return ((_c = maxBy(all, (x) => x.end)) === null || _c === void 0 ? void 0 : _c.end) - ((_d = minBy(all, (x) => x.start)) === null || _d === void 0 ? void 0 : _d.start);
    }, [(_a = result === null || result === void 0 ? void 0 : result.extensions) === null || _a === void 0 ? void 0 : _a.timings]);
    return (<Accordion {...accordionProps} data-testid="debug-panel-accordion">
      <AccordionSummary>
        <Box sx={{
            "& > * + *:not(:last-child)": {
                marginRight: "0.5rem",
                paddingRight: "0.5rem",
                borderRight: "1px solid",
                borderRightColor: "divider",
            },
        }}>
          <Typography variant="body2" sx={{ mb: 0 }}>
            {getOperationQueryName(operation)}
          </Typography>
          <div style={{ marginTop: 4 }}>
            <svg width={100} height={10}>
              <rect x={0} y={0} width={(duration / maxTime) * 100} height={10} fill="#ccc"/>
            </svg>
          </div>
          <Typography variant="caption">{duration}ms</Typography>
          <Link fontSize="small" whiteSpace="break-spaces" href={`/api/graphql?query=${encodeURIComponent(print(operation.query))}`} sx={{ my: 0 }} target="_blank" rel="noreferrer" onClick={(ev) => ev.stopPropagation()}>
            See in graphql editor
          </Link>
          <span>
            <CopyLink fontSize="small" toCopy={JSON.stringify(operation.variables, null, 2)} onClick={(ev) => {
            ev.stopPropagation();
        }}>
              Copy variables
            </CopyLink>
          </span>
          <Typography variant="caption" display="inline">
            SPARQL queries ({(_b = result === null || result === void 0 ? void 0 : result.extensions) === null || _b === void 0 ? void 0 : _b.queries.length})
          </Typography>
        </Box>
      </AccordionSummary>
      {accordionProps.expanded ? (<AccordionDetails>
          <div>
            <Typography variant="h5" gutterBottom>
              Variables
            </Typography>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {(result === null || result === void 0 ? void 0 : result.operation.variables) &&
                Object.entries(result.operation.variables).map(([k, v]) => {
                    return (<Box key={k}>
                      <Typography variant="caption">
                        <b>{k}</b>: {JSON.stringify(v, null, 2)}
                      </Typography>
                    </Box>);
                })}
            </div>
          </div>
          <Box sx={{ display: "grid", gridTemplateColumns: "40% 60%", mt: 2 }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}>
              <Typography variant="h5" gutterBottom>
                Resolvers
              </Typography>
              <div style={{ overflowX: "auto", marginTop: 8 }}>
                {((_c = result === null || result === void 0 ? void 0 : result.extensions) === null || _c === void 0 ? void 0 : _c.timings) && (<Flamegraph timings={flatten(result.extensions.timings)}/>)}
              </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}>
              <Typography variant="h5" gutterBottom>
                SPARQL queries ({(_d = result === null || result === void 0 ? void 0 : result.extensions) === null || _d === void 0 ? void 0 : _d.queries.length})
              </Typography>
              <Queries queries={sortBy(result === null || result === void 0 ? void 0 : result.extensions.queries, (q) => {
                return -(q.endTime - q.startTime);
            })}/>
            </div>
          </Box>
        </AccordionDetails>) : null}
    </Accordion>);
};
const Queries = ({ queries }) => {
    return (<div>
      {queries.map((q, i) => {
            const text = q.text.replace(/\n\n/gm, "\n");
            return (<div key={i} style={{ overflowX: "auto" }}>
            <div>
              <Typography variant="caption">
                {q.endTime - q.startTime}ms
              </Typography>{" "}
              -{" "}
              <CopyLink toCopy={q.text} sx={{ fontSize: "small" }}>
                Copy
              </CopyLink>
            </div>
            <Box cols={100} rows={10} component="textarea" fontSize="small" value={text}/>
          </div>);
        })}
    </div>);
};
const EmojiIconButton = ({ children, ...props }) => {
    return (<IconButton sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 32,
            height: 32,
            mr: 2,
        }} {...props}>
      {children}
    </IconButton>);
};
const useGraphqlOperationsController = () => {
    const opsStartMapRef = useRef(new Map());
    const opsEndMapRef = useRef(new Map());
    useEffect(() => {
        const handleOperation = (operation) => {
            opsStartMapRef.current.set(operation.key, Date.now());
            opsEndMapRef.current.set(operation.key, Date.now());
        };
        const handleResult = (result) => {
            opsEndMapRef.current.set(result.operation.key, Date.now());
            // Calls setState out of band since handleResult can be called while
            // rendering a component. setState cannot be called while rendering
            // a component.
            setTimeout(() => {
                setResults((results) => uniqBy([...results, result], (x) => x.operation.key));
            }, 0);
        };
        urqlEE.on("urql-received-operation", handleOperation);
        urqlEE.on("urql-received-result", handleResult);
        return () => {
            urqlEE.off("urql-received-operation", handleOperation);
            urqlEE.off("urql-received-result", handleResult);
        };
    });
    const [results, setResults] = useState([]);
    const handleReset = useEvent(() => {
        setResults([]);
    });
    return {
        opsStartMap: opsStartMapRef.current,
        opsEndMap: opsEndMapRef.current,
        reset: handleReset,
        results,
    };
};
function GqlDebug({ controller }) {
    const { opsStartMap, opsEndMap, reset, results } = controller;
    const [expandedId, setExpandedId] = useState();
    const window = maybeWindow();
    if (!window) {
        return null;
    }
    const preparedResults = sortBy(results, (r) => opsStartMap.get(r.operation.key)).filter((x) => { var _a; return (_a = x === null || x === void 0 ? void 0 : x.extensions) === null || _a === void 0 ? void 0 : _a.timings; });
    const maxOperationTime = Math.max(...preparedResults.map((r) => {
        const timings = flatten(r.extensions.timings);
        return Math.max(...timings.map((x) => x.end - x.start));
    }));
    return (<div>
      <Box>
        <Button variant="text" size="sm" onClick={reset}>
          Empty operations
        </Button>
      </Box>
      <Box sx={{ maxHeight: "500px" }}>
        {preparedResults.map((result, i) => (<AccordionOperation key={i} result={result} operation={result.operation} expanded={expandedId === result.operation.key} start={opsStartMap.get(result.operation.key)} end={opsEndMap.get(result.operation.key)} onChange={(_, expanded) => setExpandedId(expanded ? result.operation.key : undefined)} maxTime={maxOperationTime}/>))}
      </Box>
    </div>);
}
/**
 * Used to communicate between urql and the flamegraph
 * component
 */
const urqlEE = mitt();
/** @internal */
export const gqlFlamegraphExchange = ({ forward }) => {
    return (ops$) => pipe(ops$, tap((operation) => urqlEE.emit("urql-received-operation", operation)), forward, tap((result) => urqlEE.emit("urql-received-result", result)));
};
export const DebugPanel = () => {
    const { isOpen, open, close } = useDisclosure();
    const [tab, setTab] = useState("graphql");
    const gqlOperationsController = useGraphqlOperationsController();
    return (<>
      <Box sx={{ position: "fixed", bottom: 8, right: 8, zIndex: 10 }}>
        <Grow in>
          <IconButton data-testid="debug-panel-toggle" onClick={open}>
            🛠
          </IconButton>
        </Grow>
      </Box>
      <Drawer open={isOpen} anchor="bottom" elevation={2} onClose={close}>
        <TabContext value={tab}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
            <TabList onChange={(_, tab) => setTab(tab)}>
              <Tab value="graphql" label="GraphQL"/>
              <Tab value="flags" label="🚩 Flags"/>
            </TabList>
            <EmojiIconButton onClick={close}>
              <Icon name="close"/>
            </EmojiIconButton>
          </Box>
          <Divider />
          <TabPanel value="graphql">
            <GqlDebug controller={gqlOperationsController}/>
          </TabPanel>
          <TabPanel value="flags">
            <FlagList />
          </TabPanel>
        </TabContext>
      </Drawer>
    </>);
};
const FlagList = () => {
    const flags = useFlags();
    return (<div style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            columnGap: "1rem",
            rowGap: "0.5rem",
            alignItems: "center",
        }}>
      {flags.map((flag) => (<Fragment key={flag.name}>
          <Box sx={{ display: "flex" }}>
            <FlagSwitch flagName={flag.name}/>
          </Box>
          <Typography variant="body2" style={{ paddingLeft: "0.5rem" }}>
            {flag.description}
          </Typography>
        </Fragment>))}
    </div>);
};
const FlagSwitch = ({ flagName }) => {
    const flagValue = useFlag(flagName);
    const isTextFlag = useMemo(() => {
        var _a;
        return ((_a = FLAGS.find((f) => f.name === flagName)) === null || _a === void 0 ? void 0 : _a.type) === "text";
    }, [flagName]);
    const handleChange = useEvent((e) => {
        flag(flagName, e.target.checked);
    });
    return (<MaybeTooltip title={isTextFlag ? "This flag can only be set through the URL" : undefined}>
      <div>
        <Switch label={flagName.toUpperCase()} checked={!!flagValue} disabled={isTextFlag} onChange={handleChange}/>
      </div>
    </MaybeTooltip>);
};
