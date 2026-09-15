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

    private StringBuilder currentText =
            new StringBuilder();

    private float startX;
    private float startY;
    private float lastX;
    private float lastWidth;
    private float maxHeight;

    public PdfTextExtractor() throws IOException {
        super();
    }

    @Override
    protected void writeString(
            String text,
            List<TextPosition> textPositions
    ) throws IOException {

        for (TextPosition position : textPositions) {

            String character =
                    position.getUnicode();

            float x =
                    position.getXDirAdj();

            float y =
                    position.getYDirAdj();

            float width =
                    position.getWidthDirAdj();

            float height =
                    position.getHeightDir();

            if (currentText.isEmpty()) {

                startNewElement(
                        character,
                        x,
                        y,
                        width,
                        height
                );

                continue;
            }

            float previousRight =
                    lastX + lastWidth;

            float horizontalGap =
                    x - previousRight;

            float verticalDifference =
                    Math.abs(y - startY);

            /*
             * If the Y position changed significantly,
             * this is a new line.
             */
            if (verticalDifference > height * 0.5f) {

                finishCurrentElement();

                startNewElement(
                        character,
                        x,
                        y,
                        width,
                        height
                );

                continue;
            }

            /*
             * Large horizontal gap means
             * this is probably a new word.
             */
            float spaceThreshold =
                    Math.max(height * 0.25f, 2.0f);

            if (horizontalGap > spaceThreshold) {
                currentText.append(" ");
            }

            currentText.append(character);

            lastX = x;
            lastWidth = width;

            maxHeight =
                    Math.max(maxHeight, height);
        }

        finishCurrentElement();

        super.writeString(text, textPositions);
    }

    private void startNewElement(
            String character,
            float x,
            float y,
            float width,
            float height
    ) {

        currentText.setLength(0);

        currentText.append(character);

        startX = x;
        startY = y;

        lastX = x;
        lastWidth = width;

        maxHeight = height;
    }

    private void finishCurrentElement() {

        if (currentText.isEmpty()) {
            return;
        }

        float totalWidth =
                (lastX + lastWidth) - startX;

        PdfTextElement element =
                new PdfTextElement(
                        currentText.toString(),
                        startX,
                        startY,
                        totalWidth,
                        maxHeight
                );

        textElements.add(element);

        currentText.setLength(0);
    }

    public List<PdfTextElement> getTextElements() {
        return textElements;
    }

    public void clearTextElements() {
        textElements.clear();
        currentText.setLength(0);
    }
}