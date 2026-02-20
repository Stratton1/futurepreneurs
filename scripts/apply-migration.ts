/**
 * Applies the initial database migration to a fresh Supabase project.
 * Connects directly to PostgreSQL using the database password.
 *
 * Usage: npx tsx scripts/apply-migration.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

// Extract project ref from URL (e.g. "fclidhnncjdhrinazkqn" from "https://fclidhnncjdhrinazkqn.supabase.co")
const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

const migrationSql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/001_initial_schema.sql"),
  "utf-8"
);

async function applyMigration() {
  console.log("=== Applying migration to Supabase ===\n");
  console.log(`Project ref: ${projectRef}\n`);

  const client = new pg.Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected!\n");

    console.log("Running migration...");
    await client.query(migrationSql);
    console.log("\nMigration applied successfully!");

    // Verify tables were created
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log("\nTables created:");
    result.rows.forEach((row) => console.log(`  - ${row.table_name}`));
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Migration failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration();
