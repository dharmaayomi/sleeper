import useWindowStore from "#store/Window";
import useDevice from "#hooks/useDevice";
import useLocationStore from "#store/Location";
import { locations } from "#constants";
import { ChevronLeft } from "lucide-react";

interface WindowControlsProps {
  target: string;
}

const findParentLocation = (current: any) => {
  if (!current) return null;
  // Top-level locations (Work, About, Resume, Trash)
  if ([1, 2, 3, 4].includes(current.id)) return null;

  for (const loc of Object.values(locations)) {
    if (loc.children?.some((child: any) => child.id === current.id)) {
      return loc;
    }
  }
  return null;
};

const WindowControls = ({ target }: WindowControlsProps) => {
  const { closeWindow, minimizeWindow, maximizeWindow, windows } =
    useWindowStore();
  const { isMobile } = useDevice();
  const { activeLocation, setActiveLocation } = useLocationStore();

  const isMaximized = windows[target]?.isMaximized ?? false;

  const handleGoBack = () => {
    if (target === "finder") {
      if (!activeLocation) {
        // If at root of Finder, close Finder window
        closeWindow("finder");
      } else {
        const parent = findParentLocation(activeLocation);
        setActiveLocation(parent);
      }
    } else {
      closeWindow(target);
    }
  };

  if (isMobile) {
    return (
      <button
        onClick={handleGoBack}
        className="flex items-center gap-0.5 text-[#007aff] active:opacity-60 cursor-pointer font-inter text-[16px] font-medium"
      >
        <ChevronLeft size={22} strokeWidth={2.5} className="-ml-1" />
        <span>Go Back</span>
      </button>
    );
  }

  // Desktop traffic lights controls
  return (
    <div id="window-controls">
      <div className="close" onClick={() => closeWindow(target)} />
      <div
        className={`minimize ${isMaximized ? "opacity-30 pointer-events-none cursor-not-allowed bg-gray-400" : ""}`}
        onClick={() => !isMaximized && minimizeWindow(target)}
      />
      <div className="maximize" onClick={() => maximizeWindow(target)} />
    </div>
  );
};

export default WindowControls;
