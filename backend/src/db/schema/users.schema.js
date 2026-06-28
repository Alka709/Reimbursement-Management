"use strict";

const {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
} = require("drizzle-orm/pg-core");

// ── Enums ─────────────────────────────────────────────────────────────────────
const roleEnum = pgEnum("role_enum", ["EMP", "RM", "APE", "CFO"]);

const approvalStatusEnum = pgEnum("approval_status_enum", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// ── Users table ───────────────────────────────────────────────────────────────
const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

  role: roleEnum("role").notNull().default("EMP"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

module.exports = { users, roleEnum, approvalStatusEnum };
