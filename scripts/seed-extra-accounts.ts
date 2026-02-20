/**
 * Creates the 5 additional test accounts (3rd of each role) to reach 15 total.
 * Uses the admin API to bypass email rate limits.
 *
 * Usage: npx tsx scripts/seed-extra-accounts.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_PASSWORD = "TestPass123!";

interface Account {
  email: string;
  full_name: string;
  role: "student" | "teacher" | "parent" | "investor" | "admin";
  needs_school: boolean;
  is_verified: boolean;
}

const EXTRA_ACCOUNTS: Account[] = [
  {
    email: "sophie.brown@greenfield.sch.uk",
    full_name: "Sophie Brown",
    role: "student",
    needs_school: true,
    is_verified: true,
  },
  {
    email: "r.hughes@greenfield.sch.uk",
    full_name: "Dr Robert Hughes",
    role: "teacher",
    needs_school: true,
    is_verified: true,
  },
  {
    email: "mark.brown@gmail.com",
    full_name: "Mark Brown",
    role: "parent",
    needs_school: false,
    is_verified: true,
  },
  {
    email: "lisa.chen@outlook.com",
    full_name: "Lisa Chen",
    role: "investor",
    needs_school: false,
    is_verified: true,
  },
  {
    email: "admin3@futurepreneurs.co.uk",
    full_name: "Admin Three",
    role: "admin",
    needs_school: false,
    is_verified: true,
  },
];

async function main() {
  console.log("=== Creating 5 Extra Test Accounts (3rd of each role) ===\n");

  // Get school ID for Greenfield Academy
  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("email_domain", "greenfield.sch.uk")
    .single();

  const schoolId = school?.id ?? null;
  if (!schoolId) {
    console.error("Could not find Greenfield Academy school record");
    process.exit(1);
  }

  for (const account of EXTRA_ACCOUNTS) {
    // Check if already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(
      (u) => u.email === account.email
    );

    let userId: string;

    if (existing) {
      userId = existing.id;
      console.log(`[skip] ${account.full_name} (${account.email}) — already exists`);
    } else {
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: account.email,
          password: TEST_PASSWORD,
          email_confirm: true,
        });

      if (authError) {
        console.error(`[FAIL] ${account.full_name}: ${authError.message}`);
        continue;
      }
      userId = authUser.user.id;
      console.log(`[auth] ${account.full_name} (${account.email}) → ${userId}`);
    }

    // Upsert profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          id: userId,
          email: account.email,
          full_name: account.full_name,
          role: account.role,
          is_verified: account.is_verified,
          is_active: true,
          school_id: account.needs_school ? schoolId : null,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error(`[FAIL] Profile for ${account.full_name}: ${profileError.message}`);
    } else {
      console.log(`[profile] ${account.full_name} — ${account.role}`);
    }
  }

  console.log("\n=== Done! Total test accounts: 15 (3 per role) ===");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
