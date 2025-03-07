import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Nav from "@/components/nav";

export default function ModelGarden() {
  const [selectedModel, setSelectedModel] = useState("");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [aiContent, setAiContent] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]); // List of available cameras
  const [selectedCameraId, setSelectedCameraId] = useState(""); // Selected camera ID
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const models = [
    { name: "Pneumonia", endpoint: "http://127.0.0.1:8000/pneumonia_detection" },
    { name: "Brain Tumor", endpoint: "http://127.0.0.1:8000/braintumor_detection" },
    { name: "Skin Cancer", endpoint: "http://127.0.0.1:8000/skincancer_detection" },
    { name: "Skin Infection", endpoint: "http://127.0.0.1:8000/skindisease_classification" },
    { name: "Skin Lesion", endpoint: "http://127.0.0.1:8000/skinlesion_classification" },
    { name: "Diabetic Retinopathy", endpoint: "https://api-inference.huggingface.co/models/retina" },
  ];

  // Fetch available cameras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setSelectedCameraId(cameras[0].deviceId); // Default to the first camera
        }
      } catch (err) {
        console.error("Error fetching cameras:", err);
      }
    };

    fetchCameras();
  }, []);

  // Start/stop camera based on `useCamera` state
  useEffect(() => {
    if (useCamera) {
      startCamera(selectedCameraId);
    } else {
      stopCamera();
    }
  }, [useCamera, selectedCameraId]);

  const startCamera = async (cameraId) => {
    try {
      const constraints = {
        video: { deviceId: cameraId ? { exact: cameraId } : undefined },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Error accessing camera: " + err.message);
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      setCameraActive(false);
    }
  };

  const handleCameraChange = (event) => {
    setSelectedCameraId(event.target.value);
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
      const capturedFile = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      setFile(capturedFile);
      setFileUrl(URL.createObjectURL(capturedFile));
    }, 'image/jpeg');
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setResults(null);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setFile(uploadedFile);
    setFileUrl(URL.createObjectURL(uploadedFile));
    setResults(null);
  };

  const handleSubmit = async () => {
    if (!selectedModel || !file) {
      alert("Please select a model and upload a file.");
      return;
    }

    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("file", file);

    const selectedEndpoint = models.find((model) => model.name === selectedModel)?.endpoint;

    try {
      const response = await axios.post(selectedEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;
      setResults({
        class: result.predicted_class,
        confidence: (result.confidence * 100).toFixed(2) + "%",
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error performing diagnosis:", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.detail}`);
      } else {
        alert("An error occurred while performing the diagnosis. Please check your backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAIContent = async (tab) => {
    if (!results) {
      alert("Please run a diagnosis first.");
      return;
    }

    setAiLoading(true);
    setAiContent(null);

    const prompt = tab === "Interpretation" 
      ? `Assume role of Specialist AI Doctor, explain the disease and provide an interpretation for the diagnostic result: ${results.class} with ${results.confidence} confidence in short, patient-friendly way.`
      : `Assume role of Specialist AI Doctor, provide an consultation advise for the diagnostic result: ${results.class} with ${results.confidence} confidence in short, patient-friendly way. Do not prescribe any drug, only ayurvedic or home remedies. If severe, make them consult specialist doctor.`;

    try {
      const response = await axios.post("http://127.0.0.1:8001/generate", { prompt });
      setAiContent(response.data.response);
    } catch (error) {
      console.error("Error fetching AI content:", error);
      alert("Failed to fetch content from AI.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCaptureModeToggle = (useCam) => {
    setUseCamera(useCam);
    setFile(null);
    setFileUrl(null);
  };

  // Back button handler
  const handleBack = () => {
    setSubmitted(false); // Hide results section
    setResults(null); // Clear results
    setFile(null); // Clear uploaded file
    setFileUrl(null); // Clear file URL
    setAiContent(null); // Clear AI content
    setActiveTab(null); // Reset active tab
    if (useCamera) {
      stopCamera(); // Stop camera if active
      startCamera(selectedCameraId); // Restart camera if in camera mode
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Garden of Diagnostic Models</h1>
        <div className={`grid gap-8 ${submitted ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Left Section */}
          <div className="space-y-6">
            {/* Model Selection */}
            <div>
              <label htmlFor="model" className="block text-slate-300 font-semibold mb-2">
                Select a Model and Capture/Upload Image:
              </label>
              <select
                className="w-full p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleModelChange}
                value={selectedModel}
              >
                <option value="" className="text-gray-800">Select a Model</option>
                {models.map((model, index) => (
                  <option key={index} value={model.name} className="text-gray-800">
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Capture Mode Toggle */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleCaptureModeToggle(false)}
                className={`px-4 py-2 rounded-2xl ${
                  !useCamera ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white" : "bg-white/10 backdrop-blur-sm text-slate-300"
                }`}
              >
                Upload Image
              </button>
              <button
                onClick={() => handleCaptureModeToggle(true)}
                className={`px-4 py-2 rounded-2xl ${
                  useCamera ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white" : "bg-white/10 backdrop-blur-sm text-slate-300"
                }`}
              >
                Use Camera
              </button>
            </div>

            {/* Camera Selection Dropdown */}
            {useCamera && (
              <div>
                <label htmlFor="camera-select" className="block text-slate-300 font-semibold mb-2">
                  Select Camera:
                </label>
                <select
                  id="camera-select"
                  className="w-full p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleCameraChange}
                  value={selectedCameraId}
                >
                  {availableCameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId} className="text-gray-800">
                      {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* File Upload/Camera Preview */}
            <div className="w-full h-64 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center">
              {!file ? (
                useCamera ? (
                  <div className="w-full flex flex-col items-center gap-4">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      className="w-full h-48 object-contain rounded-lg bg-white/10 backdrop-blur-sm"
                    />
                    {cameraActive && (
                      <button
                        onClick={captureImage}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
                      >
                        Capture Image
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                      <img src="/disk.png" alt="Upload" className="w-24 h-24" />
                      <span className="text-slate-300 font-medium text-center">
                        Click here to upload<br />or drop files here
                      </span>
                    </label>
                  </>
                )
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <img 
                    src={fileUrl} 
                    alt="Uploaded Medical" 
                    className="max-w-full h-48 object-contain rounded-lg shadow-md" 
                  />
                  <button
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:opacity-90 transition"
                    onClick={() => {
                      setFile(null);
                      setFileUrl(null);
                      if (useCamera) startCamera(selectedCameraId);
                    }}
                  >
                    Clear Image
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {!submitted && (
              <button
                className={`w-full px-6 py-3 text-lg text-white rounded-2xl ${
                  loading ? "bg-gray-400" : "bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90"
                } transition`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Run Diagnosis"}
              </button>
            )}
          </div>

          {/* Right Section */}
          {submitted && (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:opacity-90 transition"
              >
                Back to Diagnosis
              </button>

              {/* Diagnosis Results */}
              {results && (
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Diagnosis Results</h2>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-slate-300">Predicted Class:</span>
                      <span className="font-bold text-white">{results.class}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-300">Confidence:</span>
                      <span className="font-bold text-white">{results.confidence}</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Interpretation/Consultation Tabs */}
              <div>
                <div className="flex border-b border-white/20">
                  <button
                    className={`px-4 py-2 font-bold ${
                      activeTab === "Interpretation" ? "text-white border-b-2 border-blue-500" : "text-slate-300"
                    }`}
                    onClick={() => { setActiveTab("Interpretation"); fetchAIContent("Interpretation"); }}
                  >
                    Interpretation
                  </button>
                  <button
                    className={`px-4 py-2 font-bold ${
                      activeTab === "Consultation" ? "text-white border-b-2 border-blue-500" : "text-slate-300"
                    }`}
                    onClick={() => { setActiveTab("Consultation"); fetchAIContent("Consultation"); }}
                  >
                    Consultation
                  </button>
                </div>
                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 mt-4">
                  {aiLoading ? (
                    <p className="text-slate-300">Loading...</p>
                  ) : aiContent ? (
                    <p className="text-slate-300">{aiContent}</p>
                  ) : (
                    <p className="text-slate-300">Select a tab to view content.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}