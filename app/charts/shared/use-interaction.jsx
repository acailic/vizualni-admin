import { createContext, useContext, useReducer, } from "react";
const INTERACTION_INITIAL_STATE = {
    type: "tooltip",
    observation: undefined,
    visible: false,
    mouse: undefined,
};
const InteractionStateReducer = (state, action) => {
    switch (action.type) {
        case "INTERACTION_UPDATE":
            return action.value;
        case "INTERACTION_HIDE":
            return {
                type: state.type,
                observation: undefined,
                visible: false,
                mouse: undefined,
            };
        default:
            const _exhaustiveCheck = action;
            return _exhaustiveCheck;
    }
};
const InteractionStateContext = createContext(undefined);
export const useInteraction = () => {
    const ctx = useContext(InteractionStateContext);
    if (ctx === undefined) {
        throw Error("You need to wrap your component in <InteractionProvider /> to useInteraction()");
    }
    return ctx;
};
export const InteractionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(InteractionStateReducer, INTERACTION_INITIAL_STATE);
    return (<InteractionStateContext.Provider value={[state, dispatch]}>
      {children}
    </InteractionStateContext.Provider>);
};
