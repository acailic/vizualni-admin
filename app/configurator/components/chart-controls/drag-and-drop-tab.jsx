import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { MoveDragButton } from "@/components/move-drag-button";
import { DraggableTab } from "@/configurator/components/chart-controls/control-tab";
import { ControlSection, ControlSectionContent, SectionTitle, } from "@/configurator/components/chart-controls/section";
import { getIconName } from "@/configurator/components/ui-helpers";
import { useActiveChartField } from "@/configurator/config-form";
const useStyles = makeStyles((theme) => ({
    filterRow: {
        display: "grid",
        gridTemplateColumns: "auto min-content",
        overflow: "hidden",
        width: "100%",
        gridColumnGap: theme.spacing(2),
        gridTemplateRows: "min-content min-content",
        gridTemplateAreas: '"description drag-button" "select drag-button"',
        "& > *": {
            overflow: "hidden",
        },
    },
    dragButtons: {
        gridArea: "drag-button",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 0,
        flexShrink: 0,
        marginRight: theme.spacing(4),
    },
}));
export const TabDropZone = ({ id, title, items, dimensions, measures, isDropDisabled, emptyComponent, }) => {
    const classes = useStyles();
    const components = [...dimensions, ...measures];
    return (<Droppable droppableId={id} isDropDisabled={isDropDisabled}>
      {({ innerRef, placeholder }) => {
            return (<ControlSection collapse>
            <SectionTitle>{title}</SectionTitle>
            <ControlSectionContent role="tablist" aria-labelledby={`controls-${id}`} px="none">
              <div ref={innerRef} style={{ position: "relative", minHeight: 60, padding: 0 }}>
                {items.length === 0 && emptyComponent ? emptyComponent : null}
                {items.map(({ componentId, index, isHidden }, i) => {
                    return (<Draggable key={componentId} draggableId={componentId} index={i}>
                      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => {
                            const component = components.find((d) => d.id === componentId);
                            return (<Box ref={innerRef} {...draggableProps} {...dragHandleProps} className={classes.filterRow}>
                            {component ? (<DraggableTabField key={componentId} component={component} value={componentId} upperLabel={<Trans id="table.column.no">
                                    Column {index + 1}
                                  </Trans>} isDragging={isDragging} disabled={isHidden}/>) : null}
                            <Box className={classes.dragButtons}>
                              <MoveDragButton />
                            </Box>
                          </Box>);
                        }}
                    </Draggable>);
                })}
                {placeholder}
              </div>
            </ControlSectionContent>
          </ControlSection>);
        }}
    </Droppable>);
};
const DraggableTabField = ({ component, value, isDragging, upperLabel, disabled, }) => {
    const field = useActiveChartField({ value });
    const iconName = getIconName(`tableColumn${component.__typename}${disabled ? "Hidden" : ""}`);
    return (<DraggableTab component={component} value={`${field.value}`} upperLabel={upperLabel} checked={field.checked} onClick={field.onClick} isDragging={isDragging} disabled={disabled} iconName={iconName}/>);
};
