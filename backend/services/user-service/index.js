const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI,{family:4})
  .then(() => {
    // console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5001, () => {
      // console.log("User-service running on port", process.env.PORT || 5001);
    });
  })
  .catch(err => console.error("MongoDB error:", err));