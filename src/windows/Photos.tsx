import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { Mail, Search } from "lucide-react";
import { gallery, photosLinks } from "#constants";
import { useState } from "react";
import clsx from "clsx";

const Photos = () => {
  const { containerRef, headerRef } = useWindow("photos");
  const { openWindow } = useWindowStore();
  const [activeCategory, setActiveCategory] = useState<number>(1);

  return (
    <section ref={containerRef} id="photos" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="photos" />

        <div className="flex items-center w-full justify-end gap-3 text-gray-500">
          <Mail className="icon" />
          <Search className="icon" />
        </div>
      </div>

      <div className="bg-white flex w-full h-full">
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

        <div className="gallery">
          <ul>
            {gallery.map(({ id, img }) => (
              <li
                key={id}
                onClick={() =>
                  openWindow("imgfile", {
                    id,
                    name: "Gallery Image",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    imageUrl: img,
                  })
                }
              >
                <img src={img} alt={`Gallery Image ${id}`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Photos;
