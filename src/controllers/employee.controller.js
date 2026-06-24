"use strict";

const EmployeeService = require("../services/employee.service");
const AppError = require("../utils/AppError");

exports.assignEmployee = async (req, res, next) => {
  try {
    const { employeeId, managerId } = req.body;

    if (!employeeId || !managerId) {
      throw new AppError("Missing required fields: employeeId, managerId", 400);
    }

    const mapping = await EmployeeService.assignEmployee(employeeId, managerId);

    res.status(201).json({
      success: true,
      data: mapping,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeEmployee = async (req, res, next) => {
  try {
    const { employeeId, managerId } = req.body;

    if (!employeeId || !managerId) {
      throw new AppError("Missing required fields: employeeId, managerId", 400);
    }

    await EmployeeService.removeEmployee(employeeId, managerId);

    res.status(200).json({
      success: true,
      message: "Employee successfully unassigned from manager",
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const { userId, role } = req.user;

    const employees = await EmployeeService.getEmployees(userId, role);

    res.status(200).json({
      status: "success",
      data: {
        users: employees,
      },
    });
  } catch (error) {
    next(error);
  }
};
