import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button, CircularProgress } from "@mui/material";
import { Gesture, CameraAlt } from "@mui/icons-material";
import "./styles.css"; // Ensure you create this CSS file

const GestureRecognition = () => {
  const webcamRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const captureImage = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("Failed to capture image!");

    setLoading(true);
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "gesture.jpg");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* Banner */}
      <div className="banner">
        <img src="/logo.jpg" alt="Sign Language" className="logo" />
        <h1>Sign Language Gesture Recognition</h1>
      </div>

      {/* Webcam */}
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: 400, height: 300, facingMode: "user" }}
          className="webcam-feed"
        />
      </div>

      {/* Capture Button */}
      <div className="button-container">
        <Button
          className="capture-btn"
          startIcon={<CameraAlt />}
          variant="contained"
          onClick={captureImage}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Capture Gesture"
          )}
        </Button>
      </div>

      {/* Display Prediction */}
      {prediction && (
        <div className="prediction-box">
          <strong>Prediction:</strong> {prediction.prediction} <br />
          <strong>Confidence:</strong>{" "}
          {(prediction.confidence * 100).toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default GestureRecognition;
