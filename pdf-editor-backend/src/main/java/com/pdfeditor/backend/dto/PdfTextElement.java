package com.pdfeditor.backend.dto;

public record PdfTextElement(
        String text,
        float x,
        float y,
        float width,
        float height
) {
}