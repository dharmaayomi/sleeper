import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";

import { dockApps, locations } from "#constants";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/Window";
import useLocationStore from "#store/Location";
import useDevice from "#hooks/useDevice";

const Dock = () => {
  const { windows, openWindow, closeWindow, restoreWindow, focusWindow } =
    useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
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

  const getActiveWindowKey = (): string | null => {
    let maxZ = -1;
    let activeKey: string | null = null;
    Object.entries(windows).forEach(([key, win]) => {
      if (win.isOpen && !win.isMinimized && win.zIndex > maxZ) {
        maxZ = win.zIndex;
        activeKey = key;
      }
    });
    return activeKey;
  };

  const toggleApp = (app: { id: string; canOpen: boolean }) => {
    if (!app.canOpen) return;

    const activeWindowKey = getActiveWindowKey();

    // --- LOGIKA TRASH CLICK ---
    if (app.id === "trash") {
      const finderWindow = windows["finder"];
      if (finderWindow) {
        if (finderWindow.isOpen) {
          const isFinderActive =
            activeWindowKey === "finder" && activeLocation?.type === "trash";

          if (activeLocation?.type !== "trash") {
            // Jika Finder lagi buka folder lain, langsung alihkan ke Trash & focus
            setActiveLocation(locations.trash);
            if (finderWindow.isMinimized) restoreWindow("finder");
            else focusWindow("finder");
          } else {
            // Jika sudah di Trash dan diklik lagi, toggle minimize/close sesuai preferensimu
            if (finderWindow.isMinimized) {
              restoreWindow("finder");
            } else if (!isFinderActive) {
              focusWindow("finder");
            } else {
              closeWindow("finder");
            }
          }
        } else {
          // Jika Finder mati, set ke folder Trash baru buka Finder
          setActiveLocation(locations.trash);
          openWindow("finder");
        }
      }
      return;
    }

    if (app.id === "finder") {
      const finderWindow = windows["finder"];
      if (finderWindow) {
        if (finderWindow.isOpen) {
          const isFinderActive =
            activeWindowKey === "finder" && activeLocation?.type !== "trash";

          // JIKA sedang di dalam Trash, klik Finder akan memindahkan lokasi ke Work (bukan menutup window)
          if (activeLocation?.type === "trash") {
            setActiveLocation(locations.work);
            if (finderWindow.isMinimized) restoreWindow("finder");
            else focusWindow("finder");
          } else {
            // Jika memang sudah di Finder biasa, toggle minimize/close
            if (finderWindow.isMinimized) {
              restoreWindow("finder");
            } else {
              closeWindow("finder");
            }
          }
        } else {
          // Jika Finder mati dan sebelumnya kesimpan di trash, reset ke folder kerja utama
          if (activeLocation?.type === "trash") {
            setActiveLocation(locations.work);
          }
          openWindow("finder");
        }
      }
      return;
    }

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
    ? dockApps.filter((app) =>
        ["finder", "safari", "photos", "contact"].includes(app.id),
      )
    : dockApps;

  const isAppActive = (id: string) => {
    // Jika app yang dicek adalah trash, aktif hanya jika Finder buka DAN lokasi tipe trash
    if (id === "trash") {
      return windows.finder?.isOpen && activeLocation?.type === "trash";
    }
    // Jika app yang dicek adalah finder, aktif jika Finder buka DAN lokasi BUKAN trash
    if (id === "finder") {
      return windows.finder?.isOpen && activeLocation?.type !== "trash";
    }
    return windows[id]?.isOpen;
  };

  const isAppMinimized = (id: string) => {
    if (id === "finder" || id === "trash") {
      return windows.finder?.isMinimized;
    }
    return windows[id]?.isMinimized;
  };

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
              {isAppActive(id) && (
                <span
                  className={`absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isAppMinimized(id) ? "bg-gray-200" : "bg-white"
                  } ${isMobile ? "bottom-[-2px]" : "bottom-[-4px]"}`}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        ))}
        {!isMobile && (
          <Tooltip id="dock-tooltip" place="top" className="tooltip" />
        )}
      </div>
    </section>
  );
};

export default Dock;
