package com.pdfeditor.backend.dto;

import java.util.List;

public record PdfEditRequest(
        List<PdfTextEdit> changes
) {
}
