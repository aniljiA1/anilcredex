import {
  AuditFormData,
  AuditResult,
  ToolEntry,
  ToolRecommendation,
  ToolName,
  UseCase,
} from "@/types";
import { nanoid } from "nanoid";

// ─── Pricing data (sourced from official pages, see PRICING_DATA.md) ──────────
export const PRICING: Record<
  ToolName,
  Record<string, { perSeat: number; minSeats?: number; flatFee?: number }>
> = {
  cursor: {
    Hobby: { perSeat: 0 },
    Pro: { perSeat: 20 },
    Business: { perSeat: 40 },
    Enterprise: { perSeat: 100 }, // estimated, contact sales
  },
  "github-copilot": {
    Individual: { perSeat: 10 },
    Business: { perSeat: 19 },
    Enterprise: { perSeat: 39 },
  },
  claude: {
    Free: { perSeat: 0 },
    Pro: { perSeat: 20 },
    Max: { perSeat: 100 },
    Team: { perSeat: 30, minSeats: 5 },
    Enterprise: { perSeat: 60, minSeats: 5 },
    "API direct": { perSeat: 0 }, // variable, user enters actual spend
  },
  chatgpt: {
    Plus: { perSeat: 20 },
    Team: { perSeat: 30, minSeats: 2 },
    Enterprise: { perSeat: 60, minSeats: 150 },
    "API direct": { perSeat: 0 },
  },
  "anthropic-api": {
    "Pay-as-you-go": { perSeat: 0 },
  },
  "openai-api": {
    "Pay-as-you-go": { perSeat: 0 },
  },
  gemini: {
    Free: { perSeat: 0 },
    Advanced: { perSeat: 20 },
    API: { perSeat: 0 },
  },
  windsurf: {
    Free: { perSeat: 0 },
    Pro: { perSeat: 15 },
    Team: { perSeat: 35 },
  },
};

// Normalized monthly cost given plan + seats + actual spend (for API tools)
export function normalizedMonthlyCost(entry: ToolEntry): number {
  const planData = PRICING[entry.tool]?.[entry.plan];
  if (!planData) return entry.monthlySpend;
  if (planData.perSeat > 0) return planData.perSeat * entry.seats;
  // API/variable plans: trust the user-entered spend
  return entry.monthlySpend;
}

// ─── Per-tool recommendation logic ────────────────────────────────────────────

function auditCursor(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const current = normalizedMonthlyCost(entry);
  const seats = entry.seats;

  // Copilot Individual is $10/seat vs Cursor Pro $20/seat — if team ≤2 and use case is coding only
  if (entry.plan === "Pro" && seats <= 2 && useCase === "coding") {
    const projected = 10 * seats;
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Consider GitHub Copilot Individual",
      recommendedPlan: "GitHub Copilot Individual",
      projectedSpend: projected,
      monthlySavings: current - projected,
      reason: `At ${seats} seat(s), GitHub Copilot Individual ($10/seat) covers core code completion at half the price of Cursor Pro ($20/seat). For a solo or pair team focused on coding, the tab UX advantage of Cursor rarely justifies the 2× premium.`,
      severity: "consider-switching",
    };
  }

  if (entry.plan === "Business" && seats <= 3) {
    const projected = PRICING.cursor.Pro.perSeat * seats;
    const savings = current - projected;
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Downgrade to Cursor Pro",
      recommendedPlan: "Cursor Pro",
      projectedSpend: projected,
      monthlySavings: savings,
      reason: `Cursor Business ($40/seat) adds admin controls, privacy mode, and SSO — features that matter at 10+ seats. At ${seats} seats, Cursor Pro ($20/seat) has identical AI capabilities and saves $${savings}/mo.`,
      severity: savings > 0 ? "overspending" : "optimal",
    };
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "No change recommended",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `Your ${entry.plan} plan at ${seats} seat(s) is appropriately sized for your team.`,
    severity: "optimal",
  };
}

function auditGithubCopilot(
  entry: ToolEntry,
  useCase: UseCase,
  teamSize: number
): ToolRecommendation {
  const current = normalizedMonthlyCost(entry);
  const seats = entry.seats;

  if (entry.plan === "Business" && seats <= 3 && useCase === "coding") {
    const projected = PRICING["github-copilot"].Individual.perSeat * seats;
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Downgrade to Individual plan",
      recommendedPlan: "Individual",
      projectedSpend: projected,
      monthlySavings: current - projected,
      reason: `GitHub Copilot Business ($19/seat) adds org-wide policies, audit logs, and IP indemnity — relevant at scale. A ${seats}-person coding team is unlikely to need centralized policy enforcement yet; Individual ($10/seat) is sufficient.`,
      severity: "overspending",
    };
  }

  if (entry.plan === "Enterprise" && seats < 50) {
    const projected = PRICING["github-copilot"].Business.perSeat * seats;
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Downgrade to Business plan",
      recommendedPlan: "Business",
      projectedSpend: projected,
      monthlySavings: current - projected,
      reason: `Copilot Enterprise ($39/seat) unlocks Copilot in pull requests and org-wide custom models — valuable at 50+ developers. At ${seats} seats, the Business plan covers all practical daily use at $20/seat less.`,
      severity: "overspending",
    };
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "No change recommended",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `Copilot ${entry.plan} at ${seats} seat(s) is well-matched to your team size.`,
    severity: "optimal",
  };
}

function auditClaude(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const current = normalizedMonthlyCost(entry);
  const seats = entry.seats;

  if (entry.plan === "Max" && useCase !== "research" && seats === 1) {
    const projected = PRICING.claude.Pro.perSeat;
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Downgrade to Claude Pro",
      recommendedPlan: "Pro",
      projectedSpend: projected,
      monthlySavings: current - projected,
      reason: `Claude Max ($100/mo) gives 5× the usage limits of Pro. Unless you're hitting Claude Pro's limits daily for ${useCase} work, the 5× premium isn't justified. Try Pro for a billing cycle and upgrade if you hit limits.`,
      severity: "overspending",
    };
  }

  if (entry.plan === "Team" && seats <= 3) {
    const projected = PRICING.claude.Pro.perSeat * seats;
    const savings = current - projected;
    if (savings > 0) {
      return {
        tool: entry.tool,
        currentPlan: entry.plan,
        currentSpend: current,
        recommendedAction: "Switch to individual Claude Pro accounts",
        recommendedPlan: "Pro (per user)",
        projectedSpend: projected,
        monthlySavings: savings,
        reason: `Claude Team ($30/seat, min 5) at ${seats} seats means you're paying for ${Math.max(5, seats)} seats minimum. Three individual Pro plans ($20/seat) cost less and give the same model access without the admin overhead.`,
        severity: "overspending",
      };
    }
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "No change recommended",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `Claude ${entry.plan} at ${seats} seat(s) is appropriately matched to your workflow.`,
    severity: "optimal",
  };
}

function auditChatGPT(
  entry: ToolEntry,
  useCase: UseCase
): ToolRecommendation {
  const current = normalizedMonthlyCost(entry);
  const seats = entry.seats;

  if (entry.plan === "Plus" && seats > 1) {
    // Multiple Plus accounts — should be on Team
    const teamCost = PRICING.chatgpt.Team.perSeat * Math.max(2, seats);
    const savings = current - teamCost;
    if (savings > 0) {
      return {
        tool: entry.tool,
        currentPlan: entry.plan,
        currentSpend: current,
        recommendedAction: "Consolidate onto ChatGPT Team",
        recommendedPlan: "Team",
        projectedSpend: teamCost,
        monthlySavings: savings,
        reason: `Paying for ${seats} individual Plus accounts ($20/seat) instead of a Team plan ($30/seat, shared workspace, higher limits) costs more than Team at scale and loses collaborative features.`,
        severity: "overspending",
      };
    }
  }

  if (
    entry.plan === "Team" &&
    (useCase === "coding" || useCase === "data") &&
    seats <= 5
  ) {
    // Suggest Claude Team or API as alternative for coding/data
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Evaluate Claude Team as alternative",
      projectedSpend: current,
      monthlySavings: 0,
      reason: `For ${useCase} workloads, Claude's model strengths (long context, code analysis) may offer better output-per-dollar. Both are priced at $30/seat on team plans — worth a 2-week trial before renewing.`,
      severity: "consider-switching",
    };
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "No change recommended",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `ChatGPT ${entry.plan} at ${seats} seat(s) is well-sized for your team.`,
    severity: "optimal",
  };
}

function auditApiDirect(entry: ToolEntry): ToolRecommendation {
  const current = entry.monthlySpend;
  const perDev = current / Math.max(1, entry.seats);

  if (perDev > 200) {
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Audit API usage patterns & consider caching",
      projectedSpend: current * 0.6,
      monthlySavings: current * 0.4,
      reason: `$${perDev.toFixed(0)}/developer/month on direct API is high. Common culprits: no prompt caching, oversized context windows, dev/test traffic hitting production keys, or models not matched to task complexity (using claude-opus for simple tasks vs claude-haiku).`,
      severity: "overspending",
    };
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "Monitor usage growth",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `API spend of $${perDev.toFixed(0)}/developer/month is within normal range. Set budget alerts to catch unexpected spikes.`,
    severity: "optimal",
  };
}

function auditGemini(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const current = normalizedMonthlyCost(entry);
  const seats = entry.seats;

  if (entry.plan === "Advanced" && useCase === "coding") {
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Consider Cursor or GitHub Copilot instead",
      projectedSpend: Math.min(current, 10 * seats),
      monthlySavings: Math.max(0, current - 10 * seats),
      reason: `Gemini Advanced ($20/seat) is a general-purpose assistant. For coding specifically, purpose-built IDE tools like GitHub Copilot Individual ($10/seat) offer deeper editor integration and code-specific training at half the price.`,
      severity: "consider-switching",
    };
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "No change recommended",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `Gemini ${entry.plan} is cost-appropriate for your use case.`,
    severity: "optimal",
  };
}

function auditWindsurf(entry: ToolEntry): ToolRecommendation {
  const current = normalizedMonthlyCost(entry);
  const seats = entry.seats;

  if (entry.plan === "Team" && seats <= 3) {
    const projected = PRICING.windsurf.Pro.perSeat * seats;
    return {
      tool: entry.tool,
      currentPlan: entry.plan,
      currentSpend: current,
      recommendedAction: "Downgrade to Windsurf Pro",
      recommendedPlan: "Pro",
      projectedSpend: projected,
      monthlySavings: current - projected,
      reason: `Windsurf Team ($35/seat) adds centralized billing and admin seats — useful at 5+ developers. At ${seats} seats, Pro ($15/seat) covers all AI coding features at less than half the price.`,
      severity: "overspending",
    };
  }

  return {
    tool: entry.tool,
    currentPlan: entry.plan,
    currentSpend: current,
    recommendedAction: "No change recommended",
    projectedSpend: current,
    monthlySavings: 0,
    reason: `Windsurf ${entry.plan} is well-matched for your team.`,
    severity: "optimal",
  };
}

// ─── Main engine ──────────────────────────────────────────────────────────────

export function runAudit(formData: AuditFormData): AuditResult {
  const recommendations: ToolRecommendation[] = formData.tools.map((entry) => {
    switch (entry.tool) {
      case "cursor":
        return auditCursor(entry, formData.useCase);
      case "github-copilot":
        return auditGithubCopilot(entry, formData.useCase, formData.teamSize);
      case "claude":
        return auditClaude(entry, formData.useCase);
      case "chatgpt":
        return auditChatGPT(entry, formData.useCase);
      case "anthropic-api":
      case "openai-api":
        return auditApiDirect(entry);
      case "gemini":
        return auditGemini(entry, formData.useCase);
      case "windsurf":
        return auditWindsurf(entry);
      default:
        return {
          tool: entry.tool,
          currentPlan: entry.plan,
          currentSpend: normalizedMonthlyCost(entry),
          recommendedAction: "No change recommended",
          projectedSpend: normalizedMonthlyCost(entry),
          monthlySavings: 0,
          reason: "No audit rule available for this tool.",
          severity: "optimal",
        } as ToolRecommendation;
    }
  });

  const totalMonthlySpend = recommendations.reduce(
    (s, r) => s + r.currentSpend,
    0
  );
  const totalProjectedSpend = recommendations.reduce(
    (s, r) => s + r.projectedSpend,
    0
  );
  const totalMonthlySavings = totalMonthlySpend - totalProjectedSpend;
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isOptimal = totalMonthlySavings < 10;

  return {
    id: nanoid(10),
    formData,
    recommendations,
    totalMonthlySpend,
    totalProjectedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    aiSummary: "", // filled by API route
    isOptimal,
    createdAt: new Date().toISOString(),
  };
}
