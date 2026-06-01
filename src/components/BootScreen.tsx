import { useBootAssetPreloader } from "#hooks/useBootAssetPreloader";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface BootScreenProps {
  children: ReactNode;
  minDuration?: number;
  logoSrc?: string;
}

export default function BootScreen({
  children,
  minDuration = 2500,
  logoSrc = "/images/logo_white.svg",
}: BootScreenProps) {
  const { progress, isComplete } = useBootAssetPreloader(minDuration);
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  // Smoothly increment displayed percentage toward actual preload target
  useEffect(() => {
    const target = progress.percentage;
    if (displayedPercentage < target) {
      const timer = setTimeout(() => {
        setDisplayedPercentage((prev) => Math.min(prev + 1, target));
      }, 20); // 1% every 20ms = ~2000ms total to go from 0% to 100%
      return () => clearTimeout(timer);
    }
  }, [progress.percentage, displayedPercentage]);

  // Ensure progress bar is fully filled when boot is complete
  useEffect(() => {
    if (isComplete) {
      setDisplayedPercentage(100);
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 600); // Match CSS fadeout duration
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  if (!shouldRender) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={`boot-screen ${isFadingOut ? "boot-fade-out" : ""}`}>
        <div className="boot-container">
          {/* Logo with smooth animation */}
          <div className="boot-logo-wrapper">
            <img
              src={logoSrc}
              alt="Apple Boot Logo"
              className="boot-logo"
              width={80}
              height={98}
            />
          </div>

          {/* Premium macOS progress bar */}
          <div className="boot-progress">
            <div
              className="boot-progress-bar"
              style={{ width: `${displayedPercentage}%` }}
              role="progressbar"
              aria-valuenow={displayedPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Percentage indicator */}
          <p className="boot-text" aria-live="polite">
            {displayedPercentage === 100 ? "Ready" : `${displayedPercentage}%`}
          </p>
        </div>
      </div>
      {/* Pre-mount children in background */}
      <div className="boot-underlay" style={{ display: isFadingOut ? "block" : "none" }}>
        {children}
      </div>
    </>
  );
}
