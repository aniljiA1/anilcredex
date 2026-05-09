export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface ToolEntry {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
  companyName?: string;
}

export interface ToolRecommendation {
  tool: ToolName;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  projectedSpend: number;
  monthlySavings: number;
  reason: string;
  severity: "overspending" | "optimal" | "consider-switching";
}

export interface AuditResult {
  id: string;
  formData: AuditFormData;
  recommendations: ToolRecommendation[];
  totalMonthlySpend: number;
  totalProjectedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  isOptimal: boolean;
  createdAt: string;
}

export interface LeadData {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
}

export const TOOL_PLANS: Record<ToolName, string[]> = {
  cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  "github-copilot": ["Individual", "Business", "Enterprise"],
  claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  chatgpt: ["Plus", "Team", "Enterprise", "API direct"],
  "anthropic-api": ["Pay-as-you-go"],
  "openai-api": ["Pay-as-you-go"],
  gemini: ["Free", "Advanced", "API"],
  windsurf: ["Free", "Pro", "Team"],
};

export const TOOL_LABELS: Record<ToolName, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};
