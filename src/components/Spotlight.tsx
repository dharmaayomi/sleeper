import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import useSpotlightStore from "#store/Spotlight";
import useWindowStore from "#store/Window";
import useLocationStore from "#store/Location";
import { dockApps, locations, gallery } from "#constants";
import { FileItem, FolderItem } from "../types";

const Spotlight = () => {
  const { isOpen, query, setQuery, closeSpotlight, toggleSpotlight } = useSpotlightStore();
  const { openWindow } = useWindowStore();
  const { setActiveLocation } = useLocationStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [debouncedQuery] = useDebounce(query, 200);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        toggleSpotlight();
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeSpotlight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleSpotlight, closeSpotlight]);

  // Recursively gather all files and folders
  const getAllSearchableItems = () => {
    const itemsList: (FileItem | FolderItem)[] = [];
    const seenIds = new Set<string>();

    const traverse = (item: FolderItem) => {
      const key = `folder-${item.id}-${item.name}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        itemsList.push(item);
      }
      if (item.children) {
        item.children.forEach((child) => {
          if (child.kind === "folder") {
            traverse(child as FolderItem);
          } else {
            const fileKey = `file-${child.id}-${child.name}`;
            if (!seenIds.has(fileKey)) {
              seenIds.add(fileKey);
              itemsList.push(child);
            }
          }
        });
      }
    };

    Object.values(locations).forEach((loc) => traverse(loc));
    return itemsList;
  };

  // Filter items based on debounced search query
  const trimmedQuery = debouncedQuery.trim().toLowerCase();
  
  const matchedApps = trimmedQuery
    ? dockApps.filter(
        (app) => app.canOpen && app.name.toLowerCase().includes(trimmedQuery)
      )
    : [];

  const matchedItems = trimmedQuery
    ? getAllSearchableItems().filter((item) =>
        item.name.toLowerCase().includes(trimmedQuery)
      )
    : [];

  // Group items by category
  const matchedFolders = matchedItems.filter((item) => item.kind === "folder") as FolderItem[];
  const matchedDocuments = matchedItems.filter(
    (item) => item.kind === "file" && item.fileType !== "img" && item.fileType !== "video"
  ) as FileItem[];
  const matchedFinderImages = matchedItems.filter(
    (item) => item.kind === "file" && item.fileType === "img"
  ) as FileItem[];
  const matchedGalleryImages = trimmedQuery
    ? gallery.filter((photo) => photo.name.toLowerCase().includes(trimmedQuery))
    : [];
  const matchedVideos = matchedItems.filter(
    (item) => item.kind === "file" && item.fileType === "video"
  ) as FileItem[];

  // Flat list representing all selectable entries in order
  const flatResults = [
    ...matchedApps.map((app) => ({
      type: "app" as const,
      id: `app-${app.id}`,
      name: app.name,
      icon: `/images/${app.icon}`,
      item: app,
      category: "Applications",
    })),
    ...matchedFolders.map((folder) => ({
      type: "folder" as const,
      id: `folder-${folder.id}-${folder.name}`,
      name: folder.name,
      icon: folder.icon,
      item: folder,
      category: "Folders",
    })),
    ...matchedDocuments.map((doc) => ({
      type: "document" as const,
      id: `doc-${doc.id}-${doc.name}`,
      name: doc.name,
      icon: doc.icon,
      item: doc,
      category: "Documents",
    })),
    ...matchedFinderImages.map((img) => ({
      type: "image" as const,
      id: `img-${img.id}-${img.name}`,
      name: img.name,
      icon: img.icon,
      item: img,
      category: "Images",
    })),
    ...matchedGalleryImages.map((photo) => ({
      type: "image" as const,
      id: `photo-${photo.id}-${photo.name}`,
      name: photo.name,
      icon: photo.img,
      item: {
        id: photo.id,
        name: photo.name,
        icon: "/images/image.png",
        kind: "file" as const,
        fileType: "img",
        imageUrl: photo.img,
      },
      category: "Images",
    })),
    ...matchedVideos.map((vid) => ({
      type: "video" as const,
      id: `vid-${vid.id}-${vid.name}`,
      name: vid.name,
      icon: vid.icon,
      item: vid,
      category: "Videos",
    })),
  ];

  // Reset selected index when the search result set changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const handleOpenItem = (result: typeof flatResults[0]) => {
    closeSpotlight();

    if (result.type === "app") {
      const app = result.item;
      if (app.id === "trash") {
        setActiveLocation(locations.trash);
        openWindow("finder");
      } else if (app.id === "finder") {
        setActiveLocation(locations.work);
        openWindow("finder");
      } else {
        openWindow(app.id);
      }
    } else if (result.type === "folder") {
      setActiveLocation(result.item as FolderItem);
      openWindow("finder");
    } else {
      const item = result.item as FileItem;
      if (item.fileType === "pdf") {
        openWindow("resume");
      } else if (["fig", "url"].includes(item.fileType) && item.href) {
        window.open(item.href, "_blank");
      } else {
        openWindow(`${item.fileType}${item.kind}`, item);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleOpenItem(flatResults[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  const showDropdown = trimmedQuery !== "" && flatResults.length > 0;

  const categories = [
    { label: "Applications" },
    { label: "Folders" },
    { label: "Documents" },
    { label: "Images" },
    { label: "Videos" },
  ];

  return (
    <>
      <style>{`
        @keyframes spotlightIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .spotlight-caret {
          animation: blink 1.1s step-end infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998"
        onClick={closeSpotlight}
      />

      {/* Spotlight Container */}
      <div
        className="fixed top-[22%] left-0 right-0 mx-auto z-9999 w-[92vw] max-w-[640px]"
        style={{
          animation: "spotlightIn 0.18s cubic-bezier(0.2, 0, 0, 1) forwards",
        }}
      >
        <div className="spotlight-panel rounded-2xl overflow-hidden select-none">
          {/* Search Bar Row */}
          <div className="flex items-center gap-3 px-5 py-3.5">
            <Search
              size={22}
              className="shrink-0 text-black/40 dark:text-white/40"
            />

            <div className="flex-1 relative flex items-center h-7">
              {query === "" && (
                <div className="absolute left-0 inset-y-0 flex items-center gap-0.5 pointer-events-none">
                  <span
                    className="spotlight-caret w-[1.5px] h-[20px] bg-black/55 dark:bg-white/65"
                    style={{
                      display: "inline-block",
                    }}
                  />
                  <span
                    className="font-inter text-[17px] tracking-[-0.01em] text-black/35 dark:text-white/35"
                  >
                    Spotlight Search
                  </span>
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 font-inter text-[17px] tracking-[-0.01em] text-black/85 dark:text-white/90 caret-black/85 dark:caret-white/90"
                style={{
                  caretColor: query === "" ? "transparent" : undefined,
                }}
              />
            </div>
          </div>

          {/* Search Results Dropdown List */}
          {showDropdown && (
            <div className="max-h-[350px] overflow-y-auto border-t border-black/5 dark:border-white/5 py-2 font-inter text-sm">
              {categories.map((category) => {
                const categoryResults = flatResults.filter((r) => r.category === category.label);
                if (categoryResults.length === 0) return null;

                return (
                  <div key={category.label} className="mb-2 last:mb-0">
                    <div className="px-5 py-1 text-[11px] font-bold text-black/40 dark:text-white/40 uppercase tracking-wider">
                      {category.label}
                    </div>
                    {categoryResults.map((result) => {
                      const globalIdx = flatResults.findIndex(
                        (r) => r.id === result.id && r.type === result.type
                      );
                      const isSelected = globalIdx === selectedIndex;

                      return (
                        <div
                          key={result.id}
                          ref={
                            isSelected
                              ? (el) => el?.scrollIntoView({ block: "nearest" })
                              : undefined
                          }
                          className={`flex items-center justify-between px-5 py-2 cursor-pointer select-none transition-colors duration-150 ${
                            isSelected
                              ? "bg-[#007aff] text-white"
                              : "hover:bg-black/5 dark:hover:bg-white/5 text-neutral-800 dark:text-zinc-100"
                          }`}
                          onClick={() => handleOpenItem(result)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={result.icon}
                              alt={result.name}
                              className="w-5 h-5 object-contain"
                            />
                            <span className="font-medium truncate max-w-[400px]">{result.name}</span>
                          </div>
                          <span
                            className={`text-xs ${
                              isSelected
                                ? "text-white/70"
                                : "text-neutral-400 dark:text-zinc-500"
                            }`}
                          >
                            {result.category.slice(0, -1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Spotlight;