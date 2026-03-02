import express from 'express';
import * as userController from "../controllers/userController.js";
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post("/user", userController.createUser);
router.get("/user", userController.getAllUser);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);


router.get("/checkAuth",authMiddleware, userController.checkAuth);



export default router;
