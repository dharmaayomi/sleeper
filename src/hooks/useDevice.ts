import { useState, useEffect } from "react";

export function useDevice() {
  const getDeviceState = () => {
    if (typeof window === "undefined") {
      return { isMobile: false, isTablet: false, isDesktop: true };
    }
    const width = window.innerWidth;
    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  };

  const [device, setDevice] = useState(getDeviceState);

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceState());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}

export default useDevice;
