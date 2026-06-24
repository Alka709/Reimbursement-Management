"use strict";

const AuthService = require("../services/auth.service");
const AppError = require("../utils/AppError");


// Helper for basic input validation
const validateInput = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || String(value).trim() === "") {
      throw new AppError(`Missing required field: ${key}`, 400);
    }
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    validateInput({ name, email, password });
    
    if (!email.toLowerCase().endsWith("@org.com")) {
      throw new AppError("Only org.com email addresses are allowed",400);
    }
    const newUser = await AuthService.register(name, email, password);

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateInput({ email, password });

    if (!email.toLowerCase().endsWith("@org.com")) {
      throw new AppError("Only org.com email addresses are allowed",400);
    }

    const { user, token } = await AuthService.login(email, password);

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Clear authentication cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
