import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import useWindowStore from "#store/Window";
import { Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Resume = () => {
  const { containerRef, headerRef } = useWindow("resume");
  const [numPages, setNumPages] = useState<number>(0);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const isMaximized = useWindowStore(
    (state) => state.windows.resume?.isMaximized ?? false,
  );

  useEffect(() => {
    const el = pdfContainerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} id="resume" className="window">
      <div ref={headerRef} id="window-header">
        <WindowControls target="resume" />
        <h2>Resume PDF</h2>

        <a
          href="/files/resume.pdf"
          download
          className="cursor-pointer"
          title="Download Resume"
        >
          <Download className="icon" />
        </a>
      </div>

      <div
        ref={pdfContainerRef}
        style={{
          maxHeight: isMaximized ? "calc(100vh - 3rem)" : "calc(85vh - 2.5rem)",
        }}
        className="flex flex-col items-center w-full overflow-auto px-4 py-6"
      >
        <Document
          file="/files/resume.pdf"
          onLoadSuccess={({ numPages: totalPages }: { numPages: number }) => setNumPages(totalPages)}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`resume-page-${index + 1}`}
              pageNumber={index + 1}
              width={isMaximized && containerWidth > 0 ? containerWidth - 32 : undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </section>
  );
};

export default Resume;
