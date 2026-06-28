"use strict";

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_only_for_dev";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

exports.generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
