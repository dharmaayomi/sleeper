import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useDevice from "#hooks/useDevice";
import useWindowStore from "#store/Window";
import { FileItem } from "../types";

const DEFAULT_VIDEO = {
  name: "custom.mkv",
  videoUrl: "/videos/custom.mkv",
  posterUrl: "/images/project-3.png",
};

const getVideoType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();

  if (extension === "webm") return "video/webm";
  if (extension === "mkv") return "video/x-matroska";
  return "video/mp4";
};

const Video = () => {
  const { containerRef, headerRef } = useWindow("videofile");
  const { isMobile } = useDevice();
  const data = useWindowStore(
    (state) => state.windows.videofile.data,
  ) as FileItem | null;

  const name = data?.name ?? DEFAULT_VIDEO.name;
  const videoUrl = data?.videoUrl ?? DEFAULT_VIDEO.videoUrl;
  const posterUrl = data?.posterUrl ?? DEFAULT_VIDEO.posterUrl;

  return (
    <section ref={containerRef} id="videofile" className="window">
      <div
        ref={headerRef}
        id="window-header"
        className="relative flex items-center justify-between select-none"
      >
        <WindowControls target="videofile" />
        <h2 className="text-black dark:text-zinc-100 font-semibold text-[15px] font-inter absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
          {name}
        </h2>
        <div className="w-[30px]" />
      </div>

      <div className="h-[calc(100%-2.75rem)] bg-black flex items-center justify-center overflow-hidden">
        <video
          key={videoUrl}
          className="w-full h-full object-contain bg-black"
          controls
          playsInline
          preload="metadata"
          poster={posterUrl}
          autoPlay={!isMobile}
        >
          <source src={videoUrl} type={getVideoType(videoUrl)} />
        </video>
      </div>
    </section>
  );
};

export default Video;
