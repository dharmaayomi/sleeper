import useWindowStore from "#store/Window.js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { useLayoutEffect, useRef } from "react";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();

    const { isOpen, zIndex, isMinimized } = windows[windowKey];
    const ref = useRef(null);
    const dockTargetRef = useRef(null);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen || isMinimized) return;

      el.style.visibility = "visible";

      gsap.fromTo(
        el,
        {
          scale: 0.8,
          opacity: 0,
          y: 40,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    }, [isOpen, isMinimized]);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      if (isMinimized) {
        const dock = document.getElementById("dock");
        if (dock) {
          const dockRect = dock.getBoundingClientRect();
          const dockCenterX = dockRect.left + dockRect.width / 2;
          const dockCenterY = dockRect.top + dockRect.height / 2;
          const elRect = el.getBoundingClientRect();
          const offsetX = dockCenterX - (elRect.left + elRect.width / 2);
          const offsetY = dockCenterY - (elRect.top + elRect.height / 2);

          gsap.to(el, {
            scale: 0.3,
            opacity: 0,
            x: offsetX,
            y: offsetY,
            duration: 0.4,
            ease: "power3.in",
          });
        }
      } else {
        gsap.to(el, {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      }
    }, [isMinimized]);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      });

      return () => instance.kill();
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (!isOpen) {
        el.style.visibility = "hidden";
        el.style.display = "none";
      } else if (!isMinimized) {
        el.style.display = "block";
      }
    }, [isOpen, isMinimized]);

    return (
      <section id={windowKey} ref={ref} className="absolute" style={{ zIndex }}>
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

export default WindowWrapper;
