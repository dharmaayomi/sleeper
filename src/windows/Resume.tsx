import { WindowControls } from "#components";
import { useWindow } from "#hooks/useWindow";
import { Download } from "lucide-react";
import { useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Resume = () => {
  const { containerRef, headerRef } = useWindow("resume");
  const [numPages, setNumPages] = useState<number>(0);

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

      <div className="max-h-[calc(85vh-2.5rem)] overflow-auto">
        <Document
          file="/files/resume.pdf"
          onLoadSuccess={({ numPages: totalPages }: { numPages: number }) => setNumPages(totalPages)}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`resume-page-${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          ))}
        </Document>
      </div>
    </section>
  );
};

export default Resume;
