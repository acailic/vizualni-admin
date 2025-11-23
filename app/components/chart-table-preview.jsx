import { Box } from "@mui/material";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { hasChartConfigs, useConfiguratorState } from "@/configurator";
const ChartTablePreviewContext = createContext({
    isTable: false,
    setIsTable: () => { },
    setIsTableRaw: () => { },
    containerRef: { current: null },
    containerHeight: "auto",
    computeContainerHeight: () => undefined,
});
export const useChartTablePreview = () => {
    const ctx = useContext(ChartTablePreviewContext);
    if (ctx === undefined) {
        throw Error("You need to wrap your component in <ChartTablePreviewProvider /> to useChartTablePreview()");
    }
    return ctx;
};
/**
 * Keeps track of whether we are looking at the chart or a table.
 * Before changing type, the height of containerRef is measured
 * and passed back into containerHeight.
 */
export const ChartTablePreviewProvider = ({ children, }) => {
    const [configuratorState] = useConfiguratorState(hasChartConfigs);
    const [isTable, setIsTableRaw] = useState(false);
    const containerHeight = useRef("auto");
    const containerRef = useRef(null);
    const computeContainerHeight = () => {
        if (!containerRef.current) {
            return;
        }
        const { height } = containerRef.current.getBoundingClientRect();
        containerHeight.current = height;
    };
    const setIsTable = useCallback((v) => {
        computeContainerHeight();
        return setIsTableRaw(v);
    }, [setIsTableRaw]);
    useEffect(() => {
        containerHeight.current = "auto";
    }, [configuratorState.activeChartKey]);
    const ctx = useMemo(() => {
        return {
            isTable,
            setIsTable,
            setIsTableRaw,
            containerRef,
            containerHeight: containerHeight.current,
            computeContainerHeight,
        };
    }, [isTable, setIsTable, setIsTableRaw, containerRef, containerHeight]);
    return (<ChartTablePreviewContext.Provider value={ctx}>
      {children}
    </ChartTablePreviewContext.Provider>);
};
export const TABLE_PREVIEW_WRAPPER_CLASS_NAME = "table-preview-wrapper";
export const ChartTablePreviewWrapper = ({ children, }) => {
    const { containerRef, containerHeight } = useChartTablePreview();
    return (<Box ref={containerRef} className={TABLE_PREVIEW_WRAPPER_CLASS_NAME} sx={{
            minWidth: 0,
            height: containerHeight,
            marginTop: 4,
            marginBottom: 2,
            flexGrow: 1,
        }}>
      {children}
    </Box>);
};
