import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import shallow from "zustand/shallow";
export const createMetadataPanelStore = () => createStore((set, get) => ({
    open: false,
    activeSection: "general",
    selectedComponent: undefined,
    actions: {
        setOpen: (open) => {
            set({ open });
        },
        toggle: () => {
            set({ open: !get().open });
        },
        setActiveSection: (section) => {
            set({ activeSection: section });
        },
        setSelectedComponent: (component) => {
            set({ selectedComponent: component });
        },
        clearSelectedComponent: () => {
            set({ selectedComponent: undefined });
        },
        openComponent: (component) => {
            set({
                open: true,
                activeSection: "data",
                selectedComponent: component,
            });
        },
        reset: () => {
            set({ activeSection: "general", selectedComponent: undefined });
        },
    },
}));
export const useMetadataPanelStore = (selector) => {
    const store = useContext(MetadataPanelStoreContext);
    return useStore(store, selector, shallow);
};
export const useMetadataPanelStoreActions = () => {
    const store = useContext(MetadataPanelStoreContext);
    return useStore(store, (state) => state.actions);
};
const defaultStore = createMetadataPanelStore();
export const MetadataPanelStoreContext = createContext(defaultStore);
