// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log the connection attempt for debugging
    console.log(`Attempting to connect to MongoDB with URI: ${process.env.MONGO_URI}`);

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
