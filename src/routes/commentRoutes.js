import express from "express";
import * as commentController from "../controllers/commentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/post/:postId", authMiddleware, commentController.createComment);
router.get("/post/:postId", commentController.getCommentsByPost);
router.put("/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

export default router;
