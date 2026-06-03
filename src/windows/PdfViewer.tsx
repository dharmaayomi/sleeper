import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { Clapperboard, Loader2, PanelLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import useDevice from "#hooks/useDevice";
import clsx from "clsx";
import { FileItem } from "../types";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdfjs worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Episode {
  id: number;
  title: string;
  file: string;
  label: string;
  duration: string;
  synopsis: string;
}

const EPISODES: Episode[] = [
  {
    id: 1,
    title: "Episode 1: When I Me(a)t You",
    file: "/files/meatlovers-eps-1.pdf",
    label: "EP 01",
    duration: "12 Pages",
    synopsis:
      "The pilot episode introduces our main characters and their shared, burning obsession with the ultimate culinary cut.",
  },
  {
    id: 2,
    title: "Episode 2: Secret Affair",
    file: "/files/meatlovers-eps-2.pdf",
    label: "EP 02",
    duration: "18 Pages",
    synopsis:
      "Tensions flare in the kitchen as a legendary secret recipe goes missing, causing chaos and cooking rivalries.",
  },
  {
    id: 3,
    title: "Episode 3: Special Ingredient",
    file: "/files/meatlovers-eps-3.pdf",
    label: "EP 03",
    duration: "16 Pages",
    synopsis:
      "The season finale brings the culinary competition to a sizzling climax. Success is rare, but achievement is well done.",
  },
];

const PdfViewer = () => {
  const { containerRef, headerRef } = useWindow("pdfviewerfile");
  const { isMobile } = useDevice();
  const data = useWindowStore(
    (state) => state.windows.pdfviewerfile.data,
  ) as FileItem | null;

  const customPdf =
    data?.pdfUrl !== undefined
      ? {
          id: 0,
          title: data.name,
          file: data.pdfUrl,
          label: "PDF",
          duration: "",
          synopsis: "",
        }
      : null;
  const episodes = customPdf ? [customPdf] : EPISODES;
  const isSingleDocument = customPdf !== null;

  // Layout states
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(
    customPdf ?? (isMobile ? null : EPISODES[0]),
  );

  // PDF Rendering states
  const [numPages, setNumPages] = useState<number>(0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);

  // ResizeObserver to calculate the actual width of the PDF scrollpane
  useEffect(() => {
    const el = pdfContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      // Pad slightly to account for scrollbars and margins
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeEpisode, showSidebar]);

  // Scroll to top when active episode changes
  useEffect(() => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.scrollTop = 0;
    }
    setNumPages(0);
    setIsPdfLoading(true);
  }, [activeEpisode]);

  useEffect(() => {
    setActiveEpisode(customPdf ?? (isMobile ? null : EPISODES[0]));
  }, [data?.name, data?.pdfUrl, isMobile]);

  const handleDocumentLoadSuccess = ({
    numPages: totalPages,
  }: {
    numPages: number;
  }) => {
    setNumPages(totalPages);
    setIsPdfLoading(false);
  };

  return (
    <section ref={containerRef} id="pdfviewerfile" className="window">
      {/* Responsive Header */}
      {isMobile ? (
        <div
          ref={headerRef}
          id="window-header"
          className="relative flex items-center justify-between select-none"
        >
          <WindowControls target="pdfviewerfile" />
          <h2 className="text-black dark:text-zinc-100 font-semibold text-[15px] font-inter absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
            {activeEpisode ? activeEpisode.title : "Series Scripts"}
          </h2>
          <div className="w-[30px]" />
        </div>
      ) : (
        <div
          ref={headerRef}
          id="window-header"
          className="relative flex items-center justify-between select-none"
        >
          <div className="flex items-center gap-4">
            <WindowControls target="pdfviewerfile" />
            <PanelLeft
              className={clsx(
                "icon cursor-pointer transition-colors ml-4",
                isSingleDocument && "invisible pointer-events-none",
                showSidebar && "text-blue-600 dark:text-blue-400",
              )}
              onClick={() => setShowSidebar(!showSidebar)}
            />
          </div>

          <h2 className="text-black dark:text-zinc-100 font-semibold text-[15px] font-inter absolute left-1/2 -translate-x-1/2">
            {activeEpisode ? activeEpisode.title : "Script Reader"}
          </h2>

          <div className="flex items-center gap-2 text-xs font-inter text-neutral-400 dark:text-zinc-500 mr-2">
            <Clapperboard size={14} />
            <span>
              {isSingleDocument ? "PDF Document" : "Meatlovers Production"}
            </span>
          </div>
        </div>
      )}

      {/* Main Split Window Pane */}
      <div className="flex h-[calc(100%-2.75rem)] overflow-hidden w-full bg-white dark:bg-zinc-900 rounded-b-xl">
        {/* SIDEBAR: Desktop Only, or Mobile when no episode is selected */}
        {!isSingleDocument &&
          ((!isMobile && showSidebar) || (isMobile && !activeEpisode)) && (
            <aside className="w-full md:w-64 border-r border-gray-100 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 h-full flex flex-col select-none animate-fadeIn flex-shrink-0">
              <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-[10px] font-bold font-inter text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clapperboard size={12} className="text-blue-500" /> Webseries
                  Scripts
                </h3>
              </div>

              <ul className="flex-1 overflow-y-auto p-2.5 space-y-1">
                {episodes.map((ep) => (
                  <li
                    key={ep.id}
                    onClick={() => setActiveEpisode(ep)}
                    className={clsx(
                      "flex flex-col gap-1 px-3 py-2.5 rounded-lg cursor-pointer text-xs font-inter transition-all group border border-transparent",
                      activeEpisode?.id === ep.id
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium border-blue-100 dark:border-blue-900/30"
                        : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100/60 dark:hover:bg-zinc-800/40",
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-[11px] px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/80 transition-colors">
                        {ep.label}
                      </span>
                      <span className="text-[10px] text-neutral-400 dark:text-zinc-500">
                        {ep.duration}
                      </span>
                    </div>
                    <span className="font-medium truncate text-gray-900 dark:text-zinc-100 mt-1">
                      {ep.title.split(": ")[1]}
                    </span>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {ep.synopsis}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          )}

        {/* CONTENT PDF VIEWER: Rendered when an episode is selected or always on Desktop */}
        {(!isMobile || isSingleDocument || (isMobile && activeEpisode)) && (
          <div className="flex-1 flex flex-col h-full bg-neutral-100/50 dark:bg-zinc-950/20 relative">
            {/* Mobile Header / Navigation Controls */}
            {isMobile && activeEpisode && (
              <div className="p-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between select-none">
                <button
                  onClick={() => setActiveEpisode(null)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 cursor-pointer bg-neutral-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                >
                  &larr; Scripts List
                </button>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold px-2 py-0.5 rounded">
                  {activeEpisode.label}
                </span>
              </div>
            )}

            {/* Scrollable PDF Scroller */}
            <div
              ref={pdfContainerRef}
              style={{
                height: isMobile ? "calc(100% - 3.25rem)" : "100%",
              }}
              className="flex-1 w-full overflow-y-auto px-4 py-6 pb-20 flex flex-col items-center"
            >
              {activeEpisode ? (
                <div className="w-full max-w-3xl flex flex-col items-center">
                  {/* Loading overlay inside document */}
                  {isPdfLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-400 dark:text-zinc-500 animate-fadeIn">
                      <Loader2
                        className="animate-spin mb-3 text-blue-500"
                        size={24}
                      />
                      <p className="text-xs font-inter font-medium">
                        Rendering script pages...
                      </p>
                    </div>
                  )}

                  <Document
                    file={activeEpisode.file}
                    onLoadSuccess={handleDocumentLoadSuccess}
                    className="flex flex-col gap-6 w-full items-center"
                    loading={
                      <div className="flex flex-col items-center justify-center py-20 text-neutral-400 dark:text-zinc-500">
                        <Loader2
                          className="animate-spin mb-3 text-blue-500"
                          size={24}
                        />
                        <p className="text-xs font-inter font-medium">
                          Opening PDF...
                        </p>
                      </div>
                    }
                  >
                    {Array.from({ length: numPages }, (_, index) => (
                      <Page
                        key={`${activeEpisode.id}-page-${index + 1}`}
                        pageNumber={index + 1}
                        width={
                          containerWidth > 0
                            ? Math.min(containerWidth - 48, 720)
                            : undefined
                        }
                        className="shadow-md dark:shadow-zinc-950/40 rounded-lg overflow-hidden border border-gray-200/55 dark:border-zinc-800/80 bg-white"
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    ))}
                  </Document>
                </div>
              ) : (
                /* Desktop Placeholder (Should not happen but acts as fallback) */
                <div className="m-auto flex flex-col items-center text-center p-6 text-neutral-400 dark:text-zinc-500 font-inter">
                  <Clapperboard
                    size={48}
                    className="text-neutral-300 dark:text-zinc-700 mb-3 animate-pulse"
                  />
                  <h4 className="font-semibold text-gray-700 dark:text-zinc-300">
                    No Script Selected
                  </h4>
                  <p className="text-xs mt-1 max-w-[280px]">
                    Choose an episode from the scripts sidebar to begin reading.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PdfViewer;
