package com.pdfeditor.backend.dto;

public record PdfTextEdit(
        int pageNumber,
        int textIndex,
        String nextText
) {
}
