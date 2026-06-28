"use strict";

const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");

exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new AppError("Not authorized, no token provided", 401));
    }

    const decoded = verifyToken(token);
    
    // Attach exactly { userId, role } to req.user as requested
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return next(new AppError("Not authorized, token failed", 401));
  }
};
