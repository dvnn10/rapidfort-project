const express = require("express");
const { exec } = require("child_process");
const HummusRecipe = require("hummus-recipe");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Convert Route
app.post("/convert", (req, res) => {
  const { filePath } = req.body;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).send("Invalid file path");
  }

  const outputPdf = filePath.replace(".docx", ".pdf");
  const protectedPdf = filePath.replace(".docx", "_protected.pdf");

  // Convert DOCX to PDF using LibreOffice
  exec(`soffice --headless --convert-to pdf "${filePath}"`, (err) => {
    if (err) {
      console.error("Conversion Error:", err.message);
      return res.status(500).send("Conversion failed");
    }

    // Password-Protect the PDF
    const pdfDoc = new HummusRecipe(outputPdf, protectedPdf);
    pdfDoc
      .encrypt({
        userPassword: "securePassword123",
        ownerPassword: "securePassword123",
        userProtectionFlag: 4, // Restrict editing, copying, etc.
      })
      .endPDF();

    res.json({
      message: "Conversion and protection successful!",
      downloadLink: `/uploads/${path.basename(protectedPdf)}`,
    });
  });
});

// Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Start the Service
app.listen(PORT, () =>
  console.log(`Conversion Service running on http://localhost:${PORT}`)
);
