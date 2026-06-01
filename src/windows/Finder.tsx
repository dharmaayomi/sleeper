import { useEffect } from "react";
import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import { Search } from "lucide-react";
import useLocationStore from "#store/Location";
import { locations } from "#constants";
import clsx from "clsx";
import useWindowStore from "#store/Window";
import useDevice from "#hooks/useDevice";
import { FileItem, FolderItem } from "../types";

const Finder = () => {
  const { containerRef, headerRef } = useWindow("finder");
  const { openWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
  const { isMobile } = useDevice();

  // Reset to root (null) when mounting on mobile to start at the favourites screen
  useEffect(() => {
    if (isMobile) {
      setActiveLocation(null);
    }
  }, [isMobile]);

  const openItem = (item: FileItem | FolderItem) => {
    if (item.kind === "file" && item.fileType === "pdf")
      return openWindow("resume");
    if (item.kind === "folder") return setActiveLocation(item);
    if (
      item.kind === "file" &&
      ["fig", "url"].includes(item.fileType) &&
      item.href
    )
      return window.open(item.href, "_blank");

    openWindow(`${(item as FileItem).fileType}${item.kind}`, item);
  };

  const renderList = (name: string, items: FolderItem[]) => (
    <div>
      <h3 className="font-inter">{name}</h3>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={clsx(
              item.id === activeLocation?.id ? "active" : "not-active",
            )}
          >
            <img src={item.icon} className="w-4" alt={item.name} />
            <p className="text-sm font-medium font-inter truncate">
              {item.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );

  // --- MOBILE LAYOUT ---
  if (isMobile) {
    return (
      <section ref={containerRef} id="finder" className="window">
        {/* Mobile Header with Center Dynamic Title */}
        <div
          ref={headerRef}
          id="window-header"
          className="relative flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-zinc-900 md:bg-gray-50 dark:md:bg-zinc-800 border-none md:border-b md:border-gray-200 dark:md:border-zinc-800 h-11 select-none"
        >
          <WindowControls target="finder" />
          <h2 className="text-neutral-800 dark:text-zinc-100 font-semibold text-[15px] font-inter absolute left-1/2 -translate-x-1/2">
            {activeLocation ? activeLocation.name : "Portfolio"}
          </h2>
          <Search className="icon cursor-pointer text-gray-500 dark:text-zinc-400" size={18} />
        </div>

        {/* Mobile Content Pane */}
        <div className="bg-white dark:bg-zinc-900 h-[calc(100%-2.75rem)] overflow-y-auto pb-10">
          {!activeLocation ? (
            // Root View: Work, About me, Resume, Trash
            <ul className="grid grid-cols-3 gap-y-8 gap-x-4 p-6 justify-items-center">
              {Object.values(locations).map((item) => (
                <li
                  key={item.id}
                  onClick={() => openItem(item)}
                  className="flex flex-col items-center justify-center cursor-pointer select-none text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl p-1 transition-all active:scale-90">
                    <img
                      src="/images/folder.png"
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-inter text-[11px] text-gray-800 dark:text-zinc-200 mt-2.5 font-medium truncate w-[76px] px-0.5">
                    {item.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            // Subfolder View (Inside Work, About, Project, etc.)
            <ul className="grid grid-cols-3 gap-y-8 gap-x-4 p-6 justify-items-center animate-fadeIn">
              {activeLocation.children.map((item) => (
                <li
                  key={item.id}
                  onClick={() => openItem(item)}
                  className="flex flex-col items-center justify-center cursor-pointer select-none text-center"
                >
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl p-1 transition-all active:scale-90">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-inter text-[11px] text-gray-800 dark:text-zinc-200 mt-2.5 font-medium leading-tight truncate w-[76px] px-0.5">
                    {item.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  // --- DESKTOP / TABLET LAYOUT ---
  return (
    <section ref={containerRef} id="finder" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="finder" />
        <Search className="icon" />
      </div>

      <div className="bg-white flex h-full">
        <div className="sidebar">
          {renderList("Favorites", Object.values(locations))}
          {renderList("My Projects", locations.work.children as FolderItem[])}
        </div>
        <ul className="content">
          {activeLocation?.children.map((item) => (
            <li
              key={item.id}
              className={item.position}
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} />
              <p className="font-inter">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Finder;
