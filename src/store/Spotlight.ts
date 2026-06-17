import { create } from "zustand";

interface SpotlightStoreState {
  isOpen: boolean;
  query: string;
  openSpotlight: () => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  setQuery: (query: string) => void;
}

const useSpotlightStore = create<SpotlightStoreState>((set) => ({
  isOpen: false,
  query: "",
  openSpotlight: () => set({ isOpen: true }),
  closeSpotlight: () => set({ isOpen: false, query: "" }),
  toggleSpotlight: () => set((state) => ({ isOpen: !state.isOpen, query: state.isOpen ? "" : state.query })),
  setQuery: (query) => set({ query }),
}));

export default useSpotlightStore;
