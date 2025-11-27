import { useState } from "react";

export default function FileUpload({cb}) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setStatus("❌ Please upload a valid PDF file");
      setFile(null);
      return;
    }

    setFile(selected);
    setStatus(null);
  };

  const uploadFile = async () => {
    if (!file) {
      setStatus(" No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus(" Uploading...");

      const response = await fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.detail || "Upload failed");
      cb()
      setStatus("Upload successful!");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Upload PDF File
        </h2>

        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M7 16a4 4 0 118 0m-4-4v8m6-4h.01M5 12H4m16 0h-1M5 12l1.293-1.293a1 1 0 011.414 0L12 14.586l4.293-4.293a1 1 0 011.414 0L19 12" />
            </svg>
            <span className="text-gray-500">
              {file ? file.name : "Click to choose PDF"}
            </span>
          </div>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          onClick={uploadFile}
          className="bg-blue-600 text-white w-full mt-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          Upload PDF
        </button>

        {status && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{status}</p>
        )}
      </div>
    </div>
  );
}
