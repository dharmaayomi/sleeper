import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WallpaperStoreState {
  wallpaper: string;
  setWallpaper: (path: string) => void;
}

const useWallpaperStore = create<WallpaperStoreState>()(
  persist(
    (set) => ({
      wallpaper: "/images/wallpaper-3.webp",
      setWallpaper: (path) => set({ wallpaper: path }),
    }),
    {
      name: "wallpaper-storage",
    }
  )
);

export default useWallpaperStore;
