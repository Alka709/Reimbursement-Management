"use strict";

const bcrypt = require("bcrypt");
const { eq } = require("drizzle-orm");
const { db } = require("../db");
const { users } = require("../db/schema/users.schema");
const { generateToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

class AuthService {
  static async register(name, email, password) {
    // 1. Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new AppError("Email is already in use", 400);
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user (Default role = EMP as per schema default)
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        // role defaults to "EMP"
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return newUser;
  }

  static async login(email, password) {
    // 1. Verify email exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // 3. Generate JWT (payload contains ONLY userId and role)
    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async logout() {
    // Handled in the controller by clearing the cookie
    return { success: true, message: "Logged out successfully" };
  }
}

module.exports = AuthService;
