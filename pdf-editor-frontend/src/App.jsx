import { useState } from "react";
import PdfViewer from "./components/PdfViewer";

function App() {

    const [file, setFile] = useState(null);
    const [fileId, setFileId] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {

        const selectedFile = event.target.files[0];

        setFile(selectedFile);
        setFileId(null);
        setMessage("");
    };

    const uploadFile = async () => {

        if (!file) {
            setMessage("Please select a PDF.");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            setMessage("Uploading...");

            const response = await fetch(
                "http://localhost:8080/api/pdf/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const id = await response.text();

            setFileId(id);

            setMessage("Upload successful!");

        } catch (error) {

            console.error(error);

            setMessage("Failed to upload PDF.");
        }
    };

    const fileUrl = fileId
        ? `http://localhost:8080/api/pdf/${fileId}`
        : null;

    return (
        <div>

            <h1>PDF Editor</h1>

            <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
            />

            <button onClick={uploadFile}>
                Upload PDF
            </button>

            <p>{message}</p>

            {fileUrl && (
                <PdfViewer 
                    fileUrl={fileUrl}
                    fileId={fileId}
                />
            )}

        </div>
    );
}

export default App;