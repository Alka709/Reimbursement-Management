"use strict";

const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// CFO only routes
router.post(
  "/assign",
  authenticateUser,
  allowRoles("CFO"),
  employeeController.assignEmployee
);

router.delete(
  "/assign",
  authenticateUser,
  allowRoles("CFO"),
  employeeController.removeEmployee
);

// General employees route (visibility controlled in service)
// Accessible by RM, APE, CFO
router.get(
  "/",
  authenticateUser,
  allowRoles("RM", "APE", "CFO"),
  employeeController.getEmployees
);

module.exports = router;
