import { FolderItem } from "../types";
import { locations } from "#constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DEFAULT_LOCATION = locations.work;

export interface LocationStoreState {
  activeLocation: FolderItem | null;
  setActiveLocation: (location: FolderItem | null) => void;
  resetActiveLocation: () => void;
}

const useLocationStore = create<LocationStoreState>()(
  immer((set) => ({
    activeLocation: DEFAULT_LOCATION,

    setActiveLocation: (location) => {
      set((state) => {
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
