require('dotenv').config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const Recipe = require("muhammara").Recipe;

const app = express();
const PORT = process.env.PORT || 5000; // Fixed port 5000

// Absolute path to LibreOffice executable
const libreOfficePath = "/usr/bin/soffice"; // LibreOffice binary path

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(morgan("combined"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use(limiter);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: function (req, file, cb) {
    const allowedExtensions = /doc|docx|rtf|odt/;
    const mimetype = allowedExtensions.test(file.mimetype);
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only Word documents are allowed!"));
  },
});

// Upload Endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.warn("No file uploaded.");
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = path.join(uploadDir, req.file.filename);
  const fileExt = path.extname(req.file.filename);
  const outputExt = ".pdf";
  const outputFilename = req.file.filename.replace(fileExt, outputExt);
  const outputPath = path.join(uploadDir, outputFilename);

  console.log(`Received file: ${req.file.originalname}`);
  console.log(`Saving to: ${filePath}`);

  // LibreOffice Conversion Command
  const conversionCommand = `${libreOfficePath} --headless --convert-to pdf "${filePath}" --outdir "${uploadDir}"`;

  console.log("Starting conversion to PDF...");

  exec(conversionCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Error during conversion:", error);
      console.error("stderr:", stderr);
      return res.status(500).json({ message: "Conversion failed: LibreOffice error." });
    }

    console.log(`PDF written to: ${outputPath}`);

    // Optional: Apply password protection
    const password = req.body.password;
    if (password) {
      const protectedFilename = outputFilename.replace(outputExt, "-protected.pdf");
      const protectedPath = path.join(uploadDir, protectedFilename);

      console.log(`Applying password protection to: ${outputPath}`);

      try {
  
        const Recipe = require("muhammara").Recipe;
  const pdfDoc = new Recipe(outputPath, protectedPath);

  pdfDoc
    .encrypt({
      userPassword: password,
      ownerPassword: password,
      userProtectionFlag: 4, // Change as needed
    })
    .endPDF();

  console.log("PDF encrypted successfully!");
        console.log("Password protection applied successfully.");

        // Delete the unprotected PDF
        fs.unlink(outputPath, (err) => {
          if (err) {
            console.error("Error deleting unprotected PDF:", err);
          } else {
            console.log("Unprotected PDF deleted.");
          }
        });

        res.json({
          message: "File converted and password-protected successfully.",
          filePath: `/uploads/${protectedFilename}`,
          metadata: {
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
          },
        });
      } catch (err) {
        console.error("Error applying password protection:", err);
        res.status(500).json({ message: "Password protection failed." });
      }
    } else {
      // Respond with unprotected PDF details
      res.json({
        message: "File converted successfully.",
        filePath: `/uploads/${outputFilename}`,
        metadata: {
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    }
  });
});

// Serve Static Files from uploads directory
app.use("/uploads", express.static(uploadDir));

// Test Route
app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: err.message || "An unexpected error occurred." });
});

// Handle Unhandled Rejections and Exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
