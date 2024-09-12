require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db'); // Ensure this function is correctly implemented
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import routes
const { errorHandler } = require('./middlewares/errorHandler'); // Import error handling middleware

const app = express();

// Connect to the database
connectDB(); // Make sure this function connects to MongoDB using process.env.MONGO_URI

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Set up authentication routes

// Error Handling Middleware
app.use(errorHandler); // Centralized error handling

// Start the server
const PORT = process.env.PORT || 5001; // Default port to 5001 if not specified
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // Log the server start
});
