const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// File Upload Directory
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup Multer for File Uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  res.json({
    message: "File uploaded successfully!",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Start the Service
app.listen(PORT, () => console.log(`File Upload Service running on http://localhost:${PORT}`));
