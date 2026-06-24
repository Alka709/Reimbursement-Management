"use strict";

/**
 * CFO seed script.
 *
 * Creates one CFO account if it doesn't already exist.
 * Run via:  npm run db:seed-data
 */

require("dotenv").config();
const bcrypt = require("bcrypt");
const { db } = require("../index");
const { users } = require("../schema/users.schema");
const { eq } = require("drizzle-orm");

const CFO_EMAIL    = "cfo@org.com";
const CFO_PASSWORD = "CFO#ORG@April2026";
const CFO_NAME     = "CFO Admin";
const SALT_ROUNDS  = 10;

async function seed() {
  console.log("🌱  Running CFO seed...");

  // Check if CFO already exists to keep the script idempotent
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, CFO_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log("✅  CFO account already exists – skipping seed.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(CFO_PASSWORD, SALT_ROUNDS);

  await db.insert(users).values({
    name: CFO_NAME,
    email: CFO_EMAIL,
    passwordHash,
    role: "CFO",
  });

  console.log(`✅  CFO account created  →  ${CFO_EMAIL}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
