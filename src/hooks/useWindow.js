import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/Window";

gsap.registerPlugin(Draggable);

export function useWindow(windowKey) {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const focusWindowRef = useRef(null);
  const previousStateRef = useRef({ isOpen: false, isMinimized: false });

  // Ref baru untuk mencatat posisi terakhir sebelum di-minimize
  const lastPositionRef = useRef({ x: 0, y: 0 });
  // Ref untuk menyimpan instance Draggable agar bisa diakses di effect animasi
  const draggableInstanceRef = useRef(null);

  const isOpen = useWindowStore(
    (state) => state.windows[windowKey]?.isOpen ?? false,
  );
  const isMinimized = useWindowStore(
    (state) => state.windows[windowKey]?.isMinimized ?? false,
  );
  const zIndex = useWindowStore(
    (state) => state.windows[windowKey]?.zIndex ?? 0,
  );
  const focusWindow = useWindowStore((state) => state.focusWindow);

  useLayoutEffect(() => {
    focusWindowRef.current = focusWindow;
  }, [focusWindow]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.zIndex = `${zIndex}`;
  }, [zIndex]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isOpen || isMinimized) {
      el.style.pointerEvents = "none";
      return;
    }
    el.style.pointerEvents = "auto";
  }, [isOpen, isMinimized]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.killTweensOf(el);

      const previousState = previousStateRef.current;
      const wasOpen = previousState.isOpen;
      const wasMinimized = previousState.isMinimized;

      const getTargetRect = () => {
        const targetEl =
          document.getElementById(`dock-${windowKey}`) ||
          document.getElementById(`shortcut-${windowKey}`) ||
          document.getElementById("dock");

        return targetEl ? targetEl.getBoundingClientRect() : null;
      };

      // --- CASE 1: Jendela Dibuka ATAU Di-restore ---
      if (isOpen && !isMinimized) {
        el.style.display = "block";
        el.style.visibility = "visible";

        if (!wasOpen || wasMinimized) {
          const targetRect = getTargetRect();

          if (wasMinimized && targetRect) {
            // Mengambil koordinat sebelum di-minimize dari memori Ref
            const savedX = lastPositionRef.current.x;
            const savedY = lastPositionRef.current.y;

            // Atur posisi awal element di koordinat Target (Ikon/Folder)
            const elRect = el.getBoundingClientRect();
            const startX =
              targetRect.left +
              targetRect.width / 2 -
              (elRect.left + elRect.width / 2);
            const startY =
              targetRect.top +
              targetRect.height / 2 -
              (elRect.top + elRect.height / 2);

            gsap.fromTo(
              el,
              {
                scale: 0.1,
                opacity: 0,
                x: startX,
                y: startY,
                transformOrigin: "center center",
              },
              {
                scale: 1,
                opacity: 1,
                // Kembalikan ke koordinat aslinya sebelum di-minimize, bukan ke 0
                x: savedX,
                y: savedY,
                duration: 0.45,
                ease: "power3.out",
                onComplete: () => {
                  // Beritahu Draggable bahwa posisi elemen telah diperbarui secara manual
                  if (draggableInstanceRef.current) {
                    draggableInstanceRef.current.update();
                  }
                },
              },
            );
          } else {
            // Default Open (Pertama kali dibuka)
            gsap.fromTo(
              el,
              { scale: 0.8, opacity: 0, y: 40 },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
                onComplete: () => {
                  if (draggableInstanceRef.current) {
                    draggableInstanceRef.current.update();
                  }
                },
              },
            );
          }
        }
      }

      // --- CASE 2: Jendela Di-minimize ---
      else if (isOpen && isMinimized) {
        // AMBIL & SIMPAN koordinat Draggable saat ini tepat sebelum animasi minimize merusaknya
        if (draggableInstanceRef.current) {
          lastPositionRef.current = {
            x: draggableInstanceRef.current.x,
            y: draggableInstanceRef.current.y,
          };
        }

        const targetRect = getTargetRect();
        const elRect = el.getBoundingClientRect();

        if (targetRect) {
          // Hitung target tujuan berdasarkan posisi aktual window saat ini
          const targetX =
            targetRect.left +
            targetRect.width / 2 -
            (elRect.left + elRect.width / 2) +
            lastPositionRef.current.x;
          const targetY =
            targetRect.top +
            targetRect.height / 2 -
            (elRect.top + elRect.height / 2) +
            lastPositionRef.current.y;

          gsap.to(el, {
            scale: 0.05,
            opacity: 0,
            x: targetX,
            y: targetY,
            duration: 0.45,
            ease: "power3.in",
            transformOrigin: "center center",
            onComplete: () => {
              el.style.visibility = "hidden";
              el.style.display = "none";
            },
          });
        } else {
          el.style.visibility = "hidden";
          el.style.display = "none";
        }
      }

      // --- CASE 3: Jendela Ditutup ---
      else if (wasOpen || wasMinimized) {
        gsap.to(el, {
          scale: 0.85,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            el.style.visibility = "hidden";
            el.style.display = "none";
            // Reset memori posisi karena jendela benar-benar ditutup
            lastPositionRef.current = { x: 0, y: 0 };
            gsap.set(el, { scale: 1, opacity: 1, y: 0, x: 0 });
            if (draggableInstanceRef.current)
              draggableInstanceRef.current.update();
          },
        });
      }

      previousStateRef.current = { isOpen, isMinimized };
    },
    { dependencies: [isOpen, isMinimized] },
  );

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const handle = headerRef.current ?? el;
      const focusCurrentWindow = () => focusWindowRef.current?.(windowKey);

      const [instance] = Draggable.create(el, {
        trigger: handle,
        type: "x,y",
        edgeResistance: 0.65,
        onPress: focusCurrentWindow,
      });

      // Simpan instance ke ref agar bisa dibaca oleh effect animasi minimize/restore
      draggableInstanceRef.current = instance;

      el.addEventListener("pointerdown", focusCurrentWindow);

      return () => {
        el.removeEventListener("pointerdown", focusCurrentWindow);
        instance.kill();
        draggableInstanceRef.current = null;
      };
    },
    { dependencies: [] },
  );

  return { containerRef, headerRef };
}

export default useWindow;
