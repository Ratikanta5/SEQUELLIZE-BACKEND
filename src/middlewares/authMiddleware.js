import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {

    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. No token found."
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired."
    });
  }
};

export default authMiddleware;