import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/Window";

gsap.registerPlugin(Draggable);

export function useWindow(windowKey: string) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const focusWindowRef = useRef<((windowKey: string) => void) | null>(null);
  const previousStateRef = useRef<{ isOpen: boolean; isMinimized: boolean }>({ isOpen: false, isMinimized: false });

  // Ref baru untuk mencatat posisi terakhir sebelum di-minimize
  const lastPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Ref untuk menyimpan instance Draggable agar bisa diakses di effect animasi
  const draggableInstanceRef = useRef<any>(null);
  // Ref untuk mencatat ukuran sebelum maximize
  const windowConfigRef = useRef<{
    width: number;
    height: number;
    top: string;
    left: string;
  } | null>(null);

  const isOpen = useWindowStore(
    (state) => state.windows[windowKey]?.isOpen ?? false,
  );
  const isMinimized = useWindowStore(
    (state) => state.windows[windowKey]?.isMinimized ?? false,
  );
  const isMaximized = useWindowStore(
    (state) => state.windows[windowKey]?.isMaximized ?? false,
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
      // --- CASE 1: Jendela Dibuka ATAU Di-restore dari Minimize ---
      if (isOpen && !isMinimized) {
        el.style.display = "block";
        el.style.visibility = "visible";

        // Tambahkan pengecekan detail mikro untuk kondisi MAXIMIZE
        if (isMaximized) {
          // Kunci posisi koordinat drag terakhir sebelum diubah menjadi maximize
          if (draggableInstanceRef.current) {
            lastPositionRef.current = {
              x: draggableInstanceRef.current.x,
              y: draggableInstanceRef.current.y,
            };
            // MATIKAN fungsi drag total saat full screen (perilaku native OS)
            draggableInstanceRef.current.disable();
          }

          // Record original dimensions and layout positions before maximizing
          const rect = el.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(el);
          windowConfigRef.current = {
            width: rect.width,
            height: rect.height,
            top: computedStyle.top,
            left: computedStyle.left,
          };

          gsap.to(el, {
            x: 0,
            y: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "none",
            maxHeight: "none",
            top: 0,
            left: 0,
            duration: 0.35,
            ease: "power3.inOut", // Transisi inOut agar akselerasi pembesaran lebih natural
          });
        } else {
          // KONDISI NORMAL ATAU JENDELA BARU DIRESORE DARI MAXIMIZE
          const wasMaximized =
            el.style.width === "100vw" ||
            el.getBoundingClientRect().width === window.innerWidth;

          if (wasMaximized) {
            // ✅ 1. Enable Draggable SEBELUM animasi mulai
            draggableInstanceRef.current?.enable();

            gsap.to(el, {
              x: lastPositionRef.current.x,
              y: lastPositionRef.current.y,
              width: windowConfigRef.current?.width ?? "auto",
              height: windowConfigRef.current?.height ?? "auto",
              top: windowConfigRef.current?.top ?? "auto",
              left: windowConfigRef.current?.left ?? "auto",
              borderRadius: "12px",
              duration: 0.5,
              ease: "power4.out",
              clearProps: "width,height,top,left,maxWidth,maxHeight",

              // ✅ 2. Sync koordinat Draggable setiap frame
              onUpdate: () => {
                draggableInstanceRef.current?.update();
              },

              // ✅ 3. Lock koordinat final setelah selesai
              onComplete: () => {
                draggableInstanceRef.current?.update();
              },
            });
          } else {
            // Jika jendela dalam kondisi normal, pastikan Draggable tetap aktif
            if (draggableInstanceRef.current) {
              draggableInstanceRef.current.enable();
            }

            if (!wasOpen || wasMinimized) {
              // Kode bawaan restore dari minimize atau default open tetap di sini
              const targetRect = getTargetRect();

              if (wasMinimized && targetRect) {
                const savedX = lastPositionRef.current.x;
                const savedY = lastPositionRef.current.y;

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
                    x: savedX,
                    y: savedY,
                    duration: 0.45,
                    ease: "power3.out",
                    onComplete: () => {
                      if (draggableInstanceRef.current) {
                        draggableInstanceRef.current.update();
                      }
                    },
                  },
                );
              } else {
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
    { dependencies: [isOpen, isMinimized, isMaximized] },
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
