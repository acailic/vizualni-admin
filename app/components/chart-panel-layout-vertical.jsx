export const ChartPanelLayoutVertical = ({ blocks, renderBlock, }) => {
    return <>{blocks.map(renderBlock)}</>;
};
