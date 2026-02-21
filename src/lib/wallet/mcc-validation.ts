import { createAdminClient } from '@/lib/supabase/server';

/** Check if a Merchant Category Code is blocked platform-wide. */
export async function isBlockedMCC(mcc: string): Promise<{
  blocked: boolean;
  reason?: string;
}> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('blocked_mcc_categories')
    .select('category_name, reason')
    .eq('mcc', mcc)
    .single();

  if (data) {
    return { blocked: true, reason: `${data.category_name}: ${data.reason}` };
  }
  return { blocked: false };
}

/** Check if a vendor is on the project's allowlist. */
export async function isAllowedVendor(
  projectId: string,
  vendorName: string,
  vendorMcc?: string
): Promise<{
  allowed: boolean;
  hasAllowlist: boolean;
}> {
  const supabase = createAdminClient();

  // Check if project has any vendor allowlist entries
  const { data: allowlist } = await supabase
    .from('vendor_allowlists')
    .select('vendor_name, vendor_mcc')
    .eq('project_id', projectId);

  // If no allowlist, all vendors are allowed (no restrictions)
  if (!allowlist || allowlist.length === 0) {
    return { allowed: true, hasAllowlist: false };
  }

  // Check name match (case-insensitive)
  const nameMatch = allowlist.some(
    (v) => v.vendor_name.toLowerCase() === vendorName.toLowerCase()
  );
  if (nameMatch) return { allowed: true, hasAllowlist: true };

  // Check MCC match if provided
  if (vendorMcc) {
    const mccMatch = allowlist.some((v) => v.vendor_mcc === vendorMcc);
    if (mccMatch) return { allowed: true, hasAllowlist: true };
  }

  return { allowed: false, hasAllowlist: true };
}

/** Get all blocked MCC categories. */
export async function getBlockedMCCs(): Promise<
  { mcc: string; category_name: string; reason: string }[]
> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('blocked_mcc_categories')
    .select('mcc, category_name, reason')
    .order('category_name');

  return data ?? [];
}

/** Validate a transaction against all spending guards. */
export async function validateTransaction(
  projectId: string,
  vendorName: string,
  vendorMcc?: string
): Promise<{
  valid: boolean;
  reason?: string;
}> {
  // Check MCC block
  if (vendorMcc) {
    const mccCheck = await isBlockedMCC(vendorMcc);
    if (mccCheck.blocked) {
      return { valid: false, reason: `Blocked category: ${mccCheck.reason}` };
    }
  }

  // Check vendor allowlist
  const vendorCheck = await isAllowedVendor(projectId, vendorName, vendorMcc);
  if (vendorCheck.hasAllowlist && !vendorCheck.allowed) {
    return {
      valid: false,
      reason: 'Vendor is not on the approved vendor list for this project',
    };
  }

  return { valid: true };
}
