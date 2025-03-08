import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authUser = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, token missing",
    });
  }

  // Verify the token
  let verified;
  try {
    verified = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Find user by ID from verified token
  try {
    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in authentication middleware",
    });
  }
};

export default authUser;
