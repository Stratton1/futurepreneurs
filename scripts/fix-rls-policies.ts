/**
 * Adds missing RLS policies to fix mentor selection and other access issues.
 * Usage: SUPABASE_DB_PASSWORD='...' npx tsx scripts/fix-rls-policies.ts
 */

import pg from "pg";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ref = new URL(url).hostname.split(".")[0];

async function main() {
  const client = new pg.Client({
    host: `db.${ref}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected. Applying RLS policies...\n");

  const policies = [
    {
      name: "Authenticated users can view all profiles",
      sql: `CREATE POLICY "Authenticated users can view all profiles"
            ON user_profiles FOR SELECT
            USING (auth.uid() IS NOT NULL);`,
    },
    {
      name: "Students can create projects",
      sql: `CREATE POLICY "Students can create projects"
            ON projects FOR INSERT
            WITH CHECK (auth.uid() = student_id);`,
    },
    {
      name: "Students can update own projects",
      sql: `CREATE POLICY "Students can update own projects"
            ON projects FOR UPDATE
            USING (auth.uid() = student_id);`,
    },
    {
      name: "Anyone can view milestones",
      sql: `CREATE POLICY "Anyone can view milestones"
            ON milestones FOR SELECT USING (true);`,
    },
    {
      name: "Project owners can create milestones",
      sql: `CREATE POLICY "Project owners can create milestones"
            ON milestones FOR INSERT
            WITH CHECK (
              project_id IN (SELECT id FROM projects WHERE student_id = auth.uid())
            );`,
    },
    {
      name: "Students and parents can view consent records",
      sql: `CREATE POLICY "Students and parents can view consent records"
            ON parental_consents FOR SELECT
            USING (student_id = auth.uid() OR parent_id = auth.uid());`,
    },
    {
      name: "Students can create consent records",
      sql: `CREATE POLICY "Students can create consent records"
            ON parental_consents FOR INSERT
            WITH CHECK (student_id = auth.uid());`,
    },
    {
      name: "Parents can update consent records",
      sql: `CREATE POLICY "Parents can update consent records"
            ON parental_consents FOR UPDATE
            USING (parent_id = auth.uid());`,
    },
    {
      name: "System can insert notifications",
      sql: `CREATE POLICY "System can insert notifications"
            ON notifications FOR INSERT WITH CHECK (true);`,
    },
    {
      name: "Parents can view children projects",
      sql: `CREATE POLICY "Parents can view children projects"
            ON projects FOR SELECT
            USING (
              student_id IN (
                SELECT id FROM user_profiles WHERE parent_id = auth.uid()
              )
            );`,
    },
  ];

  for (const policy of policies) {
    try {
      await client.query(policy.sql);
      console.log(`  [ok] ${policy.name}`);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message.includes("already exists")) {
        console.log(`  [skip] ${policy.name} (already exists)`);
      } else {
        console.log(`  [FAIL] ${policy.name}: ${error.message}`);
      }
    }
  }

  await client.end();
  console.log("\nDone!");
}

main();
