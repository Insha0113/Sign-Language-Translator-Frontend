import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Ngrok API URL (replace if it changes)
  const API_URL = " https://c497-34-32-189-213.ngrok-free.app";

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(""); // Reset result when a new file is selected
  };

  // Upload file to Flask API
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image file first!");
      return;
    }

    setLoading(true);
    setResult("Processing...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      setResult(data.translated_text || "No result found");
    } catch (error) {
      console.error("Error:", error);
      setResult(`Error in prediction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Sign Language Translator</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Translate"}
      </button>
      <p>
        <strong>Result:</strong> {result}
      </p>
    </div>
  );
}

export default App;
