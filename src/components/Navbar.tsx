import { useState, useEffect } from "react";
import { navIcons, navLinks, ABOUT_LOCATION } from "#constants";
import dayjs from "dayjs";
import useWindowStore from "#store/Window";
import useSpotlightStore from "#store/Spotlight";
import useDevice from "#hooks/useDevice";
import { Wifi, Battery, Signal } from "lucide-react";
import ThemePanel from "./ThemePanel";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { openWindow, windows } = useWindowStore();
  const toggleSpotlight = useSpotlightStore((state) => state.toggleSpotlight);
  const { isMobile } = useDevice();
  const [time, setTime] = useState(dayjs());
  const [islandExpanded, setIslandExpanded] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/images/logo_white.svg"
      : "/images/logo.svg";

  const hasOpenWindow = Object.values(windows).some(
    (win) => win.isOpen && !win.isMinimized,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (islandExpanded) {
      const timeout = setTimeout(() => setIslandExpanded(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [islandExpanded]);

  if (isMobile) {
    return (
      <nav
        id="iphone-status-bar"
        className={`w-full h-13 flex items-center justify-between px-6 select-none z-9999 absolute top-0 left-0 text-sm font-semibold font-inter transition-all duration-300  ${
          hasOpenWindow ? "text-black bg-white" : "text-white bg-transparent"
        }`}
      >
        {/* Left Side: Time */}
        <div className="flex items-center justify-start min-w-[70px]">
          <span>{time.format("h:mm A")}</span>
        </div>

        {/* Center: Dynamic Island */}
        <div className="flex items-center justify-center flex-1">
          <div
            onClick={() => setIslandExpanded(!islandExpanded)}
            className={`bg-black text-white h-7 flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer shadow-lg select-none px-3 overflow-hidden ${
              islandExpanded
                ? "w-[180px] rounded-[18px] bg-neutral-900 "
                : "w-28 rounded-full"
            }`}
          >
            <div className="flex items-center justify-center w-full gap-2 whitespace-nowrap text-[11px] font-medium tracking-wide">
              {islandExpanded ? (
                <div className="flex items-center justify-between w-full px-1 animate-fadeIn">
                  <span>Omi's Portfolio</span>
                  <span className="flex items-center gap-1 text-[#2acb42]">
                    Online{" "}
                    <span className="w-2 h-2 rounded-full bg-[#2acb42] animate-pulse" />
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 animate-fadeIn">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Porto
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Status Icons */}
        <div className="flex items-center justify-end gap-2.5 min-w-[70px]">
          <Signal size={18} strokeWidth={2.5} />
          <Wifi size={18} strokeWidth={2.5} />
          <Battery size={18} strokeWidth={2} className="rotate-0" />
        </div>
      </nav>
    );
  }

  // Desktop / Tablet macOS Navbar
  return (
    <nav>
      <div>
        <img
          src={logoSrc}
          alt="logo"
          className="h-[17px] w-auto object-contain"
        />
        <p className="font-bold font-inter">Omi's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul className="gap-2">
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              {id === 4 ? (
                <ThemePanel />
              ) : (
                <button
                  onClick={() => {
                    if (id === 2) {
                      toggleSpotlight();
                    } else if (id === 3) {
                      const aboutMeFile = ABOUT_LOCATION.children?.find(
                        (child) => child.name === "about-me.txt",
                      );
                      if (aboutMeFile) {
                        openWindow("txtfile", aboutMeFile);
                      }
                    }
                  }}
                  className="navbar-icon relative flex items-center justify-center py-1 px-1.5 rounded hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <img
                    src={img}
                    className="icon-hover"
                    alt={`${id}`}
                    width={14}
                    height={14}
                  />
                </button>
              )}
            </li>
          ))}
        </ul>

        <time>{time.format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;
