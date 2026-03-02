import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Auth from "../models/authModel.js";

const handleResponse = (res, status, message, data = null) => {
  if (data) {
    return res.status(status).json({ message, data });
  }
  return res.status(status).json({ message });
};

export const createComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    if (!text) {
      return handleResponse(res, 400, "Comment text is required");
    }

    const post = await Post.findByPk(postId);

    if (!post) {
      return handleResponse(res, 404, "Post not found");
    }

    const newComment = await Comment.create({
      text: text.trim(),
      postId,
      userId,
    });

    return handleResponse(res, 201, "Comment created successfully", newComment);
  } catch (err) {
    next(err);
  }
};

export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const post = await Post.findByPk(postId);

    if (!post) {
      return handleResponse(res, 404, "Post not found");
    }

    const comments = await Comment.findAll({
      where: { postId },
      limit,
      offset,
      include: [{ model: Auth, as: "author", attributes: ["id", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    return handleResponse(res, 200, "Comments fetched successfully", comments);
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return handleResponse(res, 404, "Comment not found");
    }

    if (comment.userId !== userId) {
      return handleResponse(
        res,
        403,
        "You are not authorized to update this comment"
      );
    }

    if (!text) {
      return handleResponse(res, 400, "Comment text is required");
    }

    comment.text = text.trim();
    await comment.save();

    return handleResponse(res, 200, "Comment updated successfully", comment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return handleResponse(res, 404, "Comment not found");
    }

    if (comment.userId !== userId) {
      return handleResponse(
        res,
        403,
        "You are not authorized to delete this comment"
      );
    }

    await comment.destroy();

    return handleResponse(res, 200, "Comment deleted successfully");
  } catch (err) {
    next(err);
  }
};
