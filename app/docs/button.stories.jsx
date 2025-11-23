import { Button } from "@mui/material";
import { Icon } from "../icons";
import SvgIcChevronLeft from "../icons/components/IcChevronLeft";
import SvgIcChevronRight from "../icons/components/IcChevronRight";
const meta = {
    component: Button,
    title: "components / Button",
};
export default meta;
export const Contained = {
    args: {
        startIcon: <Icon name="share"/>,
        variant: "contained",
        children: <span>Contained button</span>,
    },
};
export const OutlineButton = () => (<Button variant="outlined">Outlined button</Button>);
export const InlineButton = () => (<Button startIcon={<SvgIcChevronLeft />} variant="text">
    <span>Inline button</span>
  </Button>);
export const BoldInlineButton = () => (<Button size="sm" startIcon={<SvgIcChevronLeft />} variant="text">
    Bold inline button
  </Button>);
export const PublishButton = () => (<Button size="sm" endIcon={<SvgIcChevronRight />}>
    Publish this dataset
  </Button>);
export const LearnMoreButton = () => (<Button endIcon={<SvgIcChevronRight />}>Learn more</Button>);
