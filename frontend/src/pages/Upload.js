import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setPrediction("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData);
      setPrediction(res.data.prediction);
    } catch (error) {
      console.error(error);
      alert("Upload failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>AI Skin Lesion Triage Assistant</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: "20px" }}>
          <h3>Image Preview:</h3>
          <img src={preview} alt="Preview" width="300" />
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleUpload}>Upload & Analyze</button>
      </div>

      {prediction && (
        <div style={{ marginTop: "20px" }}>
          <h2
            style={{
              color: prediction.includes("Malignant") ? "red" : "green",
            }}
          >
            Prediction: {prediction}
          </h2>
          <p style={{ color: "red" }}>
            ⚠️ This AI tool is for educational purposes only. Please consult a healthcare professional.
          </p>
        </div>
      )}
    </div>
  );
}

export default Upload;