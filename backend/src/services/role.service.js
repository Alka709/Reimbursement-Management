"use strict";

const { eq } = require("drizzle-orm");
const { db } = require("../db");
const { users } = require("../db/schema/users.schema");
const AppError = require("../utils/AppError");

class RoleService {
  static async assignRole(userId, newRole) {
    const validRoles = ["EMP", "RM", "APE", "CFO"];
    
    if (!validRoles.includes(newRole)) {
      throw new AppError("Invalid role specified", 400);
    }

    // 1. Find user by id
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // 2. Prevent assigning same role again
    if (user.role === newRole) {
      throw new AppError(`User is already assigned the role ${newRole}`, 400);
    }

    // 3. Update role
    const [updatedUser] = await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    return updatedUser;
  }
}

module.exports = RoleService;
