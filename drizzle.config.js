"use strict";

/** @type {import("drizzle-kit").Config} */
module.exports = {
  dialect: "postgresql",
  schema: "./src/db/schema/index.js",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};
