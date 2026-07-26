import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center">

      <div className="flex gap-2 mb-4 flex-wrap justify-center">

        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
          className="px-3 py-2 bg-red-500 text-white rounded"
        >
          Zoom -
        </button>

        <button
          onClick={() => setScale((s) => s + 0.2)}
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          Zoom +
        </button>

        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Prev
        </button>

        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber((p) => p + 1)}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>

      </div>

      <p className="mb-3 font-semibold">
        Page {pageNumber} of {numPages || "--"}
      </p>

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
        />
      </Document>

    </div>
  );
}