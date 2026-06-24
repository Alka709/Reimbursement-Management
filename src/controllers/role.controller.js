"use strict";

const RoleService = require("../services/role.service");
const AppError = require("../utils/AppError");

exports.assignRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      throw new AppError("Missing required fields: userId, role", 400);
    }

    const updatedUser = await RoleService.assignRole(userId, role);

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
