import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PdfViewer({ fileUrl }) {

    const containerRef = useRef(null);

    useEffect(() => {

        if (!fileUrl) {
            return;
        }

        const renderPdf = async () => {

            try {

                const pdf = await pdfjsLib.getDocument({
                    url: fileUrl
                }).promise;

                const container = containerRef.current;

                // Remove previous pages
                container.innerHTML = "";

                for (let pageNumber = 1;
                     pageNumber <= pdf.numPages;
                     pageNumber++) {

                    const page = await pdf.getPage(pageNumber);

                    const scale = 1.5;

                    const viewport = page.getViewport({
                        scale
                    });

                    // Create page wrapper
                    const pageContainer =
                        document.createElement("div");

                    pageContainer.style.position = "relative";
                    pageContainer.style.marginBottom = "20px";
                    pageContainer.style.display = "flex";
                    pageContainer.style.justifyContent = "center";

                    // Create canvas
                    const canvas =
                        document.createElement("canvas");

                    const context =
                        canvas.getContext("2d");

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    pageContainer.appendChild(canvas);
                    container.appendChild(pageContainer);

                    await page.render({
                        canvasContext: context,
                        viewport
                    }).promise;
                }

            } catch (error) {

                console.error(
                    "Error rendering PDF:",
                    error
                );

            }
        };

        renderPdf();

    }, [fileUrl]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                padding: "20px"
            }}
        />
    );
}

export default PdfViewer;