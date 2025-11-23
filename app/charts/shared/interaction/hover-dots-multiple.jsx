import { makeStyles } from "@mui/styles";
import { useChartState } from "@/charts/shared/chart-state";
import { useInteraction } from "@/charts/shared/use-interaction";
export const HoverDotMultiple = () => {
    const [{ type, visible, observation }] = useInteraction();
    return (<>
      {type === "tooltip" && visible && observation && (<HoverDots d={observation}/>)}
    </>);
};
const useStyles = makeStyles((theme) => ({
    dot: {
        position: "absolute",
        width: 6,
        height: 6,
        borderRadius: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: theme.palette.grey[100],
        transform: "translate3d(-50%, -50%, 0)",
        pointerEvents: "none",
    },
}));
const HoverDots = ({ d }) => {
    const { getTooltipInfo, bounds: { margins }, } = useChartState();
    const classes = useStyles();
    const { xAnchor, values } = getTooltipInfo(d);
    return (<>
      {values &&
            values.map((value, i) => !value.hide &&
                value.axis === "y" &&
                value.axisOffset !== undefined && (<div key={i} className={classes.dot} style={{
                    backgroundColor: value.color,
                    left: xAnchor + margins.left,
                    top: value.axisOffset + margins.top,
                }}/>))}
    </>);
};
