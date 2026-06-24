"use strict";

const express = require("express");
const router = express.Router();
const reimbursementController = require("../controllers/reimbursement.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// Creation (EMP only)
router.post(
  "/",
  authenticateUser,
  allowRoles("EMP"),
  reimbursementController.createReimbursement
);

// Approval Updates (RM, APE, CFO)
router.patch(
  "/",
  authenticateUser,
  allowRoles("RM", "APE", "CFO"),
  reimbursementController.updateStatus
);

// Fetch Reimbursments depending on role logic
router.get(
  "/",
  authenticateUser,
  reimbursementController.getReimbursements
);

// Fetch Subordinate's Reimbursements (RM only)
router.get(
  "/:userId",
  authenticateUser,
  allowRoles("RM"),
  reimbursementController.getSubordinateReimbursements
);

module.exports = router;
