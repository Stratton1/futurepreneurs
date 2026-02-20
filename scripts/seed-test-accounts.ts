/**
 * Seed script: Creates all test accounts from test-flows.md
 *
 * Usage:
 *   npx tsx scripts/seed-test-accounts.ts
 *
 * Prerequisites:
 *   - .env.local must have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set
 *   - npm install tsx (if not already installed)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

// Admin client (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_PASSWORD = "TestPass123!";

// -------------------------------------------------------------------
// 1. School
// -------------------------------------------------------------------
const SCHOOL = {
  name: "Greenfield Academy",
  email_domain: "greenfield.sch.uk",
  city: "Manchester",
  county: "Greater Manchester",
  is_active: true,
};

// -------------------------------------------------------------------
// 2. Test accounts (order matters — parents need to exist before linking)
// -------------------------------------------------------------------
interface TestAccount {
  email: string;
  full_name: string;
  role: "student" | "teacher" | "parent" | "investor" | "admin";
  needs_school: boolean;
  is_verified: boolean;
}

const ACCOUNTS: TestAccount[] = [
  // Teachers (create first so mentor dropdown works)
  {
    email: "d.clarke@greenfield.sch.uk",
    full_name: "Mr David Clarke",
    role: "teacher",
    needs_school: true,
    is_verified: true,
  },
  {
    email: "s.thompson@greenfield.sch.uk",
    full_name: "Ms Sarah Thompson",
    role: "teacher",
    needs_school: true,
    is_verified: true,
  },
  // Parents (create before students so parent_id linking works)
  {
    email: "rachel.watson@gmail.com",
    full_name: "Rachel Watson",
    role: "parent",
    needs_school: false,
    is_verified: true,
  },
  {
    email: "priya.patel@gmail.com",
    full_name: "Priya Patel",
    role: "parent",
    needs_school: false,
    is_verified: true,
  },
  // Students
  {
    email: "emma.watson@greenfield.sch.uk",
    full_name: "Emma Watson",
    role: "student",
    needs_school: true,
    is_verified: true,
  },
  {
    email: "james.patel@greenfield.sch.uk",
    full_name: "James Patel",
    role: "student",
    needs_school: true,
    is_verified: true,
  },
  // Investors
  {
    email: "tom.bridges@outlook.com",
    full_name: "Tom Bridges",
    role: "investor",
    needs_school: false,
    is_verified: true,
  },
  {
    email: "aisha.khan@yahoo.com",
    full_name: "Aisha Khan",
    role: "investor",
    needs_school: false,
    is_verified: true,
  },
  // Admins
  {
    email: "admin@futurepreneurs.co.uk",
    full_name: "Admin One",
    role: "admin",
    needs_school: false,
    is_verified: true,
  },
  {
    email: "admin2@futurepreneurs.co.uk",
    full_name: "Admin Two",
    role: "admin",
    needs_school: false,
    is_verified: true,
  },
];

// Student → Parent mapping
const PARENT_LINKS: Record<string, string> = {
  "emma.watson@greenfield.sch.uk": "rachel.watson@gmail.com",
  "james.patel@greenfield.sch.uk": "priya.patel@gmail.com",
};

async function main() {
  console.log("=== Futurepreneurs Test Account Seeder ===\n");

  // ------------------------------------------------------------------
  // Step 1: Upsert the test school
  // ------------------------------------------------------------------
  console.log("1. Setting up school: Greenfield Academy");

  // Check if school with this domain already exists
  const { data: existingSchool } = await supabase
    .from("schools")
    .select("id, name")
    .eq("email_domain", SCHOOL.email_domain)
    .single();

  let schoolId: string;

  if (existingSchool) {
    // Update existing record to match test-flows.md
    const { data: updated, error } = await supabase
      .from("schools")
      .update({
        name: SCHOOL.name,
        city: SCHOOL.city,
        county: SCHOOL.county,
        is_active: SCHOOL.is_active,
      })
      .eq("id", existingSchool.id)
      .select("id")
      .single();

    if (error) {
      console.error("   Failed to update school:", error.message);
      process.exit(1);
    }
    schoolId = updated!.id;
    console.log(
      `   Updated existing "${existingSchool.name}" → "Greenfield Academy" (${schoolId})`
    );
  } else {
    const { data: created, error } = await supabase
      .from("schools")
      .insert(SCHOOL)
      .select("id")
      .single();

    if (error) {
      console.error("   Failed to create school:", error.message);
      process.exit(1);
    }
    schoolId = created!.id;
    console.log(`   Created Greenfield Academy (${schoolId})`);
  }

  // ------------------------------------------------------------------
  // Step 2: Create auth users + profiles
  // ------------------------------------------------------------------
  console.log("\n2. Creating test accounts...\n");

  const emailToId: Record<string, string> = {};

  for (const account of ACCOUNTS) {
    // Check if user already exists
    const { data: existingUsers } =
      await supabase.auth.admin.listUsers();

    const existing = existingUsers?.users?.find(
      (u) => u.email === account.email
    );

    let userId: string;

    if (existing) {
      userId = existing.id;
      console.log(
        `   [skip] ${account.full_name} (${account.email}) — already exists (${userId})`
      );
    } else {
      // Create auth user (auto-confirmed)
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: account.email,
          password: TEST_PASSWORD,
          email_confirm: true,
        });

      if (authError) {
        console.error(
          `   [FAIL] ${account.full_name}: ${authError.message}`
        );
        continue;
      }
      userId = authUser.user.id;
      console.log(
        `   [auth] ${account.full_name} (${account.email}) → ${userId}`
      );
    }

    emailToId[account.email] = userId;

    // Upsert user profile
    const profileData: Record<string, unknown> = {
      id: userId,
      email: account.email,
      full_name: account.full_name,
      role: account.role,
      is_verified: account.is_verified,
      is_active: true,
      school_id: account.needs_school ? schoolId : null,
    };

    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert(profileData, { onConflict: "id" });

    if (profileError) {
      console.error(
        `   [FAIL] Profile for ${account.full_name}: ${profileError.message}`
      );
    } else {
      console.log(`   [profile] ${account.full_name} — ${account.role}`);
    }
  }

  // ------------------------------------------------------------------
  // Step 3: Link students to parents
  // ------------------------------------------------------------------
  console.log("\n3. Linking students to parents...\n");

  for (const [studentEmail, parentEmail] of Object.entries(PARENT_LINKS)) {
    const studentId = emailToId[studentEmail];
    const parentId = emailToId[parentEmail];

    if (!studentId || !parentId) {
      console.error(
        `   [FAIL] Could not link ${studentEmail} → ${parentEmail} (missing IDs)`
      );
      continue;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({ parent_id: parentId })
      .eq("id", studentId);

    if (error) {
      console.error(
        `   [FAIL] Link ${studentEmail} → ${parentEmail}: ${error.message}`
      );
    } else {
      console.log(`   [link] ${studentEmail} → ${parentEmail}`);
    }
  }

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log("\n=== Done! ===\n");
  console.log("School:   Greenfield Academy (greenfield.sch.uk)");
  console.log(`Accounts: ${Object.keys(emailToId).length} created/verified`);
  console.log(`Password: ${TEST_PASSWORD} (all accounts)`);
  console.log("\nYou can now test all flows from test-flows.md.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
