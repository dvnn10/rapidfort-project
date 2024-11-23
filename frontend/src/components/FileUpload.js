// src/components/FileUpload.js

import React, { useState } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
    setConvertedFile(null);
    setFileMetadata(null);
    setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (password) {
      formData.append("password", password);
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`https://word-to-pdf-backend-gs0i.onrender.com/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      setFileMetadata({
        name: data.metadata.originalName,
        size: `${(data.metadata.size / 1024).toFixed(2)} KB`,
        type: data.metadata.mimeType,
      });
      setConvertedFile(data.filePath);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      window.open(`https://word-to-pdf-backend-gs0i.onrender.com/${convertedFile}`, "_blank");
    }
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <button className="mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? "🌙" : "☀️"}
      </button>
      <div className="header">
        <h1>Word to PDF Converter</h1>
        <p>Quickly convert your Word documents to secure PDF files with just a few clicks.</p>
      </div>
      <div className="upload-box">
        <label htmlFor="file-upload" className="custom-file-upload">
          Choose File
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".doc,.docx,.rtf,.odt"
        />
        {file && <p className="file-name">Selected File: {file.name}</p>}

        {/* Password Input Fields */}
        <div className="password-container">
          <input
            type="password"
            placeholder="Enter password (optional)"
            value={password}
            onChange={handlePasswordChange}
            className="password-input"
          />

          {password && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="password-input"
            />
          )}
        </div>

        <button className="upload-button" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      {fileMetadata && (
        <div className="metadata-section">
          <h3>File Metadata</h3>
          <p><strong>Name:</strong> {fileMetadata.name}</p>
          <p><strong>Size:</strong> {fileMetadata.size}</p>
          <p><strong>Type:</strong> {fileMetadata.type}</p>
        </div>
      )}
      {convertedFile && (
        <>
          <div className="preview-download-container">
            <div className="preview-section">
              <h3>PDF Preview</h3>
              <iframe
                src={`https://word-to-pdf-backend-gs0i.onrender.com/${convertedFile}`}
                title="PDF Preview"
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            </div>
            <div className="download-section">
              <button className="upload-button" onClick={handleDownload}>
                Download PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
