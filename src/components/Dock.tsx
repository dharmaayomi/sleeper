import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";

import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/Window";
import useDevice from "#hooks/useDevice";

const Dock = () => {
  const { windows, openWindow, closeWindow, restoreWindow } = useWindowStore();
  const { isMobile } = useDevice();
  const dockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isMobile) return; // Disable hover zoom animations on mobile

    const dock = dockRef.current;
    if (!dock) return;
    const icons = dock.querySelectorAll<HTMLElement>(".dock-icon");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();
      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.8) / 8000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const resetIcons = () => {
      icons.forEach((icon) => {
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    };

    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, [isMobile]);

  const toggleApp = (app: { id: string; canOpen: boolean }) => {
    if (!app.canOpen) return;

    const window = windows[app.id];
    if (!window) return;

    if (window.isOpen) {
      if (window.isMinimized) {
        restoreWindow(app.id);
      } else {
        closeWindow(app.id);
      }
    } else {
      openWindow(app.id);
    }
  };

  // Filter dock apps on mobile: only Finder, Safari, Photos, and Contact
  const filteredApps = isMobile
    ? dockApps.filter((app) => ["finder", "safari", "photos", "contact"].includes(app.id))
    : dockApps;

  return (
    <section id="dock" className={isMobile ? "!block" : ""}>
      <div
        ref={dockRef}
        className={`dock-container ${isMobile ? "!gap-3.5 !p-2 !rounded-2xl shadow-xl" : ""}`}
      >
        {filteredApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className={`dock-icon relative ${isMobile ? "!size-11" : ""}`}
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              onClick={() => toggleApp({ id, canOpen })}
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "opacity-60"}
              />
              {windows[id]?.isOpen && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    windows[id]?.isMinimized ? "bg-gray-200" : "bg-white"
                  } ${isMobile ? "bottom-[-2px]" : "bottom-[-4px]"}`}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        ))}
        {!isMobile && <Tooltip id="dock-tooltip" place="top" className="tooltip" />}
      </div>
    </section>
  );
};

export default Dock;
