const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage destination and filename with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage }).single('file');

// Serve static files from the public folder
app.use(express.static('public'));

// File upload endpoint
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err); // Log the error on the server
      return res.status(500).send('File upload failed.');
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Send back metadata (file size, name, and mimetype)
    res.json({
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
