"use strict";

const AppError = require("../utils/AppError");

exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("Not authorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden: Insufficient permissions", 403));
    }

    next();
  };
};
