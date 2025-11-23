import produce from "immer";
import { getOrderedTableColumns } from "../components/ui-helpers";
export const moveFields = produce((chartConfig, { source, destination, }) => {
    const fieldsArray = getOrderedTableColumns(chartConfig.fields);
    let groupFields = fieldsArray.filter((f) => f.isGroup);
    let columnFields = fieldsArray.filter((f) => !f.isGroup);
    let sourceFields = source.droppableId === "columns" ? columnFields : groupFields;
    let destinationFields = destination.droppableId === "columns" ? columnFields : groupFields;
    // Move from source to destination
    destinationFields.splice(destination.index, 0, sourceFields.splice(source.index, 1)[0]);
    // Update indexes and isGroup status for each field after moving
    groupFields.forEach((f, i) => {
        f.index = i;
        f.isGroup = true;
    });
    columnFields.forEach((f, i) => {
        f.index = groupFields.length + i;
        f.isGroup = false;
    });
    return chartConfig;
});
/**
 * When toggling `isGroup` of a field, we need to make sure the fields are correctly ordered
 */
export const updateIsGroup = produce((chartConfig, { field, value, }) => {
    if (!chartConfig.fields[field]) {
        return chartConfig;
    }
    // Update field
    chartConfig.fields[field].isGroup = value;
    // Get fields _without_ field that is updated
    const fieldsArray = getOrderedTableColumns(chartConfig.fields);
    const groupFields = fieldsArray.filter((f) => f.isGroup && f !== chartConfig.fields[field]);
    const columnFields = fieldsArray.filter((f) => !f.isGroup && f !== chartConfig.fields[field]);
    const allFields = [
        ...groupFields,
        // Always place between groups and columns (it will end up at the bottom of the groups or top of columns)
        chartConfig.fields[field],
        ...columnFields,
    ];
    // Update index for each field
    allFields.forEach((f, i) => {
        f.index = i;
    });
    return chartConfig;
});
/**
 * When toggling `isHidden` of a field, we need to make sure the fields are correctly ordered
 */
export const updateIsHidden = produce((chartConfig, { field, value, }) => {
    if (!chartConfig.fields[field]) {
        return chartConfig;
    }
    chartConfig.fields[field].isHidden = value;
    return chartConfig;
});
export const addSortingOption = produce((chartConfig, option) => {
    chartConfig.sorting.push(option);
    return chartConfig;
});
export const changeSortingOption = produce((chartConfig, { index, option }) => {
    chartConfig.sorting[index] = option;
    return chartConfig;
});
export const removeSortingOption = produce((chartConfig, { index }) => {
    chartConfig.sorting.splice(index, 1);
    return chartConfig;
});
export const changeSortingOptionOrder = produce((chartConfig, { index, sortingOrder }) => {
    if (chartConfig.sorting[index]) {
        chartConfig.sorting[index].sortingOrder = sortingOrder;
    }
    return chartConfig;
});
export const moveSortingOptions = produce((chartConfig, { source, destination, }) => {
    // Move from source to destination
    chartConfig.sorting.splice(destination.index, 0, chartConfig.sorting.splice(source.index, 1)[0]);
    return chartConfig;
});
