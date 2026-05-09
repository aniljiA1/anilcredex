import { runAudit, normalizedMonthlyCost, PRICING } from "../lib/auditEngine";
import { AuditFormData, ToolEntry } from "../types";

// ── normalizedMonthlyCost ────────────────────────────────────────────────────

test("normalizedMonthlyCost uses perSeat pricing when available", () => {
  const entry: ToolEntry = { tool: "cursor", plan: "Pro", seats: 3, monthlySpend: 999 };
  expect(normalizedMonthlyCost(entry)).toBe(60); // 20 × 3
});

test("normalizedMonthlyCost uses user-entered spend for API tools", () => {
  const entry: ToolEntry = { tool: "anthropic-api", plan: "Pay-as-you-go", seats: 1, monthlySpend: 450 };
  expect(normalizedMonthlyCost(entry)).toBe(450);
});

// ── Cursor ───────────────────────────────────────────────────────────────────

test("Cursor Business with ≤3 seats recommends downgrade to Pro", () => {
  const form: AuditFormData = {
    tools: [{ tool: "cursor", plan: "Business", seats: 2, monthlySpend: 80 }],
    teamSize: 4,
    useCase: "coding",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.recommendedPlan).toBe("Cursor Pro");
  expect(rec.monthlySavings).toBe(40); // (40-20) × 2
});

test("Cursor Pro with 1 seat for coding suggests Copilot Individual", () => {
  const form: AuditFormData = {
    tools: [{ tool: "cursor", plan: "Pro", seats: 1, monthlySpend: 20 }],
    teamSize: 1,
    useCase: "coding",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("consider-switching");
  expect(rec.monthlySavings).toBe(10); // 20 - 10
});

test("Cursor Pro with 10 seats is marked optimal", () => {
  const form: AuditFormData = {
    tools: [{ tool: "cursor", plan: "Pro", seats: 10, monthlySpend: 200 }],
    teamSize: 12,
    useCase: "mixed",
  };
  const result = runAudit(form);
  expect(result.recommendations[0].severity).toBe("optimal");
});

// ── GitHub Copilot ───────────────────────────────────────────────────────────

test("GitHub Copilot Business with ≤3 seats recommends Individual", () => {
  const form: AuditFormData = {
    tools: [{ tool: "github-copilot", plan: "Business", seats: 3, monthlySpend: 57 }],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.recommendedPlan).toBe("Individual");
  expect(rec.monthlySavings).toBe(27); // (19-10) × 3
});

test("GitHub Copilot Enterprise under 50 seats recommends Business", () => {
  const form: AuditFormData = {
    tools: [{ tool: "github-copilot", plan: "Enterprise", seats: 20, monthlySpend: 780 }],
    teamSize: 22,
    useCase: "coding",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.recommendedPlan).toBe("Business");
  expect(rec.monthlySavings).toBe(400); // (39-19) × 20
});

// ── Claude ───────────────────────────────────────────────────────────────────

test("Claude Max single seat non-research recommends Pro downgrade", () => {
  const form: AuditFormData = {
    tools: [{ tool: "claude", plan: "Max", seats: 1, monthlySpend: 100 }],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.recommendedPlan).toBe("Pro");
  expect(rec.monthlySavings).toBe(80); // 100 - 20
});

test("Claude Team with 3 seats recommends individual Pro accounts", () => {
  const form: AuditFormData = {
    tools: [{ tool: "claude", plan: "Team", seats: 3, monthlySpend: 90 }],
    teamSize: 3,
    useCase: "writing",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  // 3 Pro accounts = $60 vs Team minimum billing of 5 × $30 = $150... 
  // But our normalizedMonthlyCost for Team = 30 × 3 = 90; Pro = 20 × 3 = 60
  expect(rec.monthlySavings).toBe(30); // 90 - 60
});

// ── API direct ───────────────────────────────────────────────────────────────

test("Anthropic API above $200/dev flags for optimization", () => {
  const form: AuditFormData = {
    tools: [{ tool: "anthropic-api", plan: "Pay-as-you-go", seats: 3, monthlySpend: 900 }],
    teamSize: 3,
    useCase: "coding",
  };
  const result = runAudit(form);
  const rec = result.recommendations[0];
  expect(rec.severity).toBe("overspending");
  expect(rec.monthlySavings).toBeCloseTo(360, 0); // 40% of 900
});

// ── runAudit integration ─────────────────────────────────────────────────────

test("runAudit totals are calculated correctly", () => {
  const form: AuditFormData = {
    tools: [
      { tool: "cursor", plan: "Business", seats: 2, monthlySpend: 80 }, // saves $40
      { tool: "github-copilot", plan: "Individual", seats: 2, monthlySpend: 20 }, // optimal
    ],
    teamSize: 4,
    useCase: "coding",
  };
  const result = runAudit(form);
  expect(result.totalMonthlySpend).toBe(100); // 80 + 20
  expect(result.totalMonthlySavings).toBeCloseTo(40, 0);
  expect(result.totalProjectedSpend).toBeCloseTo(60, 0);
  expect(result.totalAnnualSavings).toBeCloseTo(480, 0);
});

test("runAudit with all-optimal tools returns isOptimal=true", () => {
  const form: AuditFormData = {
    tools: [
      { tool: "cursor", plan: "Pro", seats: 5, monthlySpend: 100 },
      { tool: "github-copilot", plan: "Business", seats: 10, monthlySpend: 190 },
    ],
    teamSize: 12,
    useCase: "coding",
  };
  const result = runAudit(form);
  expect(result.isOptimal).toBe(true);
  expect(result.totalMonthlySavings).toBeLessThan(10);
});
