"use strict";

const {
  pgTable,
  uuid,
  timestamp,
  check,
} = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");
const { users } = require("./users.schema");

// ── Employee–Manager relationship table ───────────────────────────────────────
const employeeManager = pgTable(
  "employee_manager",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    
    employeeId: uuid("employee_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
      
    managerId: uuid("manager_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
      
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    checkNotSameUser: check(
      "employee_manager_not_same_user_check",
      sql`${table.employeeId} != ${table.managerId}`
    ),
  })
);

module.exports = { employeeManager };
