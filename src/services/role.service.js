"use strict";

const AppError = require("../utils/AppError");

class RoleService {
  static async assignRole(userId, newRole) {
    // TODO: Implement role assignment business logic
    throw new AppError("Method not implemented", 501);
  }
}

module.exports = RoleService;
