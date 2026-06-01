import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { Mail, Search } from "lucide-react";
import { gallery, photosLinks } from "#constants";
import { useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import useDevice from "#hooks/useDevice";
import useWallpaperStore from "#store/Wallpaper";

const Photos = () => {
  const { containerRef, headerRef } = useWindow("photos");
  const { openWindow } = useWindowStore();
  const { isMobile } = useDevice();
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [selectedWallpaper, setSelectedWallpaper] = useState<{
    img: string;
    name: string;
  } | null>(null);
  const setWallpaper = useWallpaperStore((state) => state.setWallpaper);

  const filteredGallery = gallery.filter((item) =>
    item.categoryIds.includes(activeCategory),
  );

  return (
    <section ref={containerRef} id="photos" className="window">
      {/* Responsive Header */}
      <div
        ref={headerRef}
        id="window-header"
        className="relative flex items-center justify-between select-none"
      >
        <WindowControls target="photos" />
        <h2 className="text-black dark:text-zinc-100 font-semibold text-[16px] font-inter absolute left-1/2 -translate-x-1/2">
          Gallery
        </h2>
        <div className="flex items-center justify-end gap-3 text-gray-500 dark:text-zinc-400 z-10">
          <Mail className="icon cursor-pointer" size={18} />
          <Search className="icon cursor-pointer" size={18} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 flex w-full h-[calc(100%-2.75rem)] overflow-hidden">
        {/* Sidebar: Hidden on Mobile */}
        {!isMobile && (
          <div className="sidebar">
            <h3 className="font-inter">Photos</h3>
            <ul>
              {photosLinks.map(({ id, icon, title }) => (
                <li
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={clsx(
                    id === activeCategory ? "active" : "not-active",
                  )}
                >
                  <img src={icon} alt={title} />
                  <p className="font-inter">{title}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="gallery h-full pb-10 overflow-y-auto">
          <ul>
            {filteredGallery.map(({ id, img, name }) => (
              <li
                key={id}
                onClick={() => {
                  if (activeCategory === 5) {
                    setSelectedWallpaper({ img, name });
                  } else {
                    openWindow("imgfile", {
                      id,
                      name: name,
                      icon: "/images/image.png",
                      kind: "file",
                      fileType: "img",
                      imageUrl: img,
                    });
                  }
                }}
              >
                <div className="thumbnail-wrapper">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-inter">{name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* macOS Style Dialog Modal for Wallpaper Change */}
      {selectedWallpaper &&
        createPortal(
          <div className="fixed w-screen h-screen inset-0 z-[10000] flex items-center justify-center bg-black/25 backdrop-blur-[2px] select-none animate-fadeIn">
            <div className="w-[280px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 flex flex-col items-center text-center font-inter animate-fadeIn">
              {/* Small rounded preview of the wallpaper */}
              <div className="w-24 h-15 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm mb-4">
                <img
                  src={selectedWallpaper.img}
                  alt={selectedWallpaper.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-100 leading-tight">
                Change Desktop Wallpaper
              </h3>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2 mb-5 px-1 leading-normal">
                Would you like to set "{selectedWallpaper.name}" as your new
                desktop background?
              </p>

              <div className="flex gap-2.5 w-full">
                <button
                  onClick={() => setSelectedWallpaper(null)}
                  className="flex-1 py-1.5 border border-zinc-300/80 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setWallpaper(selectedWallpaper.img);
                    setSelectedWallpaper(null);
                  }}
                  className="flex-1 py-1.5 bg-[#007aff] hover:bg-[#006bd6] text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/10 transition-colors cursor-pointer"
                >
                  Set
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default Photos;
