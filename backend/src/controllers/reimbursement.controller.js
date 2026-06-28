"use strict";

const ReimbursementService = require("../services/reimbursement.service");
const AppError = require("../utils/AppError");

exports.createReimbursement = async (req, res, next) => {
  try {
    const { title, description, amount } = req.body;
    const { userId } = req.user; // Set by auth.middleware

    if (!title || !description || amount === undefined) {
      throw new AppError("Missing required fields: title, description, amount", 400);
    }

    const newReimbursement = await ReimbursementService.createReimbursement({
      employeeId: userId,
      title,
      description,
      amount,
    });

    res.status(201).json({
      status: "success",
      data: newReimbursement,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { reimbursementId, status } = req.body;
    const { userId, role } = req.user;

    if (!reimbursementId || !status) {
      throw new AppError("Missing required fields: reimbursementId, status", 400);
    }

    const updated = await ReimbursementService.updateStatus(
      reimbursementId,
      userId,
      role,
      status
    );

    res.status(200).json({
      status: "success",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReimbursements = async (req, res, next) => {
  try {
    const { userId, role } = req.user;

    const reimbursements = await ReimbursementService.getReimbursements(userId, role);

    res.status(200).json({
      status: "success",
      data: {
        reimbursements,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubordinateReimbursements = async (req, res, next) => {
  try {
    const { userId: managerId, role } = req.user;
    const targetUserId = req.params.userId;

    if (!targetUserId) {
      throw new AppError("Missing target userId in parameters", 400);
    }

    const reimbursements = await ReimbursementService.getSubordinateReimbursements(
      managerId,
      role,
      targetUserId
    );

    res.status(200).json({
      status: "success",
      data: {
        reimbursements,
      },
    });
  } catch (error) {
    next(error);
  }
};
