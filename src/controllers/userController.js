import user from "../models/userModel.js";
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

export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    let favoritePhotos = [];

    // Validation
    if (!name || !email) {
      return handleResponse(res, 400, "Name and email are required");
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return handleResponse(res, 400, "Invalid email format");
    }

    //for favourite photos logic
    //check if files exist
    if (req.files) {
      // Try different possible field names for photos
      let photos = req.files.photos || req.files.favoritePhotos || req.files.favourite_photos;

      if (photos) {
        //if single file uploaded convert into array
        if (!Array.isArray(photos)) {
          photos = [photos];
        }

        for (let photo of photos) {
          // Validate file type
          if (!photo.mimetype.startsWith("image/")) {
            return res.status(400).json({ message: "Only image files allowed" });
          }

          const fileName = uuid() + "_" + photo.name;
          const uploadPath = path.join(__dirname, "../uploads/", fileName);

          await photo.mv(uploadPath);

          favoritePhotos.push("uploads/" + fileName);
        }
      }
    }

    const newUser = await user.create({ name, email, favouritePhotos: favoritePhotos });

    handleResponse(res, 201, "user created successfully", newUser);
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    let users = await user.findAll();
    handleResponse(res, 200, "users fetched successfully", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let userData = await user.findByPk(id);
    handleResponse(res, 200, "user fetched successfully", userData);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    // Validation
    if (!id) {
      return handleResponse(res, 400, "User ID is required");
    }

    if (!name || !email) {
      return handleResponse(res, 400, "Name and email are required");
    }

    if (typeof email !== "string" || !email.includes("@")) {
      return handleResponse(res, 400, "Invalid email format");
    }

    const userData = await user.findByPk(id);
    if (!userData) return handleResponse(res, 404, "user not found");
    await userData.update({ name, email });
    handleResponse(res, 200, "user updated successfully", userData);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = await user.findByPk(id);
    if (!userData) return handleResponse(res, 404, "user not found");
    await userData.destroy();
    handleResponse(res, 200, "user deleted successfully", userData);
  } catch (err) {
    next(err);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const loginUser = req.user;
    handleResponse(res, 200, "login user is", loginUser);
  } catch (err) {
    next(err);
  }
};
