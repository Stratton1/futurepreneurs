/**
 * Flow 2 — Sign Up (All Roles)
 *
 * Tests the sign-up UI flow for each role, plus validation checks.
 * Actual account creation is done via the seed script to avoid email rate limits.
 *
 * Usage:
 *   1. Start the dev server: npm run dev
 *   2. Run: npx playwright test tests/flow-2-signup.spec.ts --reporter=list
 */

import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TEST_PASSWORD = "TestPass123!";

// Helper: go to signup, wait for role picker, click a role by its bold label text
async function selectRole(page: Page, roleLabel: string) {
  await page.goto(`${BASE_URL}/signup`);
  await expect(page.getByText("I am a...")).toBeVisible();
  await page
    .locator("button")
    .filter({ has: page.locator(`text="${roleLabel}"`) })
    .click();
}

// Helper: fill the sign-up form
async function fillSignUpForm(
  page: Page,
  fullName: string,
  email: string,
  password: string
) {
  await page.getByLabel("Full name").fill(fullName);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
}

// Helper: submit form
async function submitForm(page: Page) {
  await page.getByRole("button", { name: "Create Account" }).click();
}

// ================================================================
// Flow 2A — Student Sign-Up
// ================================================================
test.describe.serial("Flow 2A — Student Sign-Up", () => {
  test("2A.1: Sign-up page loads with role picker", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByText("I am a...")).toBeVisible();
    await expect(page.getByText("Join Futurepreneurs")).toBeVisible();
  });

  test("2A.2: Selecting Student shows correct form with school email hint", async ({
    page,
  }) => {
    await selectRole(page, "Student");
    await expect(page.getByText("Signing up as:")).toBeVisible();
    await expect(page.getByText("Student", { exact: true })).toBeVisible();
    await expect(
      page.getByText("You must use your school email address")
    ).toBeVisible();
  });

  test("2A.4: Non-school email rejected for students", async ({ page }) => {
    await selectRole(page, "Student");
    await fillSignUpForm(page, "Test Student", "test@gmail.com", TEST_PASSWORD);
    await submitForm(page);
    await expect(
      page.getByText("Students must sign up with a school email")
    ).toBeVisible({ timeout: 10000 });
  });

  test("2A.6: Change role link returns to role selection", async ({ page }) => {
    await selectRole(page, "Student");
    await expect(page.getByText("Signing up as:")).toBeVisible();
    await page.getByText("Change role").click();
    await expect(page.getByText("I am a...")).toBeVisible();
  });
});

// ================================================================
// Flow 2B — Teacher Sign-Up
// ================================================================
test.describe("Flow 2B — Teacher Sign-Up", () => {
  test("2B.1: Teacher form shows correctly", async ({ page }) => {
    await selectRole(page, "Teacher / Mentor");
    await expect(page.getByText("Signing up as:")).toBeVisible();
    await expect(
      page.getByText("Teacher / Mentor", { exact: true })
    ).toBeVisible();
    // Teachers should NOT see school email hint
    await expect(
      page.getByText("You must use your school email address")
    ).not.toBeVisible();
  });
});

// ================================================================
// Flow 2C — Parent Sign-Up
// ================================================================
test.describe("Flow 2C — Parent Sign-Up", () => {
  test("2C.1: Parent form shows correctly", async ({ page }) => {
    await selectRole(page, "Parent / Guardian");
    await expect(page.getByText("Signing up as:")).toBeVisible();
    await expect(
      page.getByText("Parent / Guardian", { exact: true })
    ).toBeVisible();
  });
});

// ================================================================
// Flow 2D — Investor Sign-Up
// ================================================================
test.describe("Flow 2D — Investor Sign-Up", () => {
  test("2D.1: Investor form shows correctly", async ({ page }) => {
    await selectRole(page, "Backer / Supporter");
    await expect(page.getByText("Signing up as:")).toBeVisible();
    await expect(
      page.getByText("Backer / Supporter", { exact: true })
    ).toBeVisible();
  });
});

// ================================================================
// Flow 2E — Validation Checks
// ================================================================
test.describe("Flow 2E — Validation Checks", () => {
  test("2E.2: Single-word name rejected", async ({ page }) => {
    await selectRole(page, "Parent / Guardian");
    await fillSignUpForm(
      page,
      "Emma",
      "validation-test@example.com",
      TEST_PASSWORD
    );
    await submitForm(page);
    await expect(
      page.getByText("Please enter your full name")
    ).toBeVisible({ timeout: 5000 });
  });

  test("2E.3: Weak password (no uppercase) rejected", async ({ page }) => {
    await selectRole(page, "Parent / Guardian");
    await fillSignUpForm(
      page,
      "Test User",
      "validation-test@example.com",
      "password"
    );
    await submitForm(page);
    await expect(page.getByText(/[Pp]assword must/)).toBeVisible({
      timeout: 5000,
    });
  });

  test("2E.4: Short password rejected", async ({ page }) => {
    await selectRole(page, "Parent / Guardian");
    await fillSignUpForm(
      page,
      "Test User",
      "validation-test@example.com",
      "Ab1"
    );
    await submitForm(page);
    await expect(page.getByText(/at least 8 characters/)).toBeVisible({
      timeout: 5000,
    });
  });

  test("2E.5: Password with no number rejected", async ({ page }) => {
    await selectRole(page, "Parent / Guardian");
    await fillSignUpForm(
      page,
      "Test User",
      "validation-test@example.com",
      "Abcdefgh"
    );
    await submitForm(page);
    await expect(page.getByText(/number/)).toBeVisible({ timeout: 5000 });
  });
});
