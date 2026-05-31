import { FolderItem } from "../types";
import { locations } from "#constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DEFAULT_LOCATION = locations.work;

export interface LocationStoreState {
  activeLocation: FolderItem;
  setActiveLocation: (location?: FolderItem) => void;
  resetActiveLocation: () => void;
}

const useLocationStore = create<LocationStoreState>()(
  immer((set) => ({
    activeLocation: DEFAULT_LOCATION,

    setActiveLocation: (location) => {
      set((state) => {
        if (location === undefined) return;
        state.activeLocation = location;
      });
    },

    resetActiveLocation: () => {
      set((state) => {
        state.activeLocation = DEFAULT_LOCATION;
      });
    },
  })),
);

export default useLocationStore;
