import { Box, Typography } from "@mui/material";
import { LegendItem } from "@/charts/shared/legend-color";
// Generic
export const TooltipSingle = ({ xValue, segment, yValue, yError, }) => {
    return (<div>
      {xValue && (<Typography component="div" variant="caption" sx={{ fontWeight: "bold", whiteSpace: "wrap" }}>
          {xValue}
        </Typography>)}
      {segment && (<Typography component="div" variant="caption">
          {segment}
        </Typography>)}
      {yValue && (<Typography component="div" variant="caption">
          {yValue}
          {yError !== null && yError !== void 0 ? yError : null}
        </Typography>)}
    </div>);
};
export const TooltipMultiple = ({ xValue, segmentValues, }) => {
    return (<Box>
      {xValue && (<Typography component="div" variant="caption" sx={{ fontWeight: "bold" }}>
          {xValue}
        </Typography>)}
      {segmentValues.map((d, i) => {
            var _a, _b;
            return (<LegendItem key={i} label={`${d.label}: ${d.value}${(_a = d.error) !== null && _a !== void 0 ? _a : ""}`} color={d.color} symbol={(_b = d.symbol) !== null && _b !== void 0 ? _b : "square"} smaller/>);
        })}
    </Box>);
};
// Chart Specific
export const TooltipScatterplot = ({ firstLine, secondLine, thirdLine, }) => {
    return (<Box>
      {firstLine && (<Typography component="div" variant="caption" sx={{ fontWeight: "bold" }}>
          {firstLine}
        </Typography>)}
      {secondLine && (<Typography component="div" variant="caption">
          {secondLine}
        </Typography>)}
      {thirdLine && (<Typography component="div" variant="caption">
          {thirdLine}
        </Typography>)}
    </Box>);
};
