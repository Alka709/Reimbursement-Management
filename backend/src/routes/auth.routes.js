"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected route — returns the authenticated user's { userId, role } from the JWT
router.get("/profile", authenticateUser, authController.profile);

module.exports = router;
