// @ts-ignore We use StrictEventEmitter to type EventEmitter
import EventEmitter from "microee";
import { createContext, useContext, useEffect } from "react";
const globalEventEmitter = new EventEmitter();
const EventEmitterContext = createContext(globalEventEmitter);
export const EventEmitterProvider = ({ children }) => {
    return (<EventEmitterContext.Provider value={globalEventEmitter}>
      {children}
    </EventEmitterContext.Provider>);
};
export const useEventEmitter = (event, callback) => {
    const eventEmitterCtx = useContext(EventEmitterContext);
    const eventEmitter = eventEmitterCtx;
    useEffect(() => {
        if (!eventEmitter || !event || !callback) {
            return;
        }
        eventEmitter.on(event, callback);
        // eslint-disable-next-line consistent-return
        return () => {
            eventEmitter.removeListener(event, callback);
        };
    }, [eventEmitter, event, callback]);
    return eventEmitter;
};
