// In-memory store for demo purposes.
// Replace with Supabase/Postgres in production (see ARCHITECTURE.md).
import { AuditResult, LeadData } from "@/types";

const store = new Map<string, AuditResult>();
const leads = new Map<string, LeadData>();

export function saveAudit(result: AuditResult): void {
  store.set(result.id, result);
}

export function getAudit(id: string): AuditResult | null {
  return store.get(id) ?? null;
}

export function saveLead(lead: LeadData): void {
  leads.set(lead.auditId, lead);
}

export function getLead(auditId: string): LeadData | null {
  return leads.get(auditId) ?? null;
}

// Public-safe version strips email & company
export function publicAudit(result: AuditResult): Partial<AuditResult> {
  const { formData, ...rest } = result;
  const { companyName, ...publicFormData } = formData;
  return { ...rest, formData: publicFormData };
}
