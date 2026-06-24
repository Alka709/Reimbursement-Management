"use strict";

const { eq, and, desc } = require("drizzle-orm");
const { db } = require("../db");
const { reimbursements } = require("../db/schema/reimbursements.schema");
const { employeeManager } = require("../db/schema/employee_manager.schema");
const { users } = require("../db/schema/users.schema");
const AppError = require("../utils/AppError");

class ReimbursementService {
  static async createReimbursement(data) {
    const { employeeId, title, description, amount } = data;

    if (amount <= 0) {
      throw new AppError("Amount must be greater than zero", 400);
    }

    const [newReimbursement] = await db
      .insert(reimbursements)
      .values({
        employeeId,
        title,
        description,
        amount: amount.toString(),
      })
      .returning();

    return newReimbursement;
  }

  static calculateFinalStatus(rmApproval, apeApproval) {
    if (rmApproval === "REJECTED" || apeApproval === "REJECTED") {
      return "REJECTED";
    }
    if (rmApproval === "APPROVED" && apeApproval === "APPROVED") {
      return "APPROVED";
    }
    return "PENDING";
  }

  static async updateStatus(reimbursementId, userId, role, newStatus) {
    if (!["APPROVED", "REJECTED"].includes(newStatus)) {
      throw new AppError("Invalid status value", 400);
    }

    const [reimbursement] = await db
      .select()
      .from(reimbursements)
      .where(eq(reimbursements.id, reimbursementId))
      .limit(1);

    if (!reimbursement) {
      throw new AppError("Reimbursement not found", 404);
    }

    if (reimbursement.finalStatus !== "PENDING") {
      throw new AppError("Reimbursement is already finalized", 400);
    }

    let rmApproval = reimbursement.rmApproval;
    let apeApproval = reimbursement.apeApproval;
    let finalStatus = reimbursement.finalStatus;

    if (role === "RM") {
      // RM can approve/reject only reimbursements belonging to employees assigned to them.
      const [mapping] = await db
        .select()
        .from(employeeManager)
        .where(
          and(
            eq(employeeManager.employeeId, reimbursement.employeeId),
            eq(employeeManager.managerId, userId)
          )
        )
        .limit(1);

      if (!mapping) {
        throw new AppError("Forbidden: Employee does not report to you", 403);
      }

      rmApproval = newStatus;
    } else if (role === "APE") {
      // APE can approve/reject only after rmApproval = APPROVED
      if (reimbursement.rmApproval !== "APPROVED") {
        throw new AppError("RM must approve before APE can act", 400);
      }

      apeApproval = newStatus;
    } else if (role === "CFO") {
      // CFO can approve/reject any reimbursement
      rmApproval = newStatus;
      apeApproval = newStatus;
    } else {
      throw new AppError("Forbidden role", 403);
    }

    finalStatus = this.calculateFinalStatus(rmApproval, apeApproval);

    const [updated] = await db
      .update(reimbursements)
      .set({ rmApproval, apeApproval, finalStatus, updatedAt: new Date() })
      .where(eq(reimbursements.id, reimbursementId))
      .returning();

    return updated;
  }

  static async getReimbursements(userId, role) {
    if (role === "EMP") {
      return await db
        .select()
        .from(reimbursements)
        .where(eq(reimbursements.employeeId, userId))
        .orderBy(desc(reimbursements.createdAt));
    }

    if (role === "RM") {
      return await db
        .select({
          id: reimbursements.id,
          employeeId: reimbursements.employeeId,
          title: reimbursements.title,
          description: reimbursements.description,
          amount: reimbursements.amount,
          rmApproval: reimbursements.rmApproval,
          apeApproval: reimbursements.apeApproval,
          finalStatus: reimbursements.finalStatus,
          createdAt: reimbursements.createdAt,
          updatedAt: reimbursements.updatedAt,
        })
        .from(reimbursements)
        .innerJoin(employeeManager, eq(reimbursements.employeeId, employeeManager.employeeId))
        .where(
          and(
            eq(employeeManager.managerId, userId),
            eq(reimbursements.rmApproval, "PENDING")
          )
        )
        .orderBy(desc(reimbursements.createdAt));
    }

    if (role === "APE") {
      return await db
        .select()
        .from(reimbursements)
        .where(
          and(
            eq(reimbursements.rmApproval, "APPROVED"),
            eq(reimbursements.apeApproval, "PENDING")
          )
        )
        .orderBy(desc(reimbursements.createdAt));
    }

    if (role === "CFO") {
      return await db
        .select()
        .from(reimbursements)
        .where(eq(reimbursements.apeApproval, "APPROVED"))
        .orderBy(desc(reimbursements.createdAt));
    }

    return [];
  }

  static async getSubordinateReimbursements(managerId, role, targetUserId) {
    if (role !== "RM") {
      throw new AppError("Forbidden: Only RM can access subordinate reimbursements explicitly", 403);
    }

    const [targetUser] = await db.select().from(users).where(eq(users.id, targetUserId)).limit(1);
    if (!targetUser) {
      throw new AppError("Employee not found", 404);
    }

    if (targetUser.role !== "EMP") {
      throw new AppError("Target user is not an EMP", 400);
    }

    const [mapping] = await db
      .select()
      .from(employeeManager)
      .where(
        and(
          eq(employeeManager.employeeId, targetUserId),
          eq(employeeManager.managerId, managerId)
        )
      )
      .limit(1);

    if (!mapping) {
      throw new AppError("Forbidden: Employee is not your subordinate", 403);
    }

    return await db
      .select()
      .from(reimbursements)
      .where(eq(reimbursements.employeeId, targetUserId))
      .orderBy(desc(reimbursements.createdAt));
  }
}

module.exports = ReimbursementService;
