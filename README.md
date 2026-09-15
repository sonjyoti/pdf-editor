# PDF Editor (Vibe Coded)

A web-based PDF text editor built with **React**, **Spring Boot**, **Apache PDFBox**, and **PDF.js**.

The project aims to provide a browser-based interface for uploading, viewing, and eventually editing text directly inside PDF documents.

## 🚧 Project Status

**Currently in development.**

Implemented so far:

* PDF upload
* PDF storage on the backend
* Unique file ID generation
* PDF retrieval
* PDF rendering in the browser
* Multi-page PDF rendering
* PDF text extraction
* Text position extraction using PDFBox
* Page-wise PDF text representation
* Initial text grouping into text elements

Planned features:

* Editable text overlays
* Text formatting
* Add new text
* Delete/edit existing text
* Text selection
* Zoom and page navigation
* Highlighting and annotations
* Add images
* Page management
* Undo/redo
* Save edited PDF
* Download/export edited PDF
* OCR support for scanned PDFs

---

## 🏗️ Architecture

The project is divided into two applications:

```text
pdf-editor/
│
├── pdf-editor-backend/
│   └── Spring Boot
│
└── pdf-editor-frontend/
    └── React + Vite
```

The frontend communicates with the backend through REST APIs.

```text
                  ┌─────────────────────┐
                  │    React Frontend   │
                  │                     │
                  │      PDF.js         │
                  └──────────┬──────────┘
                             │
                             │ REST API
                             │
                  ┌──────────▼──────────┐
                  │   Spring Boot API   │
                  │                     │
                  │ Controller          │
                  │ Service             │
                  │ PDF Processing      │
                  └──────────┬──────────┘
                             │
                             │
                    ┌────────▼────────┐
                    │   Apache PDFBox │
                    └────────┬────────┘
                             │
                             ▼
                           PDF
```

---

## 🛠️ Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Validation
* Maven
* Apache PDFBox

### Frontend

* React
* Vite
* JavaScript
* PDF.js
* HTML/CSS

---

## 📁 Backend Structure

```text
pdf-editor-backend/
│
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── pdfeditor/
│                   └── backend/
│                       │
│                       ├── controller/
│                       │   └── PdfController.java
│                       │
│                       ├── service/
│                       │   ├── PdfService.java
│                       │   └── PdfTextExtractor.java
│                       │
│                       ├── dto/
│                       │   ├── PdfDocument.java
│                       │   ├── PdfPage.java
│                       │   └── PdfTextElement.java
│                       │
│                       ├── exception/
│                       │
│                       └── PdfEditorBackendApplication.java
│
├── uploads/
│
└── pom.xml
```

---

## 📁 Frontend Structure

```text
pdf-editor-frontend/
│
├── src/
│   │
│   ├── components/
│   │   └── PdfViewer.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
│
├── package.json
└── vite.config.js
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Java 21 or later
* Maven
* Node.js
* npm
* IntelliJ IDEA or another Java IDE

---

## 1. Clone the repository

```bash
git clone https://github.com/sonjyoti/pdf-editor.git
```

Then enter the project directory:

```bash
cd pdf-editor
```

---

# Backend Setup

Navigate to the backend:

```bash
cd pdf-editor-backend
```

Run the Spring Boot application:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux/macOS

```bash
./mvnw spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8080
```

---

# Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd pdf-editor-frontend
```

Install dependencies:

```bash
npm install
```

Install PDF.js:

```bash
npm install pdfjs-dist
```

Start the development server:

```bash
npm run dev
```

The frontend runs by default on:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

## Test Backend

```http
GET /api/pdf/test
```

Example:

```text
http://localhost:8080/api/pdf/test
```

Response:

```text
PDF Editor Backend is working!
```

---

## Upload PDF

```http
POST /api/pdf/upload
```

Request:

```text
Content-Type: multipart/form-data
```

Form field:

```text
file = <PDF file>
```

Example response:

```text
0bafeaad-52ee-4ae8-adec-136decc7463a
```

The backend stores the uploaded PDF as:

```text
uploads/
└── 0bafeaad-52ee-4ae8-adec-136decc7463a.pdf
```

---

## Retrieve PDF

```http
GET /api/pdf/{fileId}
```

Example:

```text
GET /api/pdf/0bafeaad-52ee-4ae8-adec-136decc7463a
```

The endpoint returns the PDF with:

```text
Content-Type: application/pdf
```

---

## Extract PDF Text

```http
GET /api/pdf/{fileId}/text
```

Example:

```text
GET /api/pdf/0bafeaad-52ee-4ae8-adec-136decc7463a/text
```

The endpoint returns a page-based JSON representation of the PDF text.

Example:

```json
{
  "pages": [
    {
      "pageNumber": 1,
      "width": 612.0,
      "height": 792.0,
      "texts": [
        {
          "text": "Hello World",
          "x": 72.0,
          "y": 100.0,
          "width": 80.0,
          "height": 12.0
        }
      ]
    }
  ]
}
```

---

# 📄 PDF Processing

The backend uses **Apache PDFBox** for PDF processing.

PDFBox is responsible for:

```text
PDF
 │
 ├── Load document
 │
 ├── Read pages
 │
 ├── Extract text
 │
 ├── Determine text positions
 │
 └── Prepare data for editing
```

The extracted text contains positional information:

```text
Text
 ├── X coordinate
 ├── Y coordinate
 ├── Width
 └── Height
```

This information will later be used by the React frontend to position editable text elements over the rendered PDF.

---

# 🖥️ PDF Rendering

The frontend uses **PDF.js** to render PDF pages.

The rendering pipeline is:

```text
PDF
 │
 ▼
PDF.js
 │
 ▼
Canvas
 │
 ▼
Browser
```

Each PDF page is currently rendered on its own canvas.

The long-term editor architecture will use multiple layers:

```text
┌───────────────────────────────┐
│       Editing Layer           │
│                               │
│   Hello World ← editable      │
│                               │
├───────────────────────────────┤
│                               │
│        PDF.js Canvas          │
│                               │
└───────────────────────────────┘
```

The PDF canvas displays the original document while the editing layer provides interactive text elements.

---

# 📝 Planned Editing Architecture

The eventual editor will represent each page approximately as:

```text
PdfDocument
│
├── PdfPage
│   ├── PdfTextElement
│   ├── PdfTextElement
│   └── ...
│
├── PdfPage
│   ├── PdfTextElement
│   └── ...
│
└── ...
```

Each text element will contain information such as:

```text
text
x
y
width
height
font
fontSize
```

This information can be used to create editable HTML elements positioned over the PDF canvas.

---

# 🔮 Future Features

## Text Editing

* Edit existing PDF text
* Add text
* Delete text
* Move text
* Resize text
* Change font
* Change font size
* Change alignment
* Change text color

## Annotations

* Highlight
* Underline
* Strikethrough
* Draw
* Shapes
* Comments

## Document Management

* Add pages
* Delete pages
* Reorder pages
* Rotate pages
* Duplicate pages

## Export

* Save changes
* Generate updated PDF
* Download edited PDF

## Advanced

* OCR for scanned PDFs
* Digital signatures
* Password-protected PDFs
* Undo/redo
* Search and replace
* Multiple document support

---

# ⚠️ Limitations

PDFs are not structured like Word documents.

Text may be stored as individual positioned characters rather than complete words or paragraphs. Therefore, text extraction and reconstruction can vary depending on how the original PDF was created.

Scanned PDFs may contain only images and no actual text. Such documents will require OCR before their text can be edited.

The current text grouping algorithm is an initial implementation and may not correctly group every type of PDF layout.

---

# 📌 Development Roadmap

```text
[x] Create Spring Boot backend
[x] Create React frontend
[x] Connect frontend and backend
[x] Upload PDF
[x] Store PDF
[x] Retrieve PDF
[x] Render PDF with PDF.js
[x] Render multiple pages
[x] Extract PDF text
[x] Extract text coordinates
[x] Group text into elements
[ ] Build editable text layer
[ ] Edit existing text
[ ] Add new text
[ ] Delete text
[ ] Text formatting
[ ] Zoom and navigation
[ ] Annotations
[ ] Page management
[ ] Save edited PDF
[ ] Export/download
[ ] OCR
```

---

## 📄 License

This project is currently intended as a personal/learning project.

Add an appropriate open-source license here if the project is published publicly.
