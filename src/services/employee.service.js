"use strict";

const AppError = require("../utils/AppError");

class EmployeeService {
  static async assignEmployee(employeeId, managerId) {
    // TODO: Implement employee assignment business logic
    throw new AppError("Method not implemented", 501);
  }

  static async removeEmployee(employeeId, managerId) {
    // TODO: Implement remove employee logic
    throw new AppError("Method not implemented", 501);
  }

  static async getEmployees(managerId) {
    // TODO: Implement logic to get employees for a manager
    throw new AppError("Method not implemented", 501);
  }
}

module.exports = EmployeeService;
