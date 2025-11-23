import { Typography } from "@mui/material";
import { getLabelWithUnit } from "@/charts/shared/chart-helpers";
import { MaybeTooltip } from "@/components/maybe-tooltip";
import { OpenMetadataPanelWrapper } from "@/components/metadata-panel";
export const ComponentLabel = ({ component, tooltipProps, linkToMetadataPanel, }) => {
    return linkToMetadataPanel ? (<OpenMetadataPanelWrapper component={component}>
      <ComponentLabelInner component={component}/>
    </OpenMetadataPanelWrapper>) : component.description ? (<MaybeTooltip title={component.description} tooltipProps={tooltipProps}>
      <div>
        <ComponentLabelInner component={component}/>
      </div>
    </MaybeTooltip>) : (<ComponentLabelInner component={component}/>);
};
const ComponentLabelInner = ({ component }) => {
    const label = getLabelWithUnit(component);
    return (<Typography variant="h6" component="span" color="monochrome.500" textTransform="uppercase">
      {label}
    </Typography>);
};
