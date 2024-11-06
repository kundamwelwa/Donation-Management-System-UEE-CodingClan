require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const upload = require('./middlewares/upload'); // Import multer configuration for file uploads

const authRoutes = require('./routes/authRoutes');
const orphanageRoutes = require('./routes/orphanageAuthRoutes');
const campaignRoutes = require('./routes/CampaignRoutes');
const donationRoutes = require('./routes/DonationRoutes');

const { errorHandler } = require('./middlewares/errorHandler');

const app = express(); // Create an Express application

// Connect to the database
connectDB();

// Enable CORS
app.use(cors({
  origin: '*', // ⚠️ Consider limiting this to specific domains in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Serve static files from the uploads directory
app.use('/upload', express.static(path.join(__dirname, 'upload'))); // Serve images

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/Orphanages', orphanageRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);

// Error handling middleware (should be placed after all routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
