import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";
import { WindowConfig } from "../types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface WindowStoreState {
  windows: WindowConfig;
  nextZIndex: number;
  openWindow: (windowKey: string, data?: any) => void;
  closeWindow: (windowKey: string) => void;
  focusWindow: (windowKey: string) => void;
  minimizeWindow: (windowKey: string) => void;
  maximizeWindow: (windowKey: string) => void;
  restoreWindow: (windowKey: string) => void;
}

const useWindowStore = create<WindowStoreState>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey, data = null) => {
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        win.isMinimized = false;
        state.nextZIndex++;
      });
    },
    closeWindow: (windowKey) => {
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
        win.isMinimized = false;
      });
    },
    focusWindow: (windowKey) => {
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.zIndex = state.nextZIndex++;
      });
    },
    minimizeWindow: (windowKey) => {
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimized = true;
      });
    },
    maximizeWindow: (windowKey) => {
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMaximized = !win.isMaximized;
        if (win.isMaximized) {
          win.isMinimized = false;
          win.zIndex = state.nextZIndex++;
        }
      });
    },
    restoreWindow: (windowKey) => {
      set((state) => {
        const win = state.windows[windowKey];
        if (!win) return;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex++;
      });
    },
  })),
);

export default useWindowStore;
