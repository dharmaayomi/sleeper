import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import { Search } from "lucide-react";
import useLocationStore from "#store/Location.js";
import { locations } from "#constants";
import clsx from "clsx";
import useWindowStore from "#store/Window";
import { FileItem, FolderItem } from "../types";

const Finder = () => {
  const { containerRef, headerRef } = useWindow("finder");
  const { openWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();

  const openItem = (item: FileItem | FolderItem) => {
    if (item.kind === "file" && item.fileType === "pdf") return openWindow("resume");
    if (item.kind === "folder") return setActiveLocation(item);
    if (item.kind === "file" && ["fig", "url"].includes(item.fileType) && item.href)
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
