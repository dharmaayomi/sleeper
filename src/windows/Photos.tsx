import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { Mail, Search } from "lucide-react";
import { gallery, photosLinks } from "#constants";

const Photos = () => {
  const { containerRef, headerRef } = useWindow("photos");
  const { openWindow } = useWindowStore();

  return (
    <section ref={containerRef} id="photos" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="photos" />

        <div className="flex items-center w-full justify-end gap-3 text-gray-500">
          <Mail className="icon" />
          <Search className="icon" />
        </div>
      </div>

      <div className="flex w-full">
        <div className="sidebar">
          <h2>Photos</h2>
          <ul>
            {photosLinks.map(({ id, icon, title }) => (
              <li key={id}>
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
