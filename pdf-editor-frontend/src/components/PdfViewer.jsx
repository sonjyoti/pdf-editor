import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import PdfTextLayer from "./PdfTextLayer";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PdfViewer({ fileUrl, fileId }) {
  const containerRef = useRef(null);

  const [documentData, setDocumentData] = useState(null);

  const scale = 1.5;

  const handleSave = async () => {
    const editedElements = document.querySelectorAll(
      "[contenteditable='true']",
    );

    const changes = [];

    editedElements.forEach((element) => {
      const originalText = element.dataset.originalText;

      const newText = element.innerText;

      if (newText !== originalText) {
        changes.push({
          pageNumber: Number(element.dataset.pageNumber),

          textIndex: Number(element.dataset.textIndex),

          newText: newText,
        });
      }
    });

    console.log("Changed elements:", changes);

    if (changes.length === 0) {
      console.log("No changes to save.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/pdf/${fileId}/edit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            changes: changes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to edit PDF");
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "edited.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  /*
   * Fetch text information from backend
   */
  useEffect(() => {
    if (!fileId) {
      return;
    }

    const loadText = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/pdf/${fileId}/text`,
        );

        if (!response.ok) {
          throw new Error("Failed to load PDF text");
        }

        const data = await response.json();

        console.log("Extracted PDF data:", data);

        setDocumentData(data);
      } catch (error) {
        console.error("Error loading PDF text:", error);
      }
    };

    loadText();
  }, [fileId]);

  /*
   * Render PDF pages
   */
  useEffect(() => {
    if (!fileUrl) {
      return;
    }

    const renderPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument({
          url: fileUrl,
        }).promise;

        const container = containerRef.current;

        container.innerHTML = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);

          const viewport = page.getViewport({
            scale,
          });

          /*
           * Page wrapper
           */
          const pageContainer = document.createElement("div");

          pageContainer.style.position = "relative";

          pageContainer.style.width = `${viewport.width}px`;

          pageContainer.style.height = `${viewport.height}px`;

          pageContainer.style.margin = "0 auto 20px auto";

          /*
           * Canvas
           */
          const canvas = document.createElement("canvas");

          const context = canvas.getContext("2d");

          canvas.width = viewport.width;

          canvas.height = viewport.height;

          canvas.style.display = "block";

          pageContainer.appendChild(canvas);

          container.appendChild(pageContainer);

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          /*
           * Add text layer after
           * document data is available
           */
          if (documentData) {
            const pageData = documentData.pages.find(
              (page) => page.pageNumber === pageNumber,
            );

            if (pageData) {
              const textLayer = document.createElement("div");

              textLayer.style.position = "absolute";

              textLayer.style.top = "0";
              textLayer.style.left = "0";

              textLayer.style.width = `${viewport.width}px`;

              textLayer.style.height = `${viewport.height}px`;

              textLayer.style.pointerEvents = "none";

              pageContainer.appendChild(textLayer);

              pageData.texts.forEach((element, index) => {
                const textElement = document.createElement("div");

                textElement.contentEditable = "true";
                textElement.innerText = element.text;

                textElement.dataset.pageNumber = page.pageNumber;
                textElement.dataset.textIndex = index;
                textElement.dataset.originalText = element.text;

                textElement.style.position = "absolute";

                textElement.style.left = `${element.x * scale}px`;

                textElement.style.top = `${(element.y - element.height) * scale}px`;

                textElement.style.width = `${element.width * scale}px`;

                textElement.style.height = `${element.height * scale}px`;

                textElement.style.fontSize = `${element.height * scale * 1.25}px`;

                textElement.style.lineHeight = "1";

                textElement.style.whiteSpace = "nowrap";

                textElement.style.pointerEvents = "auto";

                textElement.style.background = "transparent";

                textElement.style.border = "none";

                textElement.style.outline = "none";

                textLayer.appendChild(textElement);
              });
            }
          }
        }
      } catch (error) {
        console.error("Error rendering PDF:", error);
      }
    };

    renderPdf();
  }, [fileUrl, documentData]);

  return (
    <div>
      <button onClick={handleSave}>Save PDF</button>

      <div ref={containerRef} />
    </div>
  );
}

export default PdfViewer;
