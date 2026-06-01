import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import useDevice from "#hooks/useDevice";
import { FileItem } from "../types";

const Image = () => {
  const { containerRef, headerRef } = useWindow("imgfile");
  const data = useWindowStore((state) => state.windows.imgfile.data) as FileItem | null;
  const { isMobile } = useDevice();

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <section ref={containerRef} id="imgfile" className="window">
      {/* Responsive Header */}
      <div ref={headerRef} id="window-header" className="relative flex items-center justify-between select-none">
        <WindowControls target="imgfile" />
        <h2 className="text-black dark:text-zinc-100 font-semibold text-[15px] font-inter absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
          {name}
        </h2>
        <div className="w-[30px]" />
      </div>

      <div className={`bg-white dark:bg-zinc-900 h-[calc(100%-2.75rem)] flex items-center justify-center overflow-y-auto pb-10 ${isMobile ? "p-4" : "p-5"}`}>
        {imageUrl && (
          <div className="w-full flex justify-center">
            <img
              src={imageUrl}
              alt={name}
              className={`object-contain rounded drop-shadow-2xl ${
                isMobile ? "w-full h-auto max-h-[65vh]" : "w-full h-auto max-h-[70vh]"
              }`}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Image;
