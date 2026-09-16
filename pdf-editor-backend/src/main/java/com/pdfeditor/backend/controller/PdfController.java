package com.pdfeditor.backend.controller;

import com.pdfeditor.backend.dto.PdfDocument;
import com.pdfeditor.backend.dto.PdfEditRequest;
import com.pdfeditor.backend.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.io.IOException;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:5173")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPdf(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        String fileId = pdfService.uploadPdf(file);

        return ResponseEntity.ok(fileId);
    }

    @GetMapping(
            value = "/{fileId}",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> getPdf(
            @PathVariable String fileId
    ) throws IOException {

        byte[] pdf = pdfService.getPdf(fileId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/{fileId}/text")
    public ResponseEntity<PdfDocument> extractText(
            @PathVariable String fileId
    ) throws IOException {

        PdfDocument document =
                pdfService.extractText(fileId);

        return ResponseEntity.ok(document);
    }

    @PostMapping("/{fileId}/edit")
    public ResponseEntity<byte[]> editPdf(
            @PathVariable String fileId,
            @RequestBody PdfEditRequest request
    ) throws IOException {

        byte[] editedPdf =
                pdfService.editPdf(fileId, request);

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"edited.pdf\""
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(editedPdf);
    }
}