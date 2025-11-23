import { useStore } from "zustand";
export const createBoundUseStoreWithSelector = ((store) => (selector, equals) => useStore(store, selector, equals));
