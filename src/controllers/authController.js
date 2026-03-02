import bcrypt from "bcrypt";
import Auth from "../models/authModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const register = async (req, res, next) => {
  try {
    let { email, password } = req.body;
     let imagePath = null;

    // Validation
    if (!email || !password) {
      return handleResponse(res, 400, "Email and password are required");
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return handleResponse(res, 400, "Invalid email format");
    }

    // Check if user already exists
    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser) {
      return handleResponse(res, 409, "User with this email already exists. Please login or use a different email.");
    }

    // Check if image uploaded
    if (req.files && req.files.profileImage) {

      const image = req.files.profileImage;

      // Validate file type 
      if (!image.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "Only image files allowed" });
      }

      // Create unique filename
      const fileName = uuid() + "_" + image.name;

      const uploadPath = path.join(__dirname, "../uploads/", fileName);

      // Move file to uploads folder
      await image.mv(uploadPath);

      // Save relative path
      imagePath = "uploads/" + fileName;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = await Auth.create({ email, password: hashedPassword , profileImage: imagePath});
    handleResponse(res, 201, "user created successfully", registerUser);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return handleResponse(res, 400, "Email and password are required");
    }

    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      return handleResponse(res, 404, "User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return handleResponse(res, 401, "Invalid credentials");
    }

    //access token - short life
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    //refresh token - long life
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    //sending access token in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in production (https)
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    //sending refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    handleResponse(res, 200, "Login successful", {
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    handleResponse(res, 200, "Access Token Refreshed", newAccessToken);
  } catch (err) {
    next(err);
  }
};
