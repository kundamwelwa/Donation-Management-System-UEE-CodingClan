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
const projectRoutes = require('./routes/CreateProjectRoutes');

const { errorHandler } = require('./middlewares/errorHandler');

const app = express(); 

connectDB();

app.use(cors({
  origin: '*', // ⚠️ 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/upload', express.static(path.join(__dirname, 'upload')));


app.use('/api/auth', authRoutes);
app.use('/api/Orphanages', orphanageRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
