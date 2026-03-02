import Post from "../models/postModel.js";
import Auth from "../models/authModel.js";
import Comment from "../models/commentModel.js";

const handleResponse = (res, status, message, data = null) => {
  if (data) {
    return res.status(status).json({ message, data });
  }
  return res.status(status).json({ message });
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return handleResponse(res, 400, "Title and content are required");
    }

    if (title.length > 255) {
      return handleResponse(res, 400, "Title must be less than 255 characters");
    }

    const newPost = await Post.create({
      title: title.trim(),
      content: content.trim(),
      userId: userId,
    });

    return handleResponse(res, 201, "Post created successfully", newPost);
  } catch (err) {
    next(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const posts = await Post.findAll({
      limit,
      offset,
      include: [
        { model: Auth, as: "author", attributes: ["id", "email"] },
        {
          model: Comment,
          as: "comments",
          include: [{ model: Auth, as: "author", attributes: ["id", "email"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return handleResponse(res, 200, "Posts fetched successfully", posts);
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        { model: Auth, as: "author", attributes: ["id", "email"] },
        {
          model: Comment,
          as: "comments",
          include: [{ model: Auth, as: "author", attributes: ["id", "email"] }],
        },
      ],
    });

    if (!post) {
      return handleResponse(res, 404, "Post not found");
    }

    return handleResponse(res, 200, "Post fetched successfully", post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) {
      return handleResponse(res, 404, "Post not found");
    }

    if (post.userId !== userId) {
      return handleResponse(
        res,
        403,
        "You are not authorized to update this post"
      );
    }

    if (title) {
      if (title.length > 255) {
        return handleResponse(
          res,
          400,
          "Title must be less than 255 characters"
        );
      }
      post.title = title.trim();
    }

    if (content) {
      post.content = content.trim();
    }

    await post.save();

    return handleResponse(res, 200, "Post updated successfully", post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findByPk(id);

    if (!post) {
      return handleResponse(res, 404, "Post not found");
    }

    if (post.userId !== userId) {
      return handleResponse(
        res,
        403,
        "You are not authorized to delete this post"
      );
    }

    await post.destroy();

    return handleResponse(res, 200, "Post deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const userExists = await Auth.findByPk(userId);

    if (!userExists) {
      return handleResponse(res, 404, "User not found");
    }

    const posts = await Post.findAll({
      where: { userId },
      limit,
      offset,
      include: [
        { model: Auth, as: "author", attributes: ["id", "email"] },
        {
          model: Comment,
          as: "comments",
          include: [{ model: Auth, as: "author", attributes: ["id", "email"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return handleResponse(res, 200, "User posts fetched successfully", posts);
  } catch (err) {
    next(err);
  }
};
