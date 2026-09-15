package com.pdfeditor.backend.dto;

import java.util.List;

public record PdfPage(
        int pageNumber,
        float width,
        float height,
        List<PdfTextElement> texts
) {
}