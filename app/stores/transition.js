import create from "zustand";
export const useTransitionStore = create((set) => ({
    enable: true,
    setEnable: (enable) => set({ enable }),
    brushing: false,
    setBrushing: (brushing) => set({ brushing }),
    duration: 400,
    setDuration: (duration) => set({ duration }),
    setDefaultDuration: () => set({ duration: 400 }),
}));
