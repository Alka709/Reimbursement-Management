"use strict";

const { eq, and, inArray } = require("drizzle-orm");
const { db } = require("../db");
const { users } = require("../db/schema/users.schema");
const { employeeManager } = require("../db/schema/employee_manager.schema");
const AppError = require("../utils/AppError");

class EmployeeService {
  static async assignEmployee(employeeId, managerId) {
    if (employeeId === managerId) {
      throw new AppError("Employee cannot be their own manager", 400);
    }

    // 1. Validate employee
    const [employee] = await db.select().from(users).where(eq(users.id, employeeId)).limit(1);
    if (!employee) throw new AppError("Employee not found", 404);
    if (employee.role !== "EMP") throw new AppError("Assigned user must have EMP role", 400);

    // 2. Validate manager
    const [manager] = await db.select().from(users).where(eq(users.id, managerId)).limit(1);
    if (!manager) throw new AppError("Manager not found", 404);
    if (manager.role !== "RM") throw new AppError("Manager must have RM role", 400);

    // 3. Validate mapping does not exist
    const [existingMapping] = await db
      .select()
      .from(employeeManager)
      .where(eq(employeeManager.employeeId, employeeId))
      .limit(1);
      
    if (existingMapping) {
      throw new AppError("Employee is already assigned to a manager", 400);
    }

    // 4. Create mapping
    const [mapping] = await db
      .insert(employeeManager)
      .values({ employeeId, managerId })
      .returning();

    return mapping;
  }

  static async removeEmployee(employeeId, managerId) {
    // 1. Find mapping
    const [existingMapping] = await db
      .select()
      .from(employeeManager)
      .where(
        and(
          eq(employeeManager.employeeId, employeeId),
          eq(employeeManager.managerId, managerId)
        )
      )
      .limit(1);

    if (!existingMapping) {
      throw new AppError("Mapping not found", 404);
    }

    // 2. Delete mapping
    await db
      .delete(employeeManager)
      .where(
        and(
          eq(employeeManager.employeeId, employeeId),
          eq(employeeManager.managerId, managerId)
        )
      );

    return { success: true };
  }

  static async getEmployees(userId, userRole) {
    if (userRole === "EMP") {
      throw new AppError("Forbidden: Insufficient permissions", 403);
    }

    if (userRole === "CFO") {
      return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      }).from(users);
    }

    if (userRole === "APE") {
      return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(inArray(users.role, ["EMP", "RM"]));
    }

    if (userRole === "RM") {
      return await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .innerJoin(employeeManager, eq(users.id, employeeManager.employeeId))
      .where(eq(employeeManager.managerId, userId));
    }

    throw new AppError("Forbidden: Unknown role", 403);
  }
}

module.exports = EmployeeService;
