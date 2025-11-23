import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useFlag } from "@/flags";
const LazyDebugPanel = dynamic(() => import("./debug-panel").then((mod) => mod.DebugPanel), { ssr: false });
export const DebugPanel = (props) => {
    const flagActive = useFlag("debug");
    const show = flagActive !== null && flagActive !== void 0 ? flagActive : process.env.NODE_ENV === "development";
    if (!show) {
        return null;
    }
    return (<Suspense fallback={<CircularProgress />}>
      <LazyDebugPanel {...props}/>
    </Suspense>);
};
