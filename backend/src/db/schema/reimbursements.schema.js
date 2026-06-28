"use strict";

const {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
} = require("drizzle-orm/pg-core");
const { users, approvalStatusEnum } = require("./users.schema");

// ── Reimbursements table ──────────────────────────────────────────────────────
const reimbursements = pgTable("reimbursements", {
  id: uuid("id").defaultRandom().primaryKey(),

  employeeId: uuid("employee_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 255 }).notNull(),
  
  description: text("description"),

  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),

  rmApproval: approvalStatusEnum("rm_approval").notNull().default("PENDING"),
  
  apeApproval: approvalStatusEnum("ape_approval").notNull().default("PENDING"),
  
  finalStatus: approvalStatusEnum("final_status").notNull().default("PENDING"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

module.exports = { reimbursements };
