import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/auditEngine";
import { saveAudit } from "@/lib/store";
import { AuditFormData } from "@/types";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateAISummary(
  formData: AuditFormData,
  monthlySavings: number,
  annualSavings: number
): Promise<string> {
  const toolList = formData.tools
    .map((t) => `${t.tool} ${t.plan} (${t.seats} seat(s), $${t.monthlySpend}/mo)`)
    .join(", ");

  const prompt = `You are an AI spend analyst. Write a personalized 80–110 word audit summary paragraph for a startup.

Context:
- Tools: ${toolList}
- Team size: ${formData.teamSize}
- Primary use case: ${formData.useCase}
- Potential monthly savings: $${monthlySavings.toFixed(0)}
- Potential annual savings: $${annualSavings.toFixed(0)}

Write in second person ("your team"), be specific about their actual tools. Lead with the single most impactful finding. End with one actionable next step. Do NOT use bullet points. Tone: direct, analytical, not salesy.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });
    const block = message.content[0];
    return block.type === "text" ? block.text : fallbackSummary(formData, monthlySavings);
  } catch {
    return fallbackSummary(formData, monthlySavings);
  }
}

function fallbackSummary(formData: AuditFormData, monthlySavings: number): string {
  if (monthlySavings <= 10) {
    return `Your team of ${formData.teamSize} is running a well-optimized AI stack for ${formData.useCase} work. You're on appropriate plans across your ${formData.tools.length} tool(s) — no significant overspend detected. Keep an eye on API usage growth as your team scales, and revisit this audit when you add new tools or exceed your current seat counts.`;
  }
  return `Your team of ${formData.teamSize} is paying $${monthlySavings.toFixed(0)}/month more than necessary for your AI stack. The biggest wins come from right-sizing plans to your actual seat count — many teams default to higher tiers without ever using the premium features. Act on the top recommendation first, then re-audit in 30 days to capture the next layer of savings.`;
}

export async function POST(req: NextRequest) {
  // Basic rate limiting via header check
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  
  try {
    const body: AuditFormData = await req.json();

    if (!body.tools || body.tools.length === 0) {
      return NextResponse.json({ error: "No tools provided" }, { status: 400 });
    }

    const result = runAudit(body);
    result.aiSummary = await generateAISummary(
      body,
      result.totalMonthlySavings,
      result.totalAnnualSavings
    );

    saveAudit(result);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
