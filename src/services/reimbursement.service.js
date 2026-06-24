"use strict";

const AppError = require("../utils/AppError");

class ReimbursementService {
  static async createReimbursement(data) {
    // TODO: Implement reimbursement creation
    throw new AppError("Method not implemented", 501);
  }

  static async updateStatus(reimbursementId, userId, role, newStatus) {
    // TODO: Implement reimbursement approval business logic
    throw new AppError("Method not implemented", 501);
  }

  static async getReimbursements(userId) {
    // TODO: Implement logic to get personal reimbursements
    throw new AppError("Method not implemented", 501);
  }

  static async getSubordinateReimbursements(managerId, role) {
    // TODO: Implement reimbursement visibility logic for RM, APE, CFO
    throw new AppError("Method not implemented", 501);
  }

  static async calculateFinalStatus(reimbursementId) {
    // TODO: Implement logic to deduce final status
    throw new AppError("Method not implemented", 501);
  }
}

module.exports = ReimbursementService;
