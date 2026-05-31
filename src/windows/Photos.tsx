import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { Mail, Search } from "lucide-react";
import { gallery, photosLinks } from "#constants";
import { useState } from "react";
import clsx from "clsx";
import useDevice from "#hooks/useDevice";

const Photos = () => {
  const { containerRef, headerRef } = useWindow("photos");
  const { openWindow } = useWindowStore();
  const { isMobile } = useDevice();
  const [activeCategory, setActiveCategory] = useState<number>(1);

  return (
    <section ref={containerRef} id="photos" className="window">
      {/* Responsive Header */}
      <div ref={headerRef} id="window-header" className="relative flex items-center justify-between select-none">
        <WindowControls target="photos" />
        <h2 className="text-black font-semibold text-[16px] font-inter absolute left-1/2 -translate-x-1/2">
          Gallery
        </h2>
        <div className="flex items-center justify-end gap-3 text-gray-500 z-10">
          <Mail className="icon cursor-pointer" size={18} />
          <Search className="icon cursor-pointer" size={18} />
        </div>
      </div>

      <div className="bg-white flex w-full h-[calc(100%-2.75rem)] overflow-hidden">
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
            {gallery.map(({ id, img, name }) => (
              <li
                key={id}
                onClick={() =>
                  openWindow("imgfile", {
                    id,
                    name: name,
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    imageUrl: img,
                  })
                }
              >
                <div className="thumbnail-wrapper">
                  <img src={img} alt={name} className="w-full h-full object-cover" />
                </div>
                <p className="font-inter">{name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Photos;
