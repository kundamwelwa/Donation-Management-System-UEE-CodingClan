// server.js

require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/db'); 
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/authRoutes'); 
const orphanageRoutes = require('./routes/orphanageAuthRoutes'); 
const campaignRoutes = require('./routes/CampaignRoutes'); 
const donationRoutes = require('./routes/DonationRoutes'); 

const { errorHandler } = require('./middlewares/errorHandler'); 

const app = express();

// Connect to the database
connectDB(); 

// CORS configuration to allow requests from any origin (for development)
app.use(cors({
  origin: '*', // ⚠️ Important: Adjust this in production for security
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));

// Parse JSON requests
app.use(express.json()); 

// Define API routes
app.use('/api/auth', authRoutes); 
app.use('/api/orphanages', orphanageRoutes); 
app.use('/api/campaigns', campaignRoutes); 
app.use('/api/donations', donationRoutes); 

// Error handling middleware (should be placed after all routes)
app.use(errorHandler); 

// Start the server
const PORT = process.env.PORT || 5001; 
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // Log the server start
});
