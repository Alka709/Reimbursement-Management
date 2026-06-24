"use strict";

const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// POST /rest/roles/assign
router.post(
  "/assign",
  authenticateUser,
  allowRoles("CFO"),
  roleController.assignRole
);

module.exports = router;
