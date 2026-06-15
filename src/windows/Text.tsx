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

  const name = data?.name ?? "";
  const image = data?.image ?? "";
  const subtitle = data?.subtitle ?? "";
  const description = data?.description ?? [];

  return (
    <section ref={containerRef} id="txtfile" className="window">
      {/* Responsive Header */}
      <div
        ref={headerRef}
        id="window-header"
        className="relative flex items-center justify-between select-none"
      >
        <WindowControls target="txtfile" />
        <h2 className="text-black dark:text-zinc-100 font-semibold text-[15px] pointer-events-none font-inter absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
          {name}
        </h2>
        <div className="w-[30px]" />
      </div>

      <div
        className={`bg-white dark:bg-zinc-900 h-[calc(100%-2.75rem)] overflow-y-auto font-inter text-gray-800 dark:text-zinc-100 rounded-b-xl pb-12 ${isMobile ? "p-5" : "p-8"}`}
      >
        <div className="max-w-7xl mx-auto w-full">
          {image && (
            <img
              src={image}
              alt={name}
              className={`w-full object-cover object-bottom rounded-lg mb-6 shadow-sm ${isMobile ? "max-h-48" : "max-h-96"}`}
            />
          )}
          {subtitle && (
            <h3
              className={`font-semibold mb-4 text-gray-700 dark:text-zinc-200 leading-snug ${isMobile ? "text-lg" : "text-xl"}`}
            >
              {subtitle}
            </h3>
          )}
          <div className="space-y-4">
            {description?.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm leading-relaxed text-gray-600 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Text;
