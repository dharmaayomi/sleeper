import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import useDevice from "#hooks/useDevice";
import { FileItem } from "../types";

const Text = () => {
  const { containerRef, headerRef } = useWindow("txtfile");
  const data = useWindowStore(
    (state) => state.windows.txtfile.data,
  ) as FileItem | null;
  const { isMobile } = useDevice();

  if (!data) return null;

  const { name, image, subtitle, description } = data;

  return (
    <section ref={containerRef} id="txtfile" className="window">
      {/* Responsive Header */}
      <div
        ref={headerRef}
        id="window-header"
        className="relative flex items-center justify-between select-none"
      >
        <WindowControls target="txtfile" />
        <h2 className="text-black font-semibold text-[15px] pointer-events-none font-inter absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
          {name}
        </h2>
        <div className="w-[30px]" />
      </div>

      <div
        className={`bg-white h-[calc(100%-2.75rem)] overflow-y-auto font-inter text-gray-800 rounded-b-xl pb-12 ${isMobile ? "p-5" : "p-8"}`}
      >
        {image && (
          <img
            src={image}
            alt={name}
            className={`w-full object-cover rounded-lg mb-6 shadow-sm ${isMobile ? "max-h-48" : "max-h-64"}`}
          />
        )}
        {subtitle && (
          <h3
            className={`font-semibold mb-4 text-gray-700 leading-snug ${isMobile ? "text-lg" : "text-xl"}`}
          >
            {subtitle}
          </h3>
        )}
        <div className="space-y-4">
          {description?.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-gray-600">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Text;
