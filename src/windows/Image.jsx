import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";

const Image = () => {
  const { containerRef, headerRef } = useWindow("imgfile");
  const data = useWindowStore((state) => state.windows.imgfile.data);

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <section ref={containerRef} id="imgfile" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="imgfile" />
        <h2>{name}</h2>
      </div>

      <div className="p-5 bg-white">
        {imageUrl && (
          <div className="w-full">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-auto  max-h-[70vh] object-contain rounded drop-shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Image;
