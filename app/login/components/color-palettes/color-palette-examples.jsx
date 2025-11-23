import { Trans } from "@lingui/macro";
import { interpolatePurples, interpolateRdYlGn } from "d3-scale-chromatic";
import { Flex } from "@/components/flex";
import { Label } from "@/components/form";
import { ColorSquare } from "@/configurator/components/chart-controls/color-palette";
import { ColorRamp } from "@/configurator/components/chart-controls/color-ramp";
const categoricalExamplePalette = [
    "#663778",
    "#FF9900",
    "#FF5F55",
    "#3F7397",
    "#00B040",
    "#9F2020",
    "#BCBD21",
];
export const ColorPaletteExample = ({ type }) => {
    let example = null;
    switch (type) {
        case "sequential":
            example = (<ColorRamp height={20} width={146} colorInterpolator={interpolatePurples}/>);
            break;
        case "diverging":
            example = (<ColorRamp height={20} width={146} colorInterpolator={interpolateRdYlGn}/>);
            break;
        case "categorical":
            example = (<Flex gap={"1px"}>
          {categoricalExamplePalette.map((color) => (<ColorSquare key={`option-${color}`} color={color}/>))}
        </Flex>);
            break;
        default:
            const _exhaustiveCheck = type;
            return _exhaustiveCheck;
    }
    return (<Flex flexDirection={"column"}>
      <Label htmlFor="custom-color-palette-example">
        <Trans id="controls.custom-color-palettes.example">Example</Trans>
      </Label>
      {example}
    </Flex>);
};
