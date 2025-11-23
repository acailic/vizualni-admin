import { ErrorBoundary } from "react-error-boundary";
import { ChartUnexpectedError } from "@/components/hint";
export const ChartErrorBoundary = ({ children, resetKeys, }) => {
    return (<ErrorBoundary FallbackComponent={ChartUnexpectedError} resetKeys={resetKeys}>
      {children}
    </ErrorBoundary>);
};
