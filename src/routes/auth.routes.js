"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected route to verify cookie extraction
router.get("/me", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

module.exports = router;
