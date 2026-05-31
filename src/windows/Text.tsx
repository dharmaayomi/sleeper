import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { FileItem } from "../types";

const Text = () => {
  const { containerRef, headerRef } = useWindow("txtfile");
  const data = useWindowStore((state) => state.windows.txtfile.data) as FileItem | null;

  if (!data) return null;

  const { name, image, subtitle, description } = data;

  return (
    <section ref={containerRef} id="txtfile" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="txtfile" />
        <h2>{name}</h2>
      </div>
      <div className="bg-white h-[calc(100%-2.5rem)] p-8 overflow-y-auto font-inter text-gray-800 rounded-b-xl">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full max-h-64 object-cover rounded-lg mb-6 shadow-sm"
          />
        )}
        {subtitle && (
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
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
