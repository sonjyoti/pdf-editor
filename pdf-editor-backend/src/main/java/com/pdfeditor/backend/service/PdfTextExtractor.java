package com.pdfeditor.backend.service;

import com.pdfeditor.backend.dto.PdfTextElement;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PdfTextExtractor extends PDFTextStripper {

    private final List<PdfTextElement> textElements =
            new ArrayList<>();

    public PdfTextExtractor() throws IOException {
        super();
    }

    @Override
    protected void writeString(
            String text,
            List<TextPosition> textPositions
    ) throws IOException {

        for (TextPosition position : textPositions) {

            PdfTextElement element =
                    new PdfTextElement(
                            position.getUnicode(),
                            position.getXDirAdj(),
                            position.getYDirAdj(),
                            position.getWidthDirAdj(),
                            position.getHeightDir()
                    );

            textElements.add(element);
        }

        super.writeString(text, textPositions);
    }

    public List<PdfTextElement> getTextElements() {
        return textElements;
    }

    public void clearTextElements() {
        textElements.clear();
    }
}