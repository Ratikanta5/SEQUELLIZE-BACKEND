import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from '../src/routes/userRoutes.js';
import authRoutes from '../src/routes/authRoutes.js';
import postRoutes from '../src/routes/postRoutes.js';
import commentRoutes from '../src/routes/commentRoutes.js';
import errorHandling from '../src/middlewares/errorHandler.js';
import sequelize from '../src/config/Sequelize.js';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from 'url';

// Import models and associations

import '../src/models/index.js'; // This loads all associations

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();


//logic for rate limiting : meaning number of requests within a time period
// Define rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per window
  keyGenerator: (req, res) => {
    // Use user ID if logged in, else fallback to IP
    return req.user ? req.user.id : req.ip;
  }, 
  message: 'Too many requests, please try again later.',
});



//middleware
app.use(express.json());
app.use(cors());
app.use(limiter); // Apply to all routes for ratelimiting.
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Enable file upload (THIS handles multipart/form-data)
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true
}));

//Make uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



//routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


//Error Handling middleware
app.use(errorHandling);


//server running
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync(); 
    console.log("✅ Tables synced");

    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("Error:", error);
  }
};

startServer();