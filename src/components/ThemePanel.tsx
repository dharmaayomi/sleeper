import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Moon,
  Wifi,
  Bluetooth,
  Volume2,
  SunDim,
  Play,
  Pause,
  SkipForward,
  Tv,
  Zap,
} from "lucide-react";

export default function ThemePanel() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom states for interactive controls
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const clickedInsideTrigger =
        panelRef.current && panelRef.current.contains(target);
      const clickedInsideDropdown =
        dropdownRef.current && dropdownRef.current.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={panelRef} className="theme-panel-wrapper">
      {/* Control Center Navbar Pill Trigger */}
      <button
        className={`navbar-icon relative flex items-center justify-center py-1 px-1.5 rounded transition-all duration-200 ${
          open
            ? "bg-black/10 dark:bg-white/15"
            : "hover:bg-gray-200/50 dark:hover:bg-white/10"
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle Control Center"
        aria-expanded={open}
      >
        <img
          src="/icons/mode.svg"
          alt="theme"
          width={13}
          height={13}
          className={`icon-hover transition-all duration-200 ${
            open ? "scale-95" : ""
          } dark:invert-[0.9]`}
        />
      </button>

      {/* High-Fidelity macOS Control Center Dropdown */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="control-center-panel font-inter animate-fadeIn"
            role="menu"
          >
            {/* Row 1: Grid for Status Modules */}
            <div className="grid grid-cols-2 gap-2.5 items-stretch">
              {/* Wi-Fi, Bluetooth, AirDrop Box */}
              <div className="control-card p-3 flex flex-col gap-3">
                {/* Wi-Fi */}
                <div
                  className="flex w-full items-center gap-2 cursor-pointer group"
                  onClick={() => setWifiOn(!wifiOn)}
                >
                  <div
                    className={`icon-circle transition-colors duration-200 ${
                      wifiOn
                        ? "bg-[#007aff] text-white"
                        : "bg-black/10 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    <Wifi size={14} />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 select-none">
                    <span className="text-[12px] font-semibold leading-tight text-neutral-800 dark:text-white">
                      Wi-Fi
                    </span>
                    <span className="text-[9px] text-start text-neutral-500 dark:text-neutral-400 leading-none">
                      {wifiOn ? "Home" : "Off"}
                    </span>
                  </div>
                </div>

                {/* Bluetooth */}
                <div
                  className="flex w-full items-center gap-2 cursor-pointer group"
                  onClick={() => setBluetoothOn(!bluetoothOn)}
                >
                  <div
                    className={`icon-circle transition-colors duration-200 ${
                      bluetoothOn
                        ? "bg-[#007aff] text-white"
                        : "bg-black/10 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    <Bluetooth size={14} />
                  </div>
                  <div className="flex flex-col gap-1 items-start justify-start select-none">
                    <span className="text-[12px] font-semibold leading-tight text-neutral-800 dark:text-white">
                      Bluetooth
                    </span>
                    <span className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-none">
                      {bluetoothOn ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                {/* AirDrop */}
                <div className="flex w-full items-center gap-2">
                  <div className="icon-circle bg-[#007aff] text-white">
                    <Zap size={14} />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 select-none">
                    <span className="text-[12px] font-semibold leading-tight text-neutral-800 dark:text-white">
                      AirDrop
                    </span>
                    <span className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-none">
                      Contacts Only
                    </span>
                  </div>
                </div>
              </div>

              {/* Dark Mode, Brightness, AirPlay Box */}
              <div className="flex flex-col justify-between gap-1 h-full">
                {/* Dark Mode Toggle (Replaces Do Not Disturb) */}
                <div
                  className={`control-card w-full h-full p-3 flex items-center gap-2.5 cursor-pointer select-none transition-all duration-200 ${
                    theme === "dark" ? "bg-white/80 dark:bg-white/20" : ""
                  }`}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <div
                    className={`icon-circle transition-colors duration-200 ${
                      theme === "dark"
                        ? "bg-[#007aff] text-white"
                        : "bg-black/10 dark:bg-white/10 text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    <Moon
                      size={14}
                      fill={theme === "dark" ? "currentColor" : "none"}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-start gap-1 select-none">
                    <span className="text-[11px] font-bold leading-tight text-neutral-800 dark:text-white">
                      Dark Mode
                    </span>
                    <span className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">
                      {theme === "dark" ? "On" : "Off"}
                    </span>
                  </div>
                </div>

                {/* Grid for Keyboard & AirPlay */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  {/* Keyboard Brightness */}
                  <div className="control-card w-full h-full p-2 flex flex-col items-center justify-center text-center gap-1 cursor-pointer">
                    <SunDim
                      size={16}
                      className="text-neutral-700 dark:text-neutral-300"
                    />
                    <span className="text-[9px] font-semibold leading-tight text-neutral-800 dark:text-neutral-200">
                      Keyboard
                    </span>
                  </div>

                  {/* AirPlay Display */}
                  <div className="control-card w-full h-full p-2 flex flex-col items-center justify-center text-center gap-1 cursor-pointer">
                    <Tv
                      size={16}
                      className="text-neutral-700 dark:text-neutral-300"
                    />
                    <span className="text-[9px] font-semibold leading-tight text-neutral-800 dark:text-neutral-200">
                      Screen Mirror
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Brightness Slider */}
            <div className="control-card w-full p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 select-none">
                Display
              </span>
              <div className="flex items-center w-full gap-2">
                <SunDim
                  size={16}
                  className="text-neutral-600 dark:text-neutral-400"
                />
                <div className="relative w-full flex-1 h-5 bg-black/15 dark:bg-black/40 rounded-full group">
                  <div
                    className="absolute left-0 top-0 h-full bg-white dark:bg-white/90 rounded-full transition-all duration-75"
                    style={{ width: `${brightness}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.35)] pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${brightness}% - 15px)` }}
                  />
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Sound Slider */}
            <div className="control-card w-full p-3 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 select-none">
                Sound
              </span>
              <div className="flex items-center w-full gap-2">
                <Volume2
                  size={16}
                  className="text-neutral-600 dark:text-neutral-400"
                />
                <div className="relative w-full flex-1 h-5 bg-black/15 dark:bg-black/40 rounded-full group">
                  <div
                    className="absolute left-0 top-0 h-full bg-white dark:bg-white/90 rounded-full transition-all duration-75"
                    style={{ width: `${volume}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white rounded-full shadow-[0_1.5px_3.5px_rgba(0,0,0,0.3)] pointer-events-none transition-all duration-75"
                    style={{ left: `calc(${volume}% - 15px)` }}
                  />
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Music Widget */}
            <div className="control-card w-full p-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 select-none">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 shadow-sm flex items-center justify-center">
                  <img
                    src="/images/logo.svg"
                    alt="music cover"
                    className=" h-7 object-cover scale-75 animate-pulse"
                  />
                </div>
                <div className="flex items-start justify-start gap-2 flex-col">
                  <span className="text-[11px] font-bold text-neutral-800 dark:text-white leading-tight">
                    You're On Your Own, Kid
                  </span>
                  <span className="text-[9px] text-neutral-500 dark:text-neutral-400 leading-none mt-0.5">
                    Taylor Swift
                  </span>
                </div>
              </div>

              {/* Music Controls */}
              <div className="flex items-center gap-3 pr-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-neutral-700 dark:text-neutral-200 hover:text-[#007aff] dark:hover:text-[#0a84ff] transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause size={14} fill="currentColor" />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                </button>
                <button className="text-neutral-700 dark:text-neutral-200 hover:text-[#007aff] dark:hover:text-[#0a84ff] transition-colors cursor-pointer">
                  <SkipForward size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
