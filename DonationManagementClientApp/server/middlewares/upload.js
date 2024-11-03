// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Set up the storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure the 'uploads/' directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file to avoid conflicts
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

module.exports = upload;
