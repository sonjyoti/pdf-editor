package com.pdfeditor.backend.service;

import com.pdfeditor.backend.dto.PdfDocument;
import com.pdfeditor.backend.dto.PdfPage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class PdfService {

    private final Path uploadDirectory =
            Paths.get("uploads");

    public String uploadPdf(MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!Objects.requireNonNull(file.getOriginalFilename()).toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        Files.createDirectories(uploadDirectory);

        String fileId = UUID.randomUUID().toString();

        String filename = fileId + ".pdf";

        Path filePath = uploadDirectory.resolve(filename);

        Files.copy(
                file.getInputStream(),
                filePath
        );

        return fileId;
    }

    public byte[] getPdf(String fileId) throws IOException {

        Path filePath = uploadDirectory.resolve(fileId + ".pdf");

        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("PDF not found");
        }

        return Files.readAllBytes(filePath);
    }

    public PdfDocument extractText(
            String fileId
    ) throws IOException {

        Path filePath =
                uploadDirectory.resolve(fileId + ".pdf");

        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("PDF not found");
        }

        List<PdfPage> pages = new ArrayList<>();

        try (var document =
                     org.apache.pdfbox.Loader.loadPDF(
                             filePath.toFile()
                     )) {

            PdfTextExtractor extractor =
                    new PdfTextExtractor();

            int pageCount = document.getNumberOfPages();

            for (int pageNumber = 0;
                 pageNumber < pageCount;
                 pageNumber++) {

                var page =
                        document.getPage(pageNumber);

                float width =
                        page.getMediaBox().getWidth();

                float height =
                        page.getMediaBox().getHeight();

                extractor.clearTextElements();

                extractor.setStartPage(pageNumber + 1);
                extractor.setEndPage(pageNumber + 1);

                extractor.getText(document);

                PdfPage pdfPage =
                        new PdfPage(
                                pageNumber + 1,
                                width,
                                height,
                                new ArrayList<>(
                                        extractor.getTextElements()
                                )
                        );

                pages.add(pdfPage);
            }
        }

        return new PdfDocument(pages);
    }
}