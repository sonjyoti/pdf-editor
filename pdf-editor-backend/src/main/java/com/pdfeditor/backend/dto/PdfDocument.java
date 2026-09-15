package com.pdfeditor.backend.dto;

import java.util.List;

public record PdfDocument(
        List<PdfPage> pages
) {
}