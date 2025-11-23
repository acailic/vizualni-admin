import { makeStyles } from "@mui/styles";
import { useChartState } from "@/charts/shared/chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";
import { useIsMobile } from "@/utils/use-is-mobile";
export const Ruler = (props) => {
    const { rotate = false } = props;
    const [{ type, visible, observation }] = useInteraction();
    return (<>
      {type === "tooltip" && visible && observation && (<RulerInner d={observation} rotate={rotate}/>)}
    </>);
};
const RulerInner = (props) => {
    const { d, rotate } = props;
    const { getTooltipInfo, bounds } = useChartState();
    const { xAnchor, value, datum, placement, values } = getTooltipInfo(d);
    return (<RulerContent rotate={rotate} xValue={value} values={values} chartHeight={bounds.chartHeight} margins={bounds.margins} xAnchor={xAnchor} datum={datum} placement={placement}/>);
};
const useStyles = makeStyles((theme) => ({
    left: {
        width: 0,
        position: "absolute",
        borderWidth: 0.5,
        borderStyle: "solid",
        borderColor: theme.palette.cobalt[50],
        pointerEvents: "none",
        transform: "translateX(-50%)",
    },
    right: {
        position: "absolute",
        fontWeight: "bold",
        backgroundColor: theme.palette.background.paper,
        transform: ({ rotate }) => rotate
            ? "translateX(-50%) translateY(50%) rotate(90deg)"
            : "translateX(-50%)",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        fontSize: "0.875rem",
    },
}));
export const RulerContent = (props) => {
    const { rotate, xValue, chartHeight, margins, xAnchor } = props;
    const classes = useStyles({ rotate });
    const isMobile = useIsMobile();
    return (<>
      <div className={classes.left} style={{
            height: chartHeight,
            left: xAnchor + margins.left,
            top: margins.top,
        }}/>
      {!isMobile && (<div className={classes.right} style={{
                left: xAnchor + margins.left,
                top: chartHeight + margins.top + 6,
            }}>
          {xValue}
        </div>)}
    </>);
};
