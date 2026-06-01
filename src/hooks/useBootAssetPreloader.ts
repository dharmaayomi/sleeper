import { useEffect, useState } from "react";

interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const useBootAssetPreloader = (
  minDuration = 2500,
  maxDuration = 5500,
) => {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const criticalAssets = [
      // Wallpapers
      "/images/wallpaper-3.webp",
      "/images/wallpaper-4.webp",
      "/images/wallpaper.webp",
      "/images/wallpaper-2.webp",
      "/images/wallpaper-1.webp",

      // Core Icons
      "/images/finder.png",
      "/images/safari.png",
      "/images/photos.png",
      "/images/contact.png",
      "/images/terminal.png",
      "/images/trash.png",
      "/images/logo.svg",
      "/images/logo_white.svg",

      // Core PDFs
      "/files/resume.pdf",

      // Secondary highlights
      "/images/blog1.png",
      "/images/blog2.png",
      "/images/blog3.png",
      "/images/gal1.png",
      "/images/gal2.png",
      "/images/gal3.png",
      "/images/gal4.png",
    ];

    const total = criticalAssets.length;
    setProgress({ loaded: 0, total, percentage: 0 });

    const startTime = Date.now();
    let loadedCount = 0;

    const preloadAsset = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        if (url.endsWith(".pdf")) {
          fetch(url, { method: "HEAD" })
            .then(() => resolve())
            .catch(() => resolve()); // Resolve even on error to prevent blocking
        } else {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error
          img.src = url;
        }
      });
    };

    // Preload all assets in parallel
    const promises = criticalAssets.map((asset) =>
      preloadAsset(asset).then(() => {
        loadedCount++;
        const percentage = Math.round((loadedCount / total) * 100);
        setProgress({ loaded: loadedCount, total, percentage });
      }),
    );

    // Dynamic completion trigger
    const bootTimer = Promise.all(promises).then(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      return new Promise((resolve) => setTimeout(resolve, remaining));
    });

    // Safety timeout (prevent infinite loading)
    const safetyTimeout = new Promise((resolve) =>
      setTimeout(resolve, maxDuration),
    );

    Promise.race([bootTimer, safetyTimeout]).then(() => {
      setProgress({ loaded: total, total, percentage: 100 });
      setIsComplete(true);
    });
  }, [minDuration, maxDuration]);

  return { progress, isComplete };
};
