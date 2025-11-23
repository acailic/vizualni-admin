import { Provider } from "urql";
import { client } from "./client";
export const GraphqlProvider = ({ children }) => {
    return <Provider value={client}>{children}</Provider>;
};
